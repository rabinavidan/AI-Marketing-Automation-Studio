import { MockAIService } from './mock-ai.service';
import { ProductBriefInput } from './ai.types';

describe('MockAIService', () => {
  let service: MockAIService;

  beforeEach(() => {
    service = new MockAIService();
  });

  const englishBrief: ProductBriefInput = {
    productName: 'Lumina Vitamin C Serum',
    productCategory: 'Brightening Serum',
    targetAudience: 'Women 25-45 concerned about dull skin',
    mainBenefits: 'brightens skin tone and fades dark spots',
    toneOfVoice: 'Scientific',
    language: 'English',
    platform: 'Instagram',
  };

  const hebrewBrief: ProductBriefInput = {
    ...englishBrief,
    productName: 'Adama Purifying Clay Mask',
    toneOfVoice: 'Natural',
    language: 'Hebrew',
    platform: 'TikTok',
  };

  describe('generateMarketingContent', () => {
    it('returns every field required by the AIContentResult shape, non-empty', async () => {
      const result = await service.generateMarketingContent(englishBrief);

      expect(typeof result.productDescription).toBe('string');
      expect(result.productDescription.length).toBeGreaterThan(0);
      expect(typeof result.instagramPost).toBe('string');
      expect(result.instagramPost.length).toBeGreaterThan(0);
      expect(typeof result.tiktokScript).toBe('string');
      expect(result.tiktokScript.length).toBeGreaterThan(0);
      expect(typeof result.emailCampaign).toBe('string');
      expect(result.emailCampaign.length).toBeGreaterThan(0);
      expect(typeof result.adCopy).toBe('string');
      expect(result.adCopy.length).toBeGreaterThan(0);
      expect(typeof result.seoTitle).toBe('string');
      expect(result.seoTitle.length).toBeGreaterThan(0);
      expect(Array.isArray(result.hashtags)).toBe(true);
      expect(result.hashtags.length).toBeGreaterThan(0);
      expect(typeof result.imagePrompt).toBe('string');
      expect(result.imagePrompt.length).toBeGreaterThan(0);
    });

    it('references the actual product name in the generated copy (not generic placeholder text)', async () => {
      const result = await service.generateMarketingContent(englishBrief);

      expect(result.productDescription).toContain(englishBrief.productName);
      expect(result.instagramPost).toContain(englishBrief.productName);
      expect(result.productDescription.toLowerCase()).not.toContain('lorem ipsum');
    });

    it('produces real Hebrew text when language is Hebrew', async () => {
      const result = await service.generateMarketingContent(hebrewBrief);
      const hebrewCharPattern = new RegExp('[\\u0590-\\u05FF]');

      expect(hebrewCharPattern.test(result.productDescription)).toBe(true);
      expect(hebrewCharPattern.test(result.instagramPost)).toBe(true);
      expect(hebrewCharPattern.test(result.emailCampaign)).toBe(true);
    });

    it('varies phrasing by tone of voice', async () => {
      const luxuryResult = await service.generateMarketingContent({
        ...englishBrief,
        toneOfVoice: 'Luxury',
      });
      const friendlyResult = await service.generateMarketingContent({
        ...englishBrief,
        toneOfVoice: 'Friendly',
      });

      // Different tone profiles should not produce identical descriptions.
      expect(luxuryResult.productDescription).not.toEqual(friendlyResult.productDescription);
    });
  });

  describe('generateImagePrompt', () => {
    it('assembles a professional prompt referencing the supplied fields', async () => {
      const { prompt } = await service.generateImagePrompt({
        productName: 'Lumina Vitamin C Serum',
        productType: 'skincare product',
        visualStyle: 'realistic commercial photography',
        background: 'clean beige',
        lighting: 'soft studio lighting',
        mood: 'elegant',
        brandStyle: 'luxury cosmetics branding',
        aspectRatio: '1:1',
        tool: 'Midjourney',
      });

      expect(prompt).toContain('Lumina Vitamin C Serum');
      expect(prompt).toContain('clean beige');
      expect(prompt).toContain('soft studio lighting');
      expect(prompt.length).toBeGreaterThan(40);
    });
  });

  describe('generateTrendIdeas', () => {
    it('returns 5-6 well-formed, on-topic trend objects', async () => {
      const trends = await service.generateTrendIdeas();

      expect(trends.length).toBeGreaterThanOrEqual(5);
      expect(trends.length).toBeLessThanOrEqual(6);

      for (const trend of trends) {
        expect(typeof trend.name).toBe('string');
        expect(trend.name.length).toBeGreaterThan(0);
        expect(typeof trend.category).toBe('string');
        expect(typeof trend.description).toBe('string');
        expect(typeof trend.suggestedCampaign).toBe('string');
        expect(Array.isArray(trend.suggestedPlatforms)).toBe(true);
        expect(trend.suggestedPlatforms.length).toBeGreaterThan(0);
        expect(Array.isArray(trend.contentIdeas)).toBe(true);
        expect(trend.contentIdeas.length).toBeGreaterThan(0);
      }
    });

    it('varies results across calls (regenerate feels alive)', async () => {
      // With randomized selection/shuffling from a pool of 9 trend templates,
      // at least one of several repeated calls should differ from the first.
      const first = await service.generateTrendIdeas();
      const firstSignature = first
        .map((t) => t.name)
        .sort()
        .join(',');

      let sawDifference = false;
      for (let i = 0; i < 10; i++) {
        const next = await service.generateTrendIdeas();
        const signature = next
          .map((t) => t.name)
          .sort()
          .join(',');
        if (signature !== firstSignature) {
          sawDifference = true;
          break;
        }
      }

      expect(sawDifference).toBe(true);
    });
  });
});
