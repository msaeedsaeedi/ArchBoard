import { IsEmail } from 'class-validator';

export class DeleteCollaboratorDto {
  @IsEmail()
  email: string;
}
