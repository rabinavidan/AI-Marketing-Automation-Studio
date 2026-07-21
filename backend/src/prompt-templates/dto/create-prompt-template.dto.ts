import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { PROMPT_CATEGORY_VALUES } from '../../common/enums';

export class CreatePromptTemplateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsIn(PROMPT_CATEGORY_VALUES)
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  promptText: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}
