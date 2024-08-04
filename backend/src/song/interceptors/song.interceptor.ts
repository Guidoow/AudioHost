import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { path as ffmpeg_path } from '@ffmpeg-installer/ffmpeg';
import { FileFilterCallback, diskStorage } from 'multer';
import { extname, basename } from 'path';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { unlink } from 'fs';

import * as ffmpeg from 'fluent-ffmpeg';
import * as sharp from 'sharp';

import { ValidatorService } from '../services/validator.service';

import path from '../../path';

type customCallback = (error: Error | null, filename: string) => void;

interface MulterFile extends Express.Multer.File {}

ffmpeg.setFfmpegPath(ffmpeg_path);

@Injectable()
export class FileInterceptor implements NestInterceptor {
  private fileInterceptor: NestInterceptor;

  constructor(private readonly validator: ValidatorService) {
    const { fileFilter, destination, filename } = this;
    const storage = diskStorage({ destination, filename });
    const limits = { fileSize: 1.1 * 1024 * 1024 * 1024 };
    const uploadFields = [
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ];

    this.fileInterceptor = new (FileFieldsInterceptor(uploadFields, {
      fileFilter,
      storage,
      limits,
    }))();
  }

  private destination(
    _req: Request,
    file: MulterFile,
    callback: customCallback,
  ) {
    const type = file.fieldname === 'image' ? 'image' : 'audio';
    callback(null, path.uploads[type]);
  }

  private filename(_req: Request, file: MulterFile, callback: customCallback) {
    const type = file.fieldname === 'image' ? 'image' : 'audio';
    const newFilename =
      Date.now().toString(36) +
      type +
      Math.random().toString(24).slice(2) +
      extname(file.originalname);

    callback(null, newFilename);
  }

  private async fileFilter(
    req: any,
    file: MulterFile,
    callback: FileFilterCallback | any,
  ) {
    const audioMimeTypes = new Set([
      'audio/mpeg',
      'audio/mp4',
      'audio/flac',
      'audio/x-flac',
      'audio/wav',
      'audio/x-wav',
      'audio/wave',
      'audio/x-pn-wav',
      'audio/aac',
      'audio/x-m4a',
      'audio/m4a',
      'audio/ogg',
      'audio/vorbis',
      'audio/vnd.wav',
    ]);

    const imageMimeTypes = new Set([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/tiff',
    ]);

    const mime = file.mimetype;
    const field =
      file.fieldname.charAt(0).toUpperCase() + file.fieldname.slice(1);

    const isImage = field === 'Image' && mime.startsWith('image/');
    const isAudio = field === 'Audio' && mime.startsWith('audio/');

    if (!(audioMimeTypes.has(mime) || imageMimeTypes.has(mime))) {
      const response = `${field} file mime type not supported: ${file.mimetype}.`;

      callback(new BadRequestException(response), false);
    }

    // validates audio is the first file to be uploaded
    if (!isAudio && !isImage) {
      if (field === 'Audio' && !file.mimetype.startsWith('audio/'))
        callback(
          new BadRequestException('audio File must be an audio type'),
          false,
        );

      if (field === 'Image' && !file.mimetype.startsWith('image/'))
        callback(
          new BadRequestException('image File must be an image type'),
          false,
        );
    }

    if (!req.audioUploaded && file.fieldname !== 'audio')
      callback(
        new BadRequestException(
          'audio File must be first field in the request',
        ),
        false,
      );

    if (isAudio) req.audioUploaded = true;

    if (isAudio || isImage) return callback(null, true);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    await this.validator.validate(request);
    await this.fileInterceptor.intercept(context, next);

    const { valid, exception } = await this.validator.validateFields(request);
    const files = request.files;

    if (!valid) {
      const selectedFiles = [files.audio[0]?.path, files.image?.[0]?.path];
      const filteredFiles = selectedFiles.filter((f) => f);

      this.turnback(filteredFiles, exception);
    }

    const { audioConverted, audioFile } = await this.convertAudio(
      files.audio[0],
    );

    request.files.audio = audioFile;

    if (audioConverted) {
      if (files.image) {
        const { imageConverted, imageFile } = await this.convertImage(
          files.image[0],
        );

        if (imageConverted) request.files.image = imageFile;
        else request.files.image = null;
      }
    } else throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);

    return next.handle();
  }

  private async convertAudio(
    file: Express.Multer.File,
  ): Promise<{ audioConverted: boolean; audioFile: object }> {
    const iniPath = file.path;

    const audioFile = this.formatFile(file, 'audio');

    const audioConverted: boolean = await new Promise((resolve, reject) => {
      ffmpeg(iniPath)
        .toFormat('wav')
        .on('end', (_) => resolve(true))
        .on('error', (_err) => reject(false))
        .save(audioFile.path);
    });

    await this.removeFile(iniPath);

    return { audioConverted, audioFile };
  }

  private async convertImage(
    file: Express.Multer.File,
  ): Promise<{ imageConverted: boolean; imageFile: object }> {
    const iniPath = file.path;

    const imageFile = this.formatFile(file, 'image');

    const imageConverted = await sharp(iniPath)
      .toFormat('webp')
      .toFile(imageFile.path)
      .then((_) => true)
      .catch((_) => false);

    await this.removeFile(iniPath);

    return { imageConverted, imageFile };
  }

  private async removeFile(input: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      unlink(input, (error) => {
        if (error) reject(false);
        resolve(true);
      });
    });
  }

  private formatFile(
    file: Express.Multer.File,
    type: 'image' | 'audio',
  ): Express.Multer.File {
    const ext = type === 'image' ? '.webp' : '.wav';

    const root = path.storage[type];
    const filename = basename(file.path, extname(file.path)) + ext;
    const fpath = root + filename;

    file.path = fpath;
    file.destination = root;
    file.filename = filename;

    return file;
  }

  /**
   * Turns back the process by deleting the files necessarily uploaded by multer, given a filepath list.
   * @param { Array } files - Array containing files paths to be deleted.
   * @param { HttpException } exception - the exception to be throwed.
   * @returns an exception representing the response to the request.
   */
  private turnback(files: string[], exception: HttpException) {
    try {
      files.forEach((path) => this.removeFile(path));
    } catch (error) {}

    throw exception;
  }
}
