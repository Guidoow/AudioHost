import { Controller, Get, Param, Req } from '@nestjs/common';
import { StatsService } from './stats.service';
import { CustomRequest, HttpResponse } from 'src/types';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async stats(@Req() request: CustomRequest) {
    return new HttpResponse('OK', request.client);
  }

  @Get('like/:uuid')
  async like(@Req() request: CustomRequest, @Param('uuid') uuid: string) {
    return await this.statsService.like(request, uuid);
  }

  @Get('view/:uuid')
  async view(@Req() request: CustomRequest, @Param('uuid') uuid: string) {
    return await this.statsService.view(request, uuid);
  }
}
