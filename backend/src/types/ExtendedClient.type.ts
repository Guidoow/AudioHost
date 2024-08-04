import { Client, Song } from '@prisma/client';

export interface ExtendedClient extends Client {
  Song?: Song | null;
}
