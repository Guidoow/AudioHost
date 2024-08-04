import {
  IsNotEmpty,
  IsDefined,
  IsString,
  IsBoolean,
  IsDate,
  IsNumber,
} from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';

export function IsStringDefinedNotEmpty() {
  return applyDecorators(
    Type(() => String),
    IsDefined(),
    IsString(),
    IsNotEmpty(),
  );
}

export function IsNumberDefinedNotEmpty() {
  return applyDecorators(
    Type(() => Number),
    IsDefined(),
    IsNumber(),
    IsNotEmpty(),
  );
}

export function IsBooleanDefinedNotEmpty() {
  return applyDecorators(
    Type(() => Boolean),
    IsDefined(),
    IsBoolean(),
    IsNotEmpty(),
  );
}

export function IsDateDefinedNotEmpty() {
  return applyDecorators(
    Type(() => Date),
    IsDefined(),
    IsDate(),
    IsNotEmpty(),
  );
}
