import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpResponse, CustomRequest } from 'src/types';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async like(request: CustomRequest, UUID: string) {
    const cliUUID = request.client.UUID;

    const client = await this.prisma.client.findUnique({
      where: { UUID: cliUUID },
    });

    const actionAddLike = client.likes.includes(UUID);

    const clientLikes = actionAddLike
      ? client.likes.filter((e) => e !== UUID)
      : { push: UUID };

    const updated = await this.prisma.client.update({
      where: { UUID: cliUUID },
      data: { likes: clientLikes },
    });

    if (!updated)
      throw new HttpException(
        'Error while trying to do like.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const songLikes = actionAddLike ? { decrement: 1 } : { increment: 1 };

    const songUpdated = await this.prisma.song.update({
      where: { UUID },
      data: { likes: songLikes },
    });

    if (!songUpdated)
      throw new HttpException(
        'Error while trying to do like.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return new HttpResponse('Like updated for ' + UUID);
  }

  async view(request: CustomRequest, UUID: string) {
    const cliUUID = request.client.UUID;

    const client = await this.prisma.client.findUnique({
      where: { UUID: cliUUID },
    });

    const actionAddView = client.views.includes(UUID);

    if (actionAddView)
      throw new HttpException('Song already viewed.', HttpStatus.BAD_REQUEST);

    const updated = await this.prisma.client.update({
      where: { UUID: cliUUID },
      data: { views: { push: UUID } },
    });

    if (!updated)
      throw new HttpException(
        'Error while trying to do view.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const songUpdated = await this.prisma.song.update({
      where: { UUID },
      data: { views: { increment: 1 } },
    });

    if (!songUpdated)
      throw new HttpException(
        'Error while trying to do view.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return new HttpResponse('View updated for ' + UUID);
  }
}
