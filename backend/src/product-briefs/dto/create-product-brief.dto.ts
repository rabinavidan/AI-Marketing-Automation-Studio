import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LANGUAGE_VALUES, PLATFORM_VALUES } from '../../common/enums';

export class CreateProductBriefDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  productCategory: string;

  @IsString()
  @IsNotEmpty()
  targetAudience: string;

  @IsString()
  @IsNotEmpty()
  mainBenefits: string;

  @IsString()
  @IsNotEmpty()
  toneOfVoice: string;

  @IsIn(LANGUAGE_VALUES)
  language: string;

  @IsIn(PLATFORM_VALUES)
  platform: string;

  @IsOptional()
  @IsString()
  campaignGoal?: string;

  @IsOptional()
  @IsString()
  additionalNotes?: string;
}
