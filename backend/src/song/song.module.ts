import { Module } from '@nestjs/common';

import { FileInterceptor } from './interceptors/song.interceptor';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ValidatorService } from './services/validator.service';
import { AudioService } from './services/audio.service';
import { SongController } from './song.controller';
import { SongService } from './song.service';

@Module({
  imports: [PrismaModule],
  controllers: [SongController],
  providers: [SongService, ValidatorService, AudioService, FileInterceptor],
})
export class SongModule {}
