# API Contract — AI Marketing Automation Studio

Backend: NestJS, runs on port **4000**, all routes prefixed `/api`.
Frontend: Next.js, runs on port **3000**, calls backend via `process.env.API_BASE_URL` (server) / `NEXT_PUBLIC_API_BASE_URL` (client), default `http://localhost:4000/api`.

CORS: backend must allow origin `http://localhost:3000` (and be configurable).

## Enums

```ts
type ContentStatus = 'Draft' | 'Pending Review' | 'Approved' | 'Rejected' | 'Needs Design' | 'Ready to Publish';
type Platform = 'Instagram' | 'TikTok' | 'Website' | 'Email' | 'Facebook Ads' | 'Google Ads';
type ToneOfVoice = 'Premium' | 'Friendly' | 'Professional' | 'Luxury' | 'Young' | 'Natural' | 'Scientific';
type Language = 'English' | 'Hebrew';
type TaskPriority = 'Low' | 'Medium' | 'High';
type TaskStatus = 'To Do' | 'In Progress' | 'Done';
type PromptCategory = 'Product Launch' | 'Instagram Campaign' | 'TikTok Script' | 'AI Image Generation' | 'Email Campaign' | 'SEO Product Description' | 'Hebrew Marketing Copy' | 'English Global Campaign';
```

## Entities (Prisma models, camelCase fields, cuid ids)

### ProductBrief
id, productName (string), productCategory (string), targetAudience (string), mainBenefits (string), toneOfVoice (string), language (string), platform (string), campaignGoal (string, optional), additionalNotes (string, optional), createdAt, updatedAt

### GeneratedContent
id, productBriefId (FK -> ProductBrief), productDescription (string), instagramPost (string), tiktokScript (string), emailCampaign (string), adCopy (string), seoTitle (string), hashtags (string[] — Postgres text array), imagePrompt (string), status (ContentStatus, default 'Draft'), owner (string, default 'Unassigned'), contentType (string, default 'Full Campaign'), createdAt, updatedAt
- relation: include `productBrief` when fetching detail.

### PromptTemplate
id, title, category (PromptCategory), description, promptText, tags (string[]), createdAt, updatedAt

### WorkflowTask
id, title, productName, contentType, assignedTo, status (TaskStatus, default 'To Do'), priority (TaskPriority, default 'Medium'), dueDate (DateTime, optional), notes (string, optional), createdAt, updatedAt

### Trend
id, name, category, description, suggestedCampaign, suggestedPlatforms (string[]), contentIdeas (string[]), createdAt

## Endpoints

### Product Briefs
- `POST /api/product-briefs` — body: ProductBrief fields (no id) → creates brief
- `GET /api/product-briefs` → list
- `GET /api/product-briefs/:id` → one
- `PUT /api/product-briefs/:id` → update
- `DELETE /api/product-briefs/:id` → delete

### AI
- `POST /api/ai/generate-content` — body: `{ productBriefId?: string, brief: ProductBriefInput }` (if productBriefId omitted, backend creates the ProductBrief first from `brief`, then generates). Returns the created `GeneratedContent` record (status `Pending Review`).
- `POST /api/ai/regenerate-content` — body: `{ contentId: string }` → regenerates all text fields for that content row, returns updated `GeneratedContent`.
- `POST /api/ai/generate-image-prompt` — body: `{ productName, productType, visualStyle, background, lighting, mood, brandStyle, aspectRatio, tool }` → returns `{ prompt: string }`.

### Generated Content
- `GET /api/generated-content` — supports `?status=&search=` query filters
- `GET /api/generated-content/:id` — includes productBrief
- `PUT /api/generated-content/:id/status` — body `{ status: ContentStatus }`
- `PUT /api/generated-content/:id` — general field update
- `DELETE /api/generated-content/:id`

### Prompt Templates
- `GET /api/prompt-templates`
- `GET /api/prompt-templates/:id`
- `POST /api/prompt-templates`
- `PUT /api/prompt-templates/:id`
- `DELETE /api/prompt-templates/:id`

### Workflow Tasks
- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PUT /api/tasks/:id/status` — body `{ status: TaskStatus }`
- `DELETE /api/tasks/:id`

### Trends
- `GET /api/trends`
- `POST /api/trends/generate` — generates a few new mock trend entries and persists them, returns full list

### Dashboard
- `GET /api/dashboard/summary` → 
```json
{
  "totalGeneratedContent": 0,
  "pendingReview": 0,
  "approved": 0,
  "rejected": 0,
  "campaignsReady": 0,
  "tasksInProgress": 0,
  "table": [
    {
      "id": "...",
      "productName": "...",
      "contentType": "...",
      "language": "...",
      "status": "...",
      "owner": "...",
      "createdAt": "..."
    }
  ]
}
```
"campaignsReady" = count of GeneratedContent with status 'Ready to Publish'. "tasksInProgress" = count of WorkflowTask with status 'In Progress'.

## AI structured JSON shape (both real OpenAI + mock service must return this)

```json
{
  "productDescription": "",
  "instagramPost": "",
  "tiktokScript": "",
  "emailCampaign": "",
  "adCopy": "",
  "seoTitle": "",
  "hashtags": [],
  "imagePrompt": ""
}
```

`AIService` interface (backend/src/ai/ai-service.interface.ts):
```ts
interface AIService {
  generateMarketingContent(brief: ProductBriefInput): Promise<AIContentResult>;
  generateImagePrompt(data: ImagePromptInput): Promise<{ prompt: string }>;
  generateTrendIdeas(): Promise<TrendInput[]>;
  regenerateContent(existing: AIContentResult, brief: ProductBriefInput): Promise<AIContentResult>;
}
```
`OpenAIService` used when `process.env.OPENAI_API_KEY` is set, else `MockAIService` (realistic templated output referencing the product name/category/tone/platform/language, including Hebrew text when language is Hebrew). Bind via a provider factory in `AiModule`.

## Error format
Standard Nest `HttpException` JSON: `{ "statusCode": 404, "message": "...", "error": "Not Found" }`.

## Seed data
Backend must ship `prisma/seed.ts` populating: ~6 prompt templates (per PRD examples), ~6 trends (per PRD examples), 3-4 product briefs with generated content in varying statuses (Draft/Pending Review/Approved/Rejected/Ready to Publish), 3-4 workflow tasks in varying statuses/priorities. Run via `npx prisma db seed`.
