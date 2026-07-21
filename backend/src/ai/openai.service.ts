import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { AIService } from './ai-service.interface';
import { AIContentResult, ImagePromptInput, ProductBriefInput, TrendInput } from './ai.types';
import { MockAIService } from './mock-ai.service';

/**
 * OpenAIService — used when process.env.OPENAI_API_KEY is set. Builds a
 * single prompt from the product brief and asks the model for structured
 * JSON matching AIContentResult. Falls back to the mock service's output if
 * the model response can't be parsed, so the endpoint never hard-fails a demo.
 */
@Injectable()
export class OpenAIService implements AIService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly fallback = new MockAIService();

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  }

  async generateMarketingContent(brief: ProductBriefInput): Promise<AIContentResult> {
    const prompt = this.buildContentPrompt(brief);
    return this.requestJson(prompt, () => this.fallback.generateMarketingContent(brief));
  }

  async regenerateContent(
    existing: AIContentResult,
    brief: ProductBriefInput,
  ): Promise<AIContentResult> {
    const prompt =
      `${this.buildContentPrompt(brief)}\n\n` +
      `Here is the previous version of the content as JSON, produce a fresh alternative ` +
      `(do not just repeat it verbatim):\n${JSON.stringify(existing)}`;
    return this.requestJson(prompt, () => this.fallback.regenerateContent(existing, brief));
  }

  async generateImagePrompt(data: ImagePromptInput): Promise<{ prompt: string }> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You write short, professional image-generation prompts for cosmetics product photography. Respond with plain text only, no JSON, no quotes.',
          },
          {
            role: 'user',
            content: `Write one image-generation prompt using these details: ${JSON.stringify(data)}`,
          },
        ],
        temperature: 0.8,
      });
      const text = completion.choices[0]?.message?.content?.trim();
      if (!text) throw new Error('Empty completion');
      return { prompt: text };
    } catch (err) {
      this.logger.warn(`OpenAI generateImagePrompt failed, falling back to mock: ${err}`);
      return this.fallback.generateImagePrompt(data);
    }
  }

  async generateTrendIdeas(): Promise<TrendInput[]> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a cosmetics/beauty marketing trend analyst. Respond with ONLY a JSON array ' +
              'of 5-6 objects, each with keys: name, category, description, suggestedCampaign, ' +
              'suggestedPlatforms (string array), contentIdeas (string array of 3-4 items). No prose, no markdown fences.',
          },
          {
            role: 'user',
            content:
              'Generate current cosmetics/beauty marketing trends for a product studio dashboard.',
          },
        ],
        temperature: 0.9,
        response_format: { type: 'json_object' },
      });
      const raw = completion.choices[0]?.message?.content;
      const parsed = this.safeParseTrends(raw);
      if (parsed) return parsed;
      throw new Error('Could not parse trend JSON');
    } catch (err) {
      this.logger.warn(`OpenAI generateTrendIdeas failed, falling back to mock: ${err}`);
      return this.fallback.generateTrendIdeas();
    }
  }

  // ---------------------------------------------------------------------

  private buildContentPrompt(brief: ProductBriefInput): string {
    return (
      `You are a senior cosmetics marketing copywriter. Write marketing content for the following product brief:\n` +
      `Product name: ${brief.productName}\n` +
      `Category: ${brief.productCategory}\n` +
      `Target audience: ${brief.targetAudience}\n` +
      `Main benefits: ${brief.mainBenefits}\n` +
      `Tone of voice: ${brief.toneOfVoice}\n` +
      `Language: ${brief.language}\n` +
      `Primary platform: ${brief.platform}\n` +
      (brief.campaignGoal ? `Campaign goal: ${brief.campaignGoal}\n` : '') +
      (brief.additionalNotes ? `Additional notes: ${brief.additionalNotes}\n` : '') +
      `\nRespond with ONLY a JSON object with exactly these keys: productDescription, instagramPost, ` +
      `tiktokScript, emailCampaign, adCopy, seoTitle, hashtags (array of strings, no # prefix), imagePrompt. ` +
      `Write all text fields in ${brief.language}. No markdown fences, no extra commentary.`
    );
  }

  private async requestJson(
    prompt: string,
    onFailure: () => Promise<AIContentResult>,
  ): Promise<AIContentResult> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: 'You always respond with valid JSON only.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        response_format: { type: 'json_object' },
      });
      const raw = completion.choices[0]?.message?.content;
      const parsed = this.safeParseContent(raw);
      if (parsed) return parsed;
      throw new Error('Could not parse content JSON');
    } catch (err) {
      this.logger.warn(`OpenAI content generation failed, falling back to mock: ${err}`);
      return onFailure();
    }
  }

  private safeParseContent(raw: string | null | undefined): AIContentResult | null {
    if (!raw) return null;
    try {
      const cleaned = raw.replace(/^```json\s*|```$/g, '').trim();
      const json = JSON.parse(cleaned);
      if (
        typeof json.productDescription === 'string' &&
        typeof json.instagramPost === 'string' &&
        typeof json.tiktokScript === 'string' &&
        typeof json.emailCampaign === 'string' &&
        typeof json.adCopy === 'string' &&
        typeof json.seoTitle === 'string' &&
        Array.isArray(json.hashtags) &&
        typeof json.imagePrompt === 'string'
      ) {
        return json as AIContentResult;
      }
      return null;
    } catch {
      return null;
    }
  }

  private safeParseTrends(raw: string | null | undefined): TrendInput[] | null {
    if (!raw) return null;
    try {
      const cleaned = raw.replace(/^```json\s*|```$/g, '').trim();
      const json = JSON.parse(cleaned);
      const arr = Array.isArray(json) ? json : json.trends;
      if (!Array.isArray(arr)) return null;
      return arr.filter(
        (t) =>
          typeof t.name === 'string' &&
          typeof t.category === 'string' &&
          typeof t.description === 'string' &&
          typeof t.suggestedCampaign === 'string' &&
          Array.isArray(t.suggestedPlatforms) &&
          Array.isArray(t.contentIdeas),
      );
    } catch {
      return null;
    }
  }
}
