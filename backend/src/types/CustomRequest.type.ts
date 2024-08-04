import { Request } from 'express';
import { ExtendedClient } from '.';

export interface CustomRequest extends Request {
  client: ExtendedClient;
}
