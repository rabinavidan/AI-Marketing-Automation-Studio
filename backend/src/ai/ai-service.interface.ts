import { AIContentResult, ImagePromptInput, ProductBriefInput, TrendInput } from './ai.types';

/**
 * Contract implemented by both OpenAIService and MockAIService.
 * Callers (AiService / controllers) depend only on this token/interface and
 * never know which concrete implementation is bound — see ai.module.ts.
 */
export interface AIService {
  generateMarketingContent(brief: ProductBriefInput): Promise<AIContentResult>;
  generateImagePrompt(data: ImagePromptInput): Promise<{ prompt: string }>;
  generateTrendIdeas(): Promise<TrendInput[]>;
  regenerateContent(existing: AIContentResult, brief: ProductBriefInput): Promise<AIContentResult>;
}

export const AI_SERVICE = Symbol('AI_SERVICE');
