import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class EmailLoginDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
