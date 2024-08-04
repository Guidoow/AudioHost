import { IsOptional, IsIn } from 'class-validator';

export class AmountQueryDto {
  @IsOptional()
  @IsIn(['relevant', 'recent', 'older', 'random'])
  filter?: 'relevant' | 'recent' | 'older' | 'random';
}
