import { IsOptional, IsString } from 'class-validator';

export class UpdateBoardDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
