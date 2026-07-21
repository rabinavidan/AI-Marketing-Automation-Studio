import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { CONTENT_STATUS_VALUES } from '../../common/enums';

export class UpdateGeneratedContentDto {
  @IsOptional()
  @IsString()
  productDescription?: string;

  @IsOptional()
  @IsString()
  instagramPost?: string;

  @IsOptional()
  @IsString()
  tiktokScript?: string;

  @IsOptional()
  @IsString()
  emailCampaign?: string;

  @IsOptional()
  @IsString()
  adCopy?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];

  @IsOptional()
  @IsString()
  imagePrompt?: string;

  @IsOptional()
  @IsIn(CONTENT_STATUS_VALUES)
  status?: string;

  @IsOptional()
  @IsString()
  owner?: string;

  @IsOptional()
  @IsString()
  contentType?: string;
}
