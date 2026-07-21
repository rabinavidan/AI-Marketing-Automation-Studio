import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductBriefsService } from './product-briefs.service';
import { CreateProductBriefDto } from './dto/create-product-brief.dto';
import { UpdateProductBriefDto } from './dto/update-product-brief.dto';

@Controller('product-briefs')
export class ProductBriefsController {
  constructor(private readonly productBriefsService: ProductBriefsService) {}

  @Post()
  create(@Body() dto: CreateProductBriefDto) {
    return this.productBriefsService.create(dto);
  }

  @Get()
  findAll() {
    return this.productBriefsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productBriefsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductBriefDto) {
    return this.productBriefsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productBriefsService.remove(id);
  }
}
