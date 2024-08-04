import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';

async function bootstrap() {
  const adapter = new ExpressAdapter();
  adapter.set('trust proxy', 1);

  if (
    !process.env.BACKEND_INTERNAL_PORT ||
    !process.env.DATABASE_URI ||
    !process.env.NODE_ENV
  )
    throw new Error('Enviroment variables not loaded.');

  const app = await NestFactory.create(AppModule, adapter);
  await app.listen(process.env.BACKEND_INTERNAL_PORT);
  await connection();
}

async function connection() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    await prisma.client.findFirst();
    console.log('[DATABASE_CONNECTION]: UP');
  } catch (error) {
    console.error('[DATABASE_CONNECTION]: DOWN');
  } finally {
    await prisma.$disconnect();
  }
}

bootstrap();
