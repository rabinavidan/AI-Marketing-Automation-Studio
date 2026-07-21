import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryGeneratedContentDto } from './dto/query-generated-content.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateGeneratedContentDto } from './dto/update-generated-content.dto';

@Injectable()
export class GeneratedContentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryGeneratedContentDto) {
    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.productBrief = {
        productName: { contains: query.search, mode: 'insensitive' },
      };
    }

    return this.prisma.generatedContent.findMany({
      where,
      include: { productBrief: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const content = await this.prisma.generatedContent.findUnique({
      where: { id },
      include: { productBrief: true },
    });
    if (!content) {
      throw new NotFoundException(`GeneratedContent with id ${id} not found`);
    }
    return content;
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    await this.findOne(id);
    return this.prisma.generatedContent.update({
      where: { id },
      data: { status: dto.status },
      include: { productBrief: true },
    });
  }

  async update(id: string, dto: UpdateGeneratedContentDto) {
    await this.findOne(id);
    return this.prisma.generatedContent.update({
      where: { id },
      data: dto,
      include: { productBrief: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.generatedContent.delete({ where: { id } });
  }
}
