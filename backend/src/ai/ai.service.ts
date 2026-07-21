import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AI_SERVICE, AIService } from './ai-service.interface';
import { AIContentResult, ProductBriefInput } from './ai.types';
import { GenerateContentDto } from './dto/generate-content.dto';
import { GenerateImagePromptDto } from './dto/generate-image-prompt.dto';

@Injectable()
export class AiService {
  constructor(
    @Inject(AI_SERVICE) private readonly aiService: AIService,
    private readonly prisma: PrismaService,
  ) {}

  async generateContent(dto: GenerateContentDto) {
    let brief;

    if (dto.productBriefId) {
      brief = await this.prisma.productBrief.findUnique({ where: { id: dto.productBriefId } });
      if (!brief) {
        throw new NotFoundException(`ProductBrief with id ${dto.productBriefId} not found`);
      }
    } else {
      if (!dto.brief) {
        throw new BadRequestException('Either productBriefId or brief must be provided');
      }
      brief = await this.prisma.productBrief.create({ data: dto.brief });
    }

    const briefInput: ProductBriefInput = brief;
    const result = await this.aiService.generateMarketingContent(briefInput);

    return this.prisma.generatedContent.create({
      data: {
        productBriefId: brief.id,
        productDescription: result.productDescription,
        instagramPost: result.instagramPost,
        tiktokScript: result.tiktokScript,
        emailCampaign: result.emailCampaign,
        adCopy: result.adCopy,
        seoTitle: result.seoTitle,
        hashtags: result.hashtags,
        imagePrompt: result.imagePrompt,
        status: 'Pending Review',
      },
      include: { productBrief: true },
    });
  }

  async regenerateContent(contentId: string) {
    const existing = await this.prisma.generatedContent.findUnique({
      where: { id: contentId },
      include: { productBrief: true },
    });
    if (!existing) {
      throw new NotFoundException(`GeneratedContent with id ${contentId} not found`);
    }

    const existingResult: AIContentResult = {
      productDescription: existing.productDescription,
      instagramPost: existing.instagramPost,
      tiktokScript: existing.tiktokScript,
      emailCampaign: existing.emailCampaign,
      adCopy: existing.adCopy,
      seoTitle: existing.seoTitle,
      hashtags: existing.hashtags,
      imagePrompt: existing.imagePrompt,
    };

    const briefInput: ProductBriefInput = existing.productBrief;
    const result = await this.aiService.regenerateContent(existingResult, briefInput);

    return this.prisma.generatedContent.update({
      where: { id: contentId },
      data: {
        productDescription: result.productDescription,
        instagramPost: result.instagramPost,
        tiktokScript: result.tiktokScript,
        emailCampaign: result.emailCampaign,
        adCopy: result.adCopy,
        seoTitle: result.seoTitle,
        hashtags: result.hashtags,
        imagePrompt: result.imagePrompt,
      },
      include: { productBrief: true },
    });
  }

  generateImagePrompt(dto: GenerateImagePromptDto) {
    return this.aiService.generateImagePrompt(dto);
  }
}
