import { PartialType } from '@nestjs/mapped-types';
import { CreateProductBriefDto } from './create-product-brief.dto';

export class UpdateProductBriefDto extends PartialType(CreateProductBriefDto) {}
