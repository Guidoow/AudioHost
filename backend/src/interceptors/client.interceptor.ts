import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { CustomRequest } from 'src/types/CustomRequest.type';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request: CustomRequest = context.switchToHttp().getRequest();

    const IP = request.ip || request.ips[0];

    request.client = await this.prisma.client.findUnique({
      where: { IP },
      include: { Song: true },
    });

    if (!request.client) {
      const UUID = randomUUID();

      const client = await this.prisma.client.create({
        data: { UUID, IP },
      });

      request.client = client;
    }

    return next.handle();
  }
}
