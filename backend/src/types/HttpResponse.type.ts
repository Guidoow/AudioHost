import { HttpStatus } from '@nestjs/common';

export class HttpResponse {
  statusCode: HttpStatus;
  message: string;
  data?: string | object;

  constructor(message: string, data?: string | object) {
    this.statusCode = HttpStatus.ACCEPTED;
    this.message = message;
    this.data = data;
  }
}
