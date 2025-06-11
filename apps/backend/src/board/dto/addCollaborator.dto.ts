import { IsEmail, IsEnum } from 'class-validator';
import { CollaboratorRole } from 'generated/prisma';

export class AddCollaboratorDto {
  @IsEmail()
  email: string;

  @IsEnum(CollaboratorRole)
  role: CollaboratorRole;
}
