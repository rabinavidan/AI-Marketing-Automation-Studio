// Shared TypeScript types mirroring API_CONTRACT.md

export type ContentStatus =
  | 'Draft'
  | 'Pending Review'
  | 'Approved'
  | 'Rejected'
  | 'Needs Design'
  | 'Ready to Publish';

export type Platform =
  | 'Instagram'
  | 'TikTok'
  | 'Website'
  | 'Email'
  | 'Facebook Ads'
  | 'Google Ads';

export type ToneOfVoice =
  | 'Premium'
  | 'Friendly'
  | 'Professional'
  | 'Luxury'
  | 'Young'
  | 'Natural'
  | 'Scientific';

export type Language = 'English' | 'Hebrew';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export type PromptCategory =
  | 'Product Launch'
  | 'Instagram Campaign'
  | 'TikTok Script'
  | 'AI Image Generation'
  | 'Email Campaign'
  | 'SEO Product Description'
  | 'Hebrew Marketing Copy'
  | 'English Global Campaign';

export interface ProductBrief {
  id: string;
  productName: string;
  productCategory: string;
  targetAudience: string;
  mainBenefits?: string;
  toneOfVoice?: string;
  language: string;
  platform: string;
  campaignGoal?: string;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductBriefInput {
  productName: string;
  productCategory: string;
  targetAudience: string;
  mainBenefits?: string;
  toneOfVoice?: string;
  language: string;
  platform: string;
  campaignGoal?: string;
  additionalNotes?: string;
}

export interface GeneratedContent {
  id: string;
  productBriefId: string;
  productBrief?: ProductBrief;
  productDescription: string;
  instagramPost: string;
  tiktokScript: string;
  emailCampaign: string;
  adCopy: string;
  seoTitle: string;
  hashtags: string[];
  imagePrompt: string;
  status: ContentStatus;
  owner: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: PromptCategory | string;
  description: string;
  promptText: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowTask {
  id: string;
  title: string;
  productName: string;
  contentType: string;
  assignedTo: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trend {
  id: string;
  name: string;
  category: string;
  description: string;
  suggestedCampaign: string;
  suggestedPlatforms: string[];
  contentIdeas: string[];
  createdAt: string;
}

export interface DashboardSummary {
  totalGeneratedContent: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  campaignsReady: number;
  tasksInProgress: number;
  table: DashboardTableRow[];
}

export interface DashboardTableRow {
  id: string;
  productName: string;
  contentType: string;
  language: string;
  status: ContentStatus;
  owner: string;
  createdAt: string;
}

export interface ImagePromptInput {
  productName: string;
  productType: string;
  visualStyle: string;
  background: string;
  lighting: string;
  mood: string;
  brandStyle: string;
  aspectRatio: string;
  tool: string;
}

export interface ApiErrorShape {
  statusCode: number;
  message: string | string[];
  error: string;
}
