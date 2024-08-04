import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UploadedFiles,
  Query,
} from '@nestjs/common';

import { SongService } from 'src/song/song.service';
import { AmountQueryDto, CreateSongDto } from 'src/dto';
import { FileInterceptor } from './interceptors/song.interceptor';
import { CreateSongFiles, CustomRequest, HttpResponse } from 'src/types';

@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  getFilters = ['recent', 'older', 'relevant', 'random'];

  @Post()
  @UseInterceptors(FileInterceptor)
  create(
    @Req() request: CustomRequest,
    @Body() createSongDto: CreateSongDto,
    @UploadedFiles() files: CreateSongFiles,
  ) {
    createSongDto.files = files;
    return this.songService.create(request, createSongDto);
  }

  @Get()
  async findAll(@Req() request: CustomRequest) {
    return new HttpResponse('OK', await this.songService.findAll(request));
  }

  @Get('amount/:amount')
  async findAmount(
    @Param('amount') amount: number,
    @Query() query: AmountQueryDto,
  ) {
    return new HttpResponse(
      'OK',
      await this.songService.findAmount(+amount, query),
    );
  }

  @Get('search/:search')
  async findSearch(@Param('search') search: string) {
    return new HttpResponse('OK', await this.songService.findSearch(search));
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    return new HttpResponse('OK', await this.songService.findOne(uuid));
  }

  @Delete()
  remove(@Req() request: CustomRequest) {
    return this.songService.remove(request);
  }
}
