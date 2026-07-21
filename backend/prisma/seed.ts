import { PrismaClient } from '@prisma/client';
import { MockAIService } from '../src/ai/mock-ai.service';
import { ProductBriefInput } from '../src/ai/ai.types';

const prisma = new PrismaClient();
const mockAi = new MockAIService();

async function main() {
  console.log('Seeding database...');

  await prisma.generatedContent.deleteMany();
  await prisma.productBrief.deleteMany();
  await prisma.promptTemplate.deleteMany();
  await prisma.workflowTask.deleteMany();
  await prisma.trend.deleteMany();

  // ---------------------------------------------------------------------
  // Prompt templates
  // ---------------------------------------------------------------------
  await prisma.promptTemplate.createMany({
    data: [
      {
        title: 'Instagram Product Launch Prompt',
        category: 'Instagram Campaign',
        description:
          'Generates a launch-day Instagram caption with hook, benefits, and CTA for a new cosmetics product.',
        promptText:
          'Write an Instagram launch post for {{productName}}, a {{productCategory}} aimed at {{targetAudience}}. ' +
          'Open with a scroll-stopping hook, highlight {{mainBenefits}} in a {{toneOfVoice}} tone, and end with a clear ' +
          'call to action driving traffic to the bio link. Keep it under 150 words and include 3-5 relevant emoji.',
        tags: ['instagram', 'launch', 'social'],
      },
      {
        title: 'Cosmetics Ad Copy Prompt',
        category: 'English Global Campaign',
        description: 'Produces short, punchy paid-ad copy variants for Facebook Ads / Google Ads.',
        promptText:
          'Write 3 short ad copy variants (under 30 words each) for {{productName}}, a {{productCategory}}. ' +
          'Target audience: {{targetAudience}}. Emphasize {{mainBenefits}} in a {{toneOfVoice}} voice. ' +
          'Each variant must end with a strong call to action suitable for {{platform}}.',
        tags: ['ads', 'copywriting', 'conversion'],
      },
      {
        title: 'Influencer Campaign Prompt',
        category: 'Instagram Campaign',
        description:
          'Creates an influencer briefing document with key talking points and content ideas.',
        promptText:
          'Draft an influencer campaign brief for {{productName}}. Include: 3 key talking points about ' +
          '{{mainBenefits}}, suggested content formats (reel, story, carousel), a {{toneOfVoice}} tone guideline, ' +
          'and 2 sample captions targeted at {{targetAudience}}.',
        tags: ['influencer', 'ugc', 'social', 'briefing'],
      },
      {
        title: 'Premium Skincare Image Prompt',
        category: 'AI Image Generation',
        description:
          'Produces a professional AI image-generation prompt for premium product photography.',
        promptText:
          'Create a premium product photography prompt for {{productName}} ({{productCategory}}). Specify a clean, ' +
          'minimalist background, soft studio lighting, {{brandStyle}} branding cues, {{aspectRatio}} aspect ratio, ' +
          'and realistic commercial photography style suitable for {{tool}}.',
        tags: ['image', 'ai-art', 'product-photography'],
      },
      {
        title: 'Hebrew Product Description Prompt',
        category: 'Hebrew Marketing Copy',
        description:
          'Generates a Hebrew-language product description with local marketing phrasing.',
        promptText:
          'כתוב תיאור מוצר בעברית עבור {{productName}}, {{productCategory}} המיועד ל-{{targetAudience}}. ' +
          'הדגש את {{mainBenefits}} בטון {{toneOfVoice}}, ושלב קריאה לפעולה בסוף התיאור.',
        tags: ['hebrew', 'localization', 'product-description'],
      },
      {
        title: 'TikTok Short Video Script Prompt',
        category: 'TikTok Script',
        description: 'Generates a scene-by-scene TikTok script with hook, demo, and CTA beats.',
        promptText:
          'Write a 30-second TikTok script for {{productName}}. Structure: HOOK (0-3s) that creates curiosity, ' +
          'SCENE 1-2 demonstrating {{mainBenefits}}, and a CTA (final 5s) in a {{toneOfVoice}} tone aimed at ' +
          '{{targetAudience}}. Include on-screen text suggestions.',
        tags: ['tiktok', 'video', 'script'],
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Trends
  // ---------------------------------------------------------------------
  await prisma.trend.createMany({
    data: [
      {
        name: 'Clean Beauty',
        category: 'Product Formulation',
        description:
          'Consumers increasingly favor transparent ingredient lists and non-toxic formulations over trend-chasing actives.',
        suggestedCampaign: '"What’s NOT Inside" ingredient transparency series',
        suggestedPlatforms: ['Instagram', 'Website'],
        contentIdeas: [
          'Ingredient breakdown carousel post',
          '"Read the label with us" video series',
          'Clean beauty certification badge graphics',
        ],
      },
      {
        name: 'AI Product Personalization',
        category: 'Technology',
        description:
          'Shoppers expect quizzes and AI tools that recommend the exact product for their skin type and concerns.',
        suggestedCampaign: '"Find Your Match" AI skin-quiz launch campaign',
        suggestedPlatforms: ['Website', 'Instagram'],
        contentIdeas: [
          'Behind-the-scenes of the AI quiz build',
          'Customer results from personalized routines',
          '"Ask our AI" interactive Stories sticker',
        ],
      },
      {
        name: 'Natural Ingredients',
        category: 'Product Formulation',
        description:
          'Botanical extracts and plant-derived actives continue to outperform synthetic alternatives in consumer sentiment.',
        suggestedCampaign: '"Straight From Nature" ingredient spotlight series',
        suggestedPlatforms: ['Instagram', 'TikTok'],
        contentIdeas: [
          'Macro shots of raw botanical ingredients',
          'Sourcing/harvest behind-the-scenes reel',
          'Ingredient-of-the-month educational post',
        ],
      },
      {
        name: 'Skin Barrier Repair',
        category: 'Skincare Education',
        description:
          'Consumers are prioritizing barrier health over aggressive actives after years of over-exfoliation trends.',
        suggestedCampaign: '"Repair Before You Retinol" education campaign',
        suggestedPlatforms: ['Instagram', 'TikTok', 'Website'],
        contentIdeas: [
          'Dermatologist Q&A on barrier repair',
          '"Signs your barrier is damaged" carousel',
          'Minimalist routine reel for sensitized skin',
        ],
      },
      {
        name: 'Short Educational Reels',
        category: 'Content Strategy',
        description:
          'Bite-sized "how-to" and "why it works" reels are outperforming polished ads in engagement and saves.',
        suggestedCampaign: '"60-Second Skin School" reel series',
        suggestedPlatforms: ['TikTok', 'Instagram'],
        contentIdeas: [
          '"3 mistakes you’re making" quick-tip reel',
          'Ingredient science explained in 30 seconds',
          'Myth vs fact skincare series',
        ],
      },
      {
        name: 'Before/After Campaigns',
        category: 'Social Proof',
        description:
          'Authentic, unedited before/after content remains one of the highest-converting social proof formats.',
        suggestedCampaign: 'UGC-driven "Real Results" transformation campaign',
        suggestedPlatforms: ['Instagram', 'Facebook Ads'],
        contentIdeas: [
          'Customer transformation carousel',
          'Timelapse before/after video',
          '"Send us your results" UGC callout',
        ],
      },
    ],
  });

  // ---------------------------------------------------------------------
  // Product briefs + generated content
  // ---------------------------------------------------------------------
  const briefDefs: Array<{
    brief: ProductBriefInput;
    status: string;
    owner: string;
  }> = [
    {
      brief: {
        productName: 'Lumina Vitamin C Serum',
        productCategory: 'Brightening Serum',
        targetAudience: 'Women 25-45 concerned about dull skin and hyperpigmentation',
        mainBenefits: 'brightens skin tone, fades dark spots, and boosts collagen production',
        toneOfVoice: 'Scientific',
        language: 'English',
        platform: 'Instagram',
        campaignGoal: 'Drive pre-launch waitlist signups',
        additionalNotes:
          'Emphasize the clinical trial results showing visible brightening in 4 weeks.',
      },
      status: 'Pending Review',
      owner: 'Dana Cohen',
    },
    {
      brief: {
        productName: 'Velora Midnight Repair Cream',
        productCategory: 'Luxury Night Cream',
        targetAudience: 'Affluent women 35-55 seeking anti-aging skincare',
        mainBenefits:
          'deep overnight hydration, visible fine-line reduction, and a firmer, radiant complexion',
        toneOfVoice: 'Luxury',
        language: 'English',
        platform: 'Website',
        campaignGoal: 'Position as the flagship product of the premium line',
        additionalNotes: 'Reference the 24k gold-infused formula.',
      },
      status: 'Approved',
      owner: 'Noa Levi',
    },
    {
      brief: {
        productName: 'Adama Purifying Clay Mask',
        productCategory: 'Natural Clay Mask',
        targetAudience: 'נשים בגילאי 20-35 עם עור שמן ונטייה לפצעונים',
        mainBenefits: 'ניקוי עמוק של הנקבוביות, איזון שמן טבעי ועור רך יותר לאחר שימוש אחד',
        toneOfVoice: 'Natural',
        language: 'Hebrew',
        platform: 'TikTok',
        campaignGoal: 'הגברת מודעות למותג בקרב קהל צעיר',
        additionalNotes: 'להדגיש שהמסכה מיוצרת מחומרי גלם טבעיים ממקור מקומי.',
      },
      status: 'Rejected',
      owner: 'Yael Mizrahi',
    },
    {
      brief: {
        productName: 'Titan Grooming Co. Beard & Face Kit',
        productCategory: "Men's Grooming Set",
        targetAudience: 'Men 22-40 building a grooming routine',
        mainBenefits:
          'softer beard, reduced skin irritation, and a fresh, confidence-boosting scent',
        toneOfVoice: 'Professional',
        language: 'English',
        platform: 'Facebook Ads',
        campaignGoal: 'Drive Father’s Day promotional sales',
        additionalNotes: 'Highlight the bundle discount versus buying items separately.',
      },
      status: 'Ready to Publish',
      owner: 'Itai Barak',
    },
  ];

  const createdBriefs: Awaited<ReturnType<typeof prisma.productBrief.create>>[] = [];
  for (const def of briefDefs) {
    const productBrief = await prisma.productBrief.create({ data: def.brief });
    const aiResult = await mockAi.generateMarketingContent(def.brief);

    await prisma.generatedContent.create({
      data: {
        productBriefId: productBrief.id,
        productDescription: aiResult.productDescription,
        instagramPost: aiResult.instagramPost,
        tiktokScript: aiResult.tiktokScript,
        emailCampaign: aiResult.emailCampaign,
        adCopy: aiResult.adCopy,
        seoTitle: aiResult.seoTitle,
        hashtags: aiResult.hashtags,
        imagePrompt: aiResult.imagePrompt,
        status: def.status,
        owner: def.owner,
        contentType: 'Full Campaign',
      },
    });

    createdBriefs.push(productBrief);
  }

  // ---------------------------------------------------------------------
  // Workflow tasks
  // ---------------------------------------------------------------------
  await prisma.workflowTask.createMany({
    data: [
      {
        title: 'Review Instagram caption for Lumina Vitamin C Serum',
        productName: 'Lumina Vitamin C Serum',
        contentType: 'Instagram Post',
        assignedTo: 'Dana Cohen',
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        notes: 'Needs legal sign-off on the "clinically proven" claim before publishing.',
      },
      {
        title: 'Finalize hero image for Velora Midnight Repair Cream',
        productName: 'Velora Midnight Repair Cream',
        contentType: 'Product Image',
        assignedTo: 'Noa Levi',
        status: 'To Do',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        notes: 'Waiting on studio photography batch from vendor.',
      },
      {
        title: 'Rework TikTok script for Adama Clay Mask after rejection',
        productName: 'Adama Purifying Clay Mask',
        contentType: 'TikTok Script',
        assignedTo: 'Yael Mizrahi',
        status: 'To Do',
        priority: 'High',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        notes: 'Marketing lead rejected the tone — needs to feel more youthful and energetic.',
      },
      {
        title: 'Schedule Facebook Ads launch for Titan Grooming Kit',
        productName: 'Titan Grooming Co. Beard & Face Kit',
        contentType: 'Facebook Ad',
        assignedTo: 'Itai Barak',
        status: 'Done',
        priority: 'Low',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        notes: 'Approved and scheduled to go live for the Father’s Day promotion.',
      },
    ],
  });

  console.log(
    `Seeded ${createdBriefs.length} product briefs with generated content, 6 prompt templates, 6 trends, 4 workflow tasks.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
