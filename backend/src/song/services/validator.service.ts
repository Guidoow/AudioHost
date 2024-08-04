import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';

import { PrismaService } from 'src/prisma/prisma.service';
import { CustomRequest } from 'src/types';
import { CreateSongDto } from 'src/dto';

@Injectable()
export class ValidatorService {
  constructor(private prisma: PrismaService) {}

  public async validate(request: CustomRequest): Promise<void> {
    if (request.is('multipart/form-data')) {
      await this.validateAuthorized(request);
    } else
      throw new HttpException(
        "Request must be 'multipart/form-data' type.",
        HttpStatus.BAD_REQUEST,
      );
  }

  public async validateFields(
    request: Request,
  ): Promise<{ valid: boolean; exception: null | HttpException }> {
    const dto = plainToClass(CreateSongDto, request.body);
    const errors = await validate(dto);
    console.log('errors', errors);
    if (errors.length > 0) {
      const errorsList = errors.flatMap((err) =>
        Object.values(err.constraints).map(
          (constraint) => `${err.property} ${constraint}`,
        ),
      );

      const exception = new HttpException(errorsList, HttpStatus.BAD_REQUEST);

      return { valid: false, exception };
    }

    return { valid: true, exception: null };
  }

  private async validateAuthorized(request: Request): Promise<void> {
    const IP = request.ip || request.ips[0];

    const client = await this.prisma.client.findUnique({
      where: { IP },
      include: { Song: true },
    });

    if (client?.Song) {
      throw new HttpException(
        'NON AUTHORIZED: You already posted a song.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
