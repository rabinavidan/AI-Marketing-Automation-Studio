import { Body, Controller, Delete, Get, Param, Put, Query } from '@nestjs/common';
import { GeneratedContentService } from './generated-content.service';
import { QueryGeneratedContentDto } from './dto/query-generated-content.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateGeneratedContentDto } from './dto/update-generated-content.dto';

@Controller('generated-content')
export class GeneratedContentController {
  constructor(private readonly generatedContentService: GeneratedContentService) {}

  @Get()
  findAll(@Query() query: QueryGeneratedContentDto) {
    return this.generatedContentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generatedContentService.findOne(id);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.generatedContentService.updateStatus(id, dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGeneratedContentDto) {
    return this.generatedContentService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generatedContentService.remove(id);
  }
}
