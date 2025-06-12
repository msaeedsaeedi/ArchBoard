import { IsArray } from 'class-validator';

export class GetCollaboratorsDtoResponse {
  @IsArray()
  email: string;
}
