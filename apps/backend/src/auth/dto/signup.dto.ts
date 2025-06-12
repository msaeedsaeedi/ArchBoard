import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
} from 'class-validator';
import { PasswordValidationRules } from '@archboard/shared';

export class SignupDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword(PasswordValidationRules)
  password: string;

  @IsUrl()
  @IsOptional()
  pictureUrl: string;
}
