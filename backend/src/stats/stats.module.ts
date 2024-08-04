import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AudioService } from 'src/song/services/audio.service';

@Module({
  imports: [PrismaModule],
  controllers: [StatsController],
  providers: [StatsService, AudioService],
})
export class StatsModule {}
