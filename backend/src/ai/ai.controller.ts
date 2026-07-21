import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateContentDto } from './dto/generate-content.dto';
import { RegenerateContentDto } from './dto/regenerate-content.dto';
import { GenerateImagePromptDto } from './dto/generate-image-prompt.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-content')
  generateContent(@Body() dto: GenerateContentDto) {
    return this.aiService.generateContent(dto);
  }

  @Post('regenerate-content')
  regenerateContent(@Body() dto: RegenerateContentDto) {
    return this.aiService.regenerateContent(dto.contentId);
  }

  @Post('generate-image-prompt')
  generateImagePrompt(@Body() dto: GenerateImagePromptDto) {
    return this.aiService.generateImagePrompt(dto);
  }
}
