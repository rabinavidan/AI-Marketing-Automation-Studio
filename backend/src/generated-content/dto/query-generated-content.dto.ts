import { IsOptional, IsString } from 'class-validator';

export class QueryGeneratedContentDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
