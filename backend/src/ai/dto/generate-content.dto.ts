import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateProductBriefDto } from '../../product-briefs/dto/create-product-brief.dto';

export class GenerateContentDto {
  @IsOptional()
  @IsString()
  productBriefId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProductBriefDto)
  brief?: CreateProductBriefDto;
}
