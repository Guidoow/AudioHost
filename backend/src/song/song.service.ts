import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { AudioService } from './services/audio.service';
import { CustomRequest, HttpResponse } from 'src/types';
import { AmountQueryDto, CreateSongDto } from 'src/dto';
import { Song } from '@prisma/client';
import { unlink } from 'fs';

@Injectable()
export class SongService {
  private defaultImage = 'default-song.png';

  constructor(
    private readonly prisma: PrismaService,
    private readonly audio: AudioService,
  ) {}

  async create(request: CustomRequest, dto: CreateSongDto) {
    const UUID = request.client.UUID;
    const { title, author, files } = dto;

    if (request.client.Song) {
      await this.removeFile('/app/stored/audio/' + files.audio.filename);
      await this.removeFile(
        '/app/stored/image/' + files.image?.filename || this.defaultImage,
      );

      throw new HttpException(
        'Client already created a song.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const wave100 = await this.audio.wave(files.audio.filename, 100);
    const wave220 = await this.audio.wave(files.audio.filename, 220);

    const comments = Math.floor(
      Number(Number(Math.random() * 5000 * Math.random()).toFixed()),
    );

    const saved = Math.floor(
      Number(Number(Math.random() * 1500 * Math.random()).toFixed()),
    );

    const song = await this.prisma.song.create({
      data: {
        title,
        author,
        wave100,
        wave220,
        comments,
        saved,
        src: files.audio.filename,
        client: { connect: { UUID } },
        image: files.image?.filename || this.defaultImage,
      },
    });

    if (song) return new HttpResponse(`Song created: ${song.title}.`);

    throw new HttpException(
      'Error while trying to create the song.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async findAll() {
    return await this.prisma.song.findMany();
  }

  async findAmount(amount: number, query: AmountQueryDto) {
    switch (query.filter) {
      case 'random':
        return (
          (await this.prisma.song.aggregateRaw({
            pipeline: [{ $sample: { size: amount } }],
          })) as unknown as Song[]
        ).map((song) => {
          song.date = song.date['$date'];
          return song;
        });

      case 'recent':
        return await this.prisma.song.findMany({
          orderBy: { date: 'desc' },
          take: amount,
        });

      case 'older':
        return await this.prisma.song.findMany({
          orderBy: { date: 'asc' },
          take: amount,
        });

      case 'relevant':
        return await this.prisma.song.findMany({
          orderBy: { likes: 'desc' },
          take: amount,
        });

      default:
        return [];
    }
  }

  async findSearch(search: string) {
    return await this.prisma.song.findMany({
      where: {
        OR: [
          { author: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
        ],
      },
    });
  }

  async findOne(UUID: string) {
    return await this.prisma.song.findUnique({
      where: { UUID },
    });
  }

  async remove(request: CustomRequest) {
    if (request.client.Song) {
      const song = await this.prisma.song.delete({
        where: { UUID: request.client.UUID },
      });

      await this.removeFile('/app/stored/audio/' + song.src);
      await this.removeFile('/app/stored/image/' + song.image);

      if (song) return new HttpResponse(`Song deleted: ${song.title}.`);
    }

    throw new HttpException(
      'The client does not have a song registered.',
      HttpStatus.BAD_REQUEST,
    );
  }

  private async removeFile(input: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      unlink(input, (error) => {
        if (error) reject(false);
        resolve(true);
      });
    });
  }
}
