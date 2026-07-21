import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductBriefDto } from './dto/create-product-brief.dto';
import { UpdateProductBriefDto } from './dto/update-product-brief.dto';

@Injectable()
export class ProductBriefsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProductBriefDto) {
    return this.prisma.productBrief.create({ data: dto });
  }

  findAll() {
    return this.prisma.productBrief.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const brief = await this.prisma.productBrief.findUnique({ where: { id } });
    if (!brief) {
      throw new NotFoundException(`ProductBrief with id ${id} not found`);
    }
    return brief;
  }

  async update(id: string, dto: UpdateProductBriefDto) {
    await this.findOne(id);
    return this.prisma.productBrief.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.productBrief.delete({ where: { id } });
  }
}
