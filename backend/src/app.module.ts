import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { join } from 'path';

import { ClientInterceptor as Interceptor } from './interceptors/client.interceptor';
import { PrismaModule } from './prisma/prisma.module';
import { SongModule } from './song/song.module';
import { StatsModule } from './stats/stats.module';
import { configDotenv } from 'dotenv';

configDotenv({ path: '../.env' });

const ClientInterceptor = {
  provide: APP_INTERCEPTOR,
  useClass: Interceptor,
};

@Module({
  imports: [
    SongModule,
    StatsModule,
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'stored'),
    }),
  ],
  providers: [ClientInterceptor],
})
export class AppModule {}
