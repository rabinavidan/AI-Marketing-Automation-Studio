import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromptTemplateDto } from './dto/create-prompt-template.dto';
import { UpdatePromptTemplateDto } from './dto/update-prompt-template.dto';

@Injectable()
export class PromptTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreatePromptTemplateDto) {
    return this.prisma.promptTemplate.create({ data: dto });
  }

  findAll() {
    return this.prisma.promptTemplate.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const template = await this.prisma.promptTemplate.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException(`PromptTemplate with id ${id} not found`);
    }
    return template;
  }

  async update(id: string, dto: UpdatePromptTemplateDto) {
    await this.findOne(id);
    return this.prisma.promptTemplate.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.promptTemplate.delete({ where: { id } });
  }
}
