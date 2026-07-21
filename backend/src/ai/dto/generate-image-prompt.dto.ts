import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateImagePromptDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  productType: string;

  @IsString()
  @IsNotEmpty()
  visualStyle: string;

  @IsString()
  @IsNotEmpty()
  background: string;

  @IsString()
  @IsNotEmpty()
  lighting: string;

  @IsString()
  @IsNotEmpty()
  mood: string;

  @IsString()
  @IsNotEmpty()
  brandStyle: string;

  @IsString()
  @IsNotEmpty()
  aspectRatio: string;

  @IsString()
  @IsNotEmpty()
  tool: string;
}
