import { IsEmail } from 'class-validator';

export class AddCollaboratorDto {
  @IsEmail()
  email: string;
}
