import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class EmailLoginDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
