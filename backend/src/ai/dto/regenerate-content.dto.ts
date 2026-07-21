import { IsNotEmpty, IsString } from 'class-validator';

export class RegenerateContentDto {
  @IsString()
  @IsNotEmpty()
  contentId: string;
}
