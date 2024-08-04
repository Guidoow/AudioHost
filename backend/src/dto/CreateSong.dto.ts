import { IsStringDefinedNotEmpty } from 'src/decorators';

import { CreateSongFiles } from 'src/types';

export class CreateSongDto {
  @IsStringDefinedNotEmpty()
  title: string;

  @IsStringDefinedNotEmpty()
  author: string;

  files: CreateSongFiles;
}
