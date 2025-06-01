import { IsEmail, IsOptional, IsString, IsStrongPassword, IsUrl } from 'class-validator';

export class SignupDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsUrl()
  @IsOptional()
  pictureUrl: string;
}
