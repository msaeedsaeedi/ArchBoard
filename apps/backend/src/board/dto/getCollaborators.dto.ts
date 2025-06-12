import { IsArray, IsEnum } from 'class-validator';
import { CollaboratorRole } from 'generated/prisma';

export class GetCollaboratorsDtoResponse {
  @IsArray()
  email: string;

  @IsEnum(CollaboratorRole)
  role: CollaboratorRole;
}
