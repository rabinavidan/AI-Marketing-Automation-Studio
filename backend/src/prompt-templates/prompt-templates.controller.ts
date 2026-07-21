import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PromptTemplatesService } from './prompt-templates.service';
import { CreatePromptTemplateDto } from './dto/create-prompt-template.dto';
import { UpdatePromptTemplateDto } from './dto/update-prompt-template.dto';

@Controller('prompt-templates')
export class PromptTemplatesController {
  constructor(private readonly promptTemplatesService: PromptTemplatesService) {}

  @Get()
  findAll() {
    return this.promptTemplatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promptTemplatesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePromptTemplateDto) {
    return this.promptTemplatesService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePromptTemplateDto) {
    return this.promptTemplatesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promptTemplatesService.remove(id);
  }
}
