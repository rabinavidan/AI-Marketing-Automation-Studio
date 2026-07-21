-- CreateTable
CREATE TABLE "product_briefs" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productCategory" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "mainBenefits" TEXT NOT NULL,
    "toneOfVoice" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "campaignGoal" TEXT,
    "additionalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_briefs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_content" (
    "id" TEXT NOT NULL,
    "productBriefId" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "instagramPost" TEXT NOT NULL,
    "tiktokScript" TEXT NOT NULL,
    "emailCampaign" TEXT NOT NULL,
    "adCopy" TEXT NOT NULL,
    "seoTitle" TEXT NOT NULL,
    "hashtags" TEXT[],
    "imagePrompt" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "owner" TEXT NOT NULL DEFAULT 'Unassigned',
    "contentType" TEXT NOT NULL DEFAULT 'Full Campaign',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generated_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_templates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "promptText" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'To Do',
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "dueDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflow_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trends" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "suggestedCampaign" TEXT NOT NULL,
    "suggestedPlatforms" TEXT[],
    "contentIdeas" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trends_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "generated_content" ADD CONSTRAINT "generated_content_productBriefId_fkey" FOREIGN KEY ("productBriefId") REFERENCES "product_briefs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

