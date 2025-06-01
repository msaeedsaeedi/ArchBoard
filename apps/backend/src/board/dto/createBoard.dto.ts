import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  title: string;

  @IsString()
  description?: string;
}

export class CreateBoardResponseDto {
  @Expose()
  slug: string;
}
