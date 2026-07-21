import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AI_SERVICE, AIService } from '../ai/ai-service.interface';

@Injectable()
export class TrendsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(AI_SERVICE) private readonly aiService: AIService,
  ) {}

  findAll() {
    return this.prisma.trend.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async generate() {
    const ideas = await this.aiService.generateTrendIdeas();
    await this.prisma.trend.createMany({ data: ideas });
    return this.findAll();
  }
}
