export const CONTENT_STATUS_VALUES = [
  'Draft',
  'Pending Review',
  'Approved',
  'Rejected',
  'Needs Design',
  'Ready to Publish',
] as const;
export type ContentStatus = (typeof CONTENT_STATUS_VALUES)[number];

export const PLATFORM_VALUES = [
  'Instagram',
  'TikTok',
  'Website',
  'Email',
  'Facebook Ads',
  'Google Ads',
] as const;
export type Platform = (typeof PLATFORM_VALUES)[number];

export const TONE_OF_VOICE_VALUES = [
  'Premium',
  'Friendly',
  'Professional',
  'Luxury',
  'Young',
  'Natural',
  'Scientific',
] as const;
export type ToneOfVoice = (typeof TONE_OF_VOICE_VALUES)[number];

export const LANGUAGE_VALUES = ['English', 'Hebrew'] as const;
export type Language = (typeof LANGUAGE_VALUES)[number];

export const TASK_PRIORITY_VALUES = ['Low', 'Medium', 'High'] as const;
export type TaskPriority = (typeof TASK_PRIORITY_VALUES)[number];

export const TASK_STATUS_VALUES = ['To Do', 'In Progress', 'Done'] as const;
export type TaskStatus = (typeof TASK_STATUS_VALUES)[number];

export const PROMPT_CATEGORY_VALUES = [
  'Product Launch',
  'Instagram Campaign',
  'TikTok Script',
  'AI Image Generation',
  'Email Campaign',
  'SEO Product Description',
  'Hebrew Marketing Copy',
  'English Global Campaign',
] as const;
export type PromptCategory = (typeof PROMPT_CATEGORY_VALUES)[number];
