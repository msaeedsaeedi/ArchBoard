import { IsString } from 'class-validator';

export class GetCollaboratorsDto {
  @IsString()
  email: string;
}
