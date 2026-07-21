export interface ProductBriefInput {
  productName: string;
  productCategory: string;
  targetAudience: string;
  mainBenefits?: string | null;
  toneOfVoice: string;
  language: string;
  platform: string;
  campaignGoal?: string | null;
  additionalNotes?: string | null;
}

export interface AIContentResult {
  productDescription: string;
  instagramPost: string;
  tiktokScript: string;
  emailCampaign: string;
  adCopy: string;
  seoTitle: string;
  hashtags: string[];
  imagePrompt: string;
}

export interface ImagePromptInput {
  productName: string;
  productType?: string;
  visualStyle?: string;
  background?: string;
  lighting?: string;
  mood?: string;
  brandStyle?: string;
  aspectRatio?: string;
  tool?: string;
}

export interface TrendInput {
  name: string;
  category: string;
  description: string;
  suggestedCampaign: string;
  suggestedPlatforms: string[];
  contentIdeas: string[];
}
