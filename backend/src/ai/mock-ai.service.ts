import { Injectable } from '@nestjs/common';
import { AIService } from './ai-service.interface';
import { AIContentResult, ImagePromptInput, ProductBriefInput, TrendInput } from './ai.types';

/**
 * MockAIService — the default AI implementation whenever OPENAI_API_KEY is not
 * set (the typical dev/CI/demo path). It builds realistic, varied cosmetics
 * marketing copy by assembling real sentences from the brief's fields (product
 * name, category, tone of voice, platform, language) rather than emitting
 * generic placeholder text. Output varies slightly on every call so
 * "regenerate" feels alive during a live demo.
 */
@Injectable()
export class MockAIService implements AIService {
  async generateMarketingContent(brief: ProductBriefInput): Promise<AIContentResult> {
    return this.buildContent(brief);
  }

  async regenerateContent(
    _existing: AIContentResult,
    brief: ProductBriefInput,
  ): Promise<AIContentResult> {
    // Regenerate every text field with fresh phrasing/randomization.
    return this.buildContent(brief);
  }

  async generateImagePrompt(data: ImagePromptInput): Promise<{ prompt: string }> {
    const productType = data.productType || 'cosmetics product';
    const background = data.background || 'clean beige';
    const lighting = data.lighting || 'soft studio lighting';
    const mood = data.mood || 'elegant';
    const brandStyle = data.brandStyle || 'premium cosmetics branding';
    const aspectRatio = data.aspectRatio || '1:1';
    const tool = data.tool || 'Midjourney';
    const visualStyle = data.visualStyle || 'realistic commercial photography';
    const nameFragment = data.productName ? ` for "${data.productName}"` : '';

    const prompt =
      `Create a ${brandStyle} ${productType} product image${nameFragment} on a ${background} ` +
      `background, ${lighting}, ${mood} mood, ${visualStyle}, ${aspectRatio} aspect ratio, ` +
      `optimized for ${tool}, 4K, high detail, elegant composition.`;

    return { prompt };
  }

  async generateTrendIdeas(): Promise<TrendInput[]> {
    const pool = makeTrendBuilders();
    const shuffled = shuffle(pool);
    const count = randomInt(5, 6);
    return shuffled.slice(0, count).map((build) => build());
  }

  // ---------------------------------------------------------------------
  // Content assembly
  // ---------------------------------------------------------------------

  private buildContent(brief: ProductBriefInput): AIContentResult {
    const isHebrew = (brief.language || '').toLowerCase() === 'hebrew';
    const defaultBenefits = isHebrew
      ? 'תוצאות נראות לעין ואיכות בלתי מתפשרת'
      : 'visible, dermatologist-loved results';
    const normalized: NormalizedBrief = {
      ...brief,
      mainBenefits: brief.mainBenefits?.trim() || defaultBenefits,
    };
    return isHebrew ? buildHebrewContent(normalized) : buildEnglishContent(normalized);
  }
}

// =============================================================================
// Helpers — small, focused, and reused across English/Hebrew builders.
// =============================================================================

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function slugWord(word: string): string {
  return word.replace(/[^a-zA-Z0-9]/g, '');
}

interface ToneProfile {
  adjectives: string[];
  voiceDesc: string;
  cta: string[];
  emailSignoff: string;
}

const TONE_PROFILES: Record<string, ToneProfile> = {
  Premium: {
    adjectives: ['premium', 'elevated', 'refined', 'indulgent'],
    voiceDesc: 'a polished, aspirational voice',
    cta: ['Discover the difference', 'Elevate your routine today', 'Experience premium care'],
    emailSignoff: 'With elevated care,',
  },
  Friendly: {
    adjectives: ['feel-good', 'easygoing', 'approachable', 'joyful'],
    voiceDesc: 'a warm, conversational voice',
    cta: ['Grab yours today!', "You're going to love this", 'Treat yourself, you deserve it'],
    emailSignoff: 'Warmly,',
  },
  Professional: {
    adjectives: ['reliable', 'results-driven', 'trusted', 'clinically-informed'],
    voiceDesc: 'a clear, confident voice',
    cta: ['Learn more about the results', 'See the difference for yourself', 'Start today'],
    emailSignoff: 'Best regards,',
  },
  Luxury: {
    adjectives: ['opulent', 'exquisite', 'exclusive', 'lavish'],
    voiceDesc: 'a lavish, editorial voice',
    cta: ['Indulge in the exclusive collection', 'Reserve yours now', 'Step into luxury'],
    emailSignoff: 'With distinction,',
  },
  Young: {
    adjectives: ['fresh', 'bold', 'trendy', 'vibrant'],
    voiceDesc: 'an energetic, playful voice',
    cta: ['Don’t sleep on this', 'Tag a friend who needs this', 'Get it before it sells out'],
    emailSignoff: 'Stay glowing,',
  },
  Natural: {
    adjectives: ['pure', 'gentle', 'botanical', 'wholesome'],
    voiceDesc: 'a calm, grounded voice',
    cta: ['Go back to basics', 'Nourish your skin naturally', 'Try the clean routine'],
    emailSignoff: 'Naturally yours,',
  },
  Scientific: {
    adjectives: [
      'clinically-tested',
      'dermatologist-developed',
      'lab-proven',
      'precision-formulated',
    ],
    voiceDesc: 'a precise, evidence-based voice',
    cta: ['See the clinical results', 'Backed by science', 'Discover the formula'],
    emailSignoff: 'In good science,',
  },
};

function toneProfile(tone: string): ToneProfile {
  return TONE_PROFILES[tone] || TONE_PROFILES.Professional;
}

const GENERIC_BEAUTY_HASHTAGS = [
  'skincare',
  'beautytech',
  'glowup',
  'selfcare',
  'cosmetics',
  'skincareroutine',
  'beautybrand',
  'crueltyfree',
];

function buildHashtags(brief: ProductBriefInput): string[] {
  const nameTokens = brief.productName.split(/\s+/).map(slugWord).filter(Boolean);
  const categoryTag = slugWord(brief.productCategory.split(/\s+/)[0] || 'beauty');
  const toneTag = slugWord(brief.toneOfVoice || 'beauty');
  const platformTag = slugWord(brief.platform || '');

  const base = new Set<string>();
  base.add(nameTokens.join(''));
  if (categoryTag) base.add(categoryTag.toLowerCase());
  if (toneTag) base.add(`${toneTag.toLowerCase()}beauty`);
  if (platformTag) base.add(`${platformTag.toLowerCase()}beauty`);

  const picked = pickMany(GENERIC_BEAUTY_HASHTAGS, 5);
  picked.forEach((h) => base.add(h));

  return Array.from(base)
    .filter((tag) => tag && tag.length > 1)
    .slice(0, 10);
}

function buildImagePromptFromBrief(brief: ProductBriefInput): string {
  const tone = toneProfile(brief.toneOfVoice);
  const style = pick(['minimalist', 'editorial', 'clean commercial', 'soft-focus lifestyle']);
  const background = pick(['clean beige', 'soft pastel', 'marble', 'brushed linen']);
  const lighting = pick([
    'soft studio lighting',
    'golden-hour natural light',
    'diffused softbox lighting',
  ]);
  return (
    `Create a ${pick(tone.adjectives)} ${brief.productCategory} product image for "${brief.productName}" ` +
    `on a ${background} background, ${lighting}, ${tone.adjectives[0]} cosmetics branding, ` +
    `${style} commercial photography, 4K, high detail, elegant composition.`
  );
}

// ---------------------------------------------------------------------------
// English content
// ---------------------------------------------------------------------------

type NormalizedBrief = ProductBriefInput & { mainBenefits: string };

function buildEnglishContent(brief: NormalizedBrief): AIContentResult {
  const tone = toneProfile(brief.toneOfVoice);
  const adjective = pick(tone.adjectives);
  const secondAdjective = pick(tone.adjectives.filter((a) => a !== adjective)) || adjective;
  const cta = pick(tone.cta);
  const goal = brief.campaignGoal ? ` The goal: ${brief.campaignGoal.toLowerCase()}.` : '';

  const productDescription =
    `${brief.productName} is a ${adjective} ${brief.productCategory.toLowerCase()} crafted for ` +
    `${brief.targetAudience}. With ${tone.voiceDesc}, it delivers ${brief.mainBenefits.toLowerCase()}, ` +
    `making it a standout addition to any routine.${goal} ` +
    `Formulated to feel ${secondAdjective}, ${brief.productName} is designed for ${brief.platform} ` +
    `audiences who expect real, visible results.`;

  const instagramEmoji = pick(['✨', '💎', '🌿', '💖', '🔥']);
  const instagramPost =
    `${instagramEmoji} Meet ${brief.productName} — the ${adjective} ${brief.productCategory.toLowerCase()} ` +
    `${brief.targetAudience} have been waiting for.\n\n` +
    `${capitalize(brief.mainBenefits)}. That's the ${brief.productName} promise.\n\n` +
    `${cta} → link in bio ${instagramEmoji}`;

  const tiktokScript =
    `HOOK (0-3s): "Wait, this ${brief.productCategory.toLowerCase()} actually works?"\n` +
    `SCENE 1 (3-8s): Show ${brief.productName} up close, ${adjective} packaging reveal.\n` +
    `SCENE 2 (8-15s): Quick application demo — voiceover explains ${brief.mainBenefits.toLowerCase()}.\n` +
    `SCENE 3 (15-22s): Before/after or texture close-up, on-screen text: "${capitalize(secondAdjective)} results."\n` +
    `CTA (22-30s): "${cta}" + on-screen arrow to bio link.`;

  const emailCampaign =
    `Subject: ${capitalize(adjective)} results start with ${brief.productName}\n\n` +
    `Hi there,\n\n` +
    `We built ${brief.productName} for people like you — ${brief.targetAudience} who want ` +
    `${brief.mainBenefits.toLowerCase()} without compromise.\n\n` +
    `This ${brief.productCategory.toLowerCase()} brings ${tone.voiceDesc.replace('a ', '')} to your routine, ` +
    `and it's made to perform on ${brief.platform}-worthy results.\n\n` +
    `${cta}.\n\n` +
    `${tone.emailSignoff}\nThe Team`;

  const adCopy =
    `${capitalize(adjective)} ${brief.productCategory.toLowerCase()} for ${brief.targetAudience}. ` +
    `${capitalize(brief.mainBenefits)}. ${cta}.`;

  const seoTitle = `${brief.productName} – ${capitalize(adjective)} ${brief.productCategory} for ${brief.targetAudience}`;

  const hashtags = buildHashtags(brief);
  const imagePrompt = buildImagePromptFromBrief(brief);

  return {
    productDescription,
    instagramPost,
    tiktokScript,
    emailCampaign,
    adCopy,
    seoTitle,
    hashtags,
    imagePrompt,
  };
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ---------------------------------------------------------------------------
// Hebrew content — real Hebrew marketing phrases, tone-aware.
// ---------------------------------------------------------------------------

interface HebrewToneProfile {
  adjective: string;
  secondAdjective: string;
  cta: string;
  signoff: string;
}

const HEBREW_TONE_PROFILES: Record<string, HebrewToneProfile> = {
  Premium: {
    adjective: 'יוקרתי',
    secondAdjective: 'מעודן',
    cta: 'גלו את ההבדל עכשיו',
    signoff: 'בהצלחה,',
  },
  Friendly: {
    adjective: 'ידידותי וקליל',
    secondAdjective: 'מזמין',
    cta: 'ממשיך בואו לנסות!',
    signoff: 'בחיבה,',
  },
  Professional: {
    adjective: 'מקצועי ואמין',
    secondAdjective: 'אמין',
    cta: 'גלו את התוצאות בעצמכם',
    signoff: 'בברכה,',
  },
  Luxury: {
    adjective: 'מפנק ויוקרתי',
    secondAdjective: 'בלעדי',
    cta: 'הזמינו עכשיו את הקולקציה הבלעדית',
    signoff: 'בהערכה רבה,',
  },
  Young: {
    adjective: 'רענני ואנרגטי',
    secondAdjective: 'טרנדי',
    cta: 'תגיבו לפני שזה אזל!',
    signoff: 'מנצוצות,',
  },
  Natural: {
    adjective: 'טבעי ועדין',
    secondAdjective: 'רך',
    cta: 'חזרו לשגרה הטבעית',
    signoff: 'בברכת הטבע,',
  },
  Scientific: {
    adjective: 'נבדק קלינית',
    secondAdjective: 'מדויק',
    cta: 'גלו את המחקר מאחורי',
    signoff: 'לעור מדעי,',
  },
};

function hebrewToneProfile(tone: string): HebrewToneProfile {
  return HEBREW_TONE_PROFILES[tone] || HEBREW_TONE_PROFILES.Professional;
}

function buildHebrewContent(brief: NormalizedBrief): AIContentResult {
  const tone = hebrewToneProfile(brief.toneOfVoice);
  const name = brief.productName;
  const category = brief.productCategory;
  const audience = brief.targetAudience;
  const benefits = brief.mainBenefits;

  const productDescription =
    `${name} הוא ${category} ${tone.adjective} שפותח במיוחד עבור ` +
    `${audience}. המוצר מעניק ${benefits}, ומעניק תוצאות נראות לעין ` +
    `כבר מהשימוש הראשון. ${name} מצטיין בזכות ${tone.secondAdjective} ` +
    `ומותאם ביחוד לקהל יעד ${brief.platform}.`;

  const instagramEmoji = pick(['✨', '💎', '🌿', '💖']);
  const instagramPost =
    `${instagramEmoji} הכירו את ${name} – ה-${category} ה${tone.adjective} ` +
    `ש-${audience} מחכים לו.\n\n` +
    `${benefits}. זה ההבטחה של ${name}.\n\n` +
    `${tone.cta} ← קישור בביו ${instagramEmoji}`;

  const tiktokScript =
    `פתיח (0-3שניות): "רגע שה-${category} הזה באמת עובד?"\n` +
    `סצנה 1: צילום קרוב של האריזה של ${name}.\n` +
    `סצנה 2: הדגמה שימוש קצרה – קול על רקע מסביר ${benefits}.\n` +
    `סצנה 3: תוצאות לפני/אחרי, כתובית על מסך: "תוצאות ${tone.secondAdjective}."\n` +
    `קריאה לפעולה: "${tone.cta}" + חץ לקישור בביו.`;

  const emailCampaign =
    `נושא: תוצאות ${tone.adjective} מתחילות עם ${name}\n\n` +
    `שלום,\n\n` +
    `יצרנו את ${name} עבור ${audience} שמחפשים ${benefits} ללא פשרות.\n\n` +
    `ה-${category} הזה מביא איתו חוויה ${tone.secondAdjective}, ומותאם בדיוק לקהל יעד ${brief.platform}.\n\n` +
    `${tone.cta}.\n\n` +
    `${tone.signoff}\nהצוות`;

  const adCopy = `${category} ${tone.adjective} עבור ${audience}. ${benefits}. ${tone.cta}.`;

  const seoTitle = `${name} – ${category} ${tone.adjective} עבור ${audience}`;

  const hashtags = buildHashtags(brief);
  const imagePrompt = buildImagePromptFromBrief(brief);

  return {
    productDescription,
    instagramPost,
    tiktokScript,
    emailCampaign,
    adCopy,
    seoTitle,
    hashtags,
    imagePrompt,
  };
}

// ---------------------------------------------------------------------------
// Trend ideas
// ---------------------------------------------------------------------------

type TrendBuilder = () => TrendInput;

function makeTrendBuilders(): TrendBuilder[] {
  return [
    () => ({
      name: 'Clean Beauty',
      category: 'Product Formulation',
      description: pick([
        'Consumers increasingly favor transparent ingredient lists and non-toxic formulations over trend-chasing actives.',
        'Shoppers are scrutinizing labels more than ever, rewarding brands that formulate without parabens, sulfates, or synthetic fragrance.',
      ]),
      suggestedCampaign: pick([
        '"What’s NOT Inside" ingredient transparency series',
        'Clean-label callout campaign highlighting free-from claims',
      ]),
      suggestedPlatforms: pickMany(['Instagram', 'Website', 'Email'], 2),
      contentIdeas: pickMany(
        [
          'Ingredient breakdown carousel post',
          '"Read the label with us" video series',
          'Clean beauty certification badge graphics',
          'Founder story on why the brand went clean-label',
        ],
        3,
      ),
    }),
    () => ({
      name: 'AI Product Personalization',
      category: 'Technology',
      description: pick([
        'Shoppers expect quizzes and AI tools that recommend the exact product for their skin type and concerns.',
        'Personalized routines driven by AI skin-analysis are becoming a standard e-commerce feature.',
      ]),
      suggestedCampaign: pick([
        '"Find Your Match" AI skin-quiz launch campaign',
        'Interactive AI routine-builder promotion',
      ]),
      suggestedPlatforms: pickMany(['Website', 'Instagram', 'TikTok'], 2),
      contentIdeas: pickMany(
        [
          'Behind-the-scenes of the AI quiz build',
          'Customer results from personalized routines',
          '"Ask our AI" interactive Stories sticker',
          'Comparison: generic routine vs personalized routine',
        ],
        3,
      ),
    }),
    () => ({
      name: 'Natural Ingredients',
      category: 'Product Formulation',
      description: pick([
        'Botanical extracts and plant-derived actives continue to outperform synthetic alternatives in consumer sentiment.',
        'Demand for recognizable, nature-derived ingredients keeps rising across skincare categories.',
      ]),
      suggestedCampaign: pick([
        '"Straight From Nature" ingredient spotlight series',
        'Farm-to-face sourcing story campaign',
      ]),
      suggestedPlatforms: pickMany(['Instagram', 'TikTok', 'Email'], 2),
      contentIdeas: pickMany(
        [
          'Macro shots of raw botanical ingredients',
          'Sourcing/harvest behind-the-scenes reel',
          'Ingredient-of-the-month educational post',
          'Sustainability partner interview',
        ],
        3,
      ),
    }),
    () => ({
      name: 'Skin Barrier Repair',
      category: 'Skincare Education',
      description: pick([
        'Consumers are prioritizing barrier health over aggressive actives after years of over-exfoliation trends.',
        '"Barrier-first" skincare is trending as shoppers seek gentler, restorative routines.',
      ]),
      suggestedCampaign: pick([
        '"Repair Before You Retinol" education campaign',
        'Barrier-health awareness series with dermatologist tips',
      ]),
      suggestedPlatforms: pickMany(['Instagram', 'TikTok', 'Website'], 2),
      contentIdeas: pickMany(
        [
          'Dermatologist Q&A on barrier repair',
          '"Signs your barrier is damaged" carousel',
          'Minimalist routine reel for sensitized skin',
          'Product pairing guide for barrier support',
        ],
        3,
      ),
    }),
    () => ({
      name: 'Short Educational Reels',
      category: 'Content Strategy',
      description: pick([
        'Bite-sized "how-to" and "why it works" reels are outperforming polished ads in engagement and saves.',
        'Educational micro-content is driving higher watch-through rates than traditional promotional formats.',
      ]),
      suggestedCampaign: pick([
        '"60-Second Skin School" reel series',
        'Weekly educational reel drop tied to product benefits',
      ]),
      suggestedPlatforms: pickMany(['TikTok', 'Instagram'], 2),
      contentIdeas: pickMany(
        [
          '"3 mistakes you’re making" quick-tip reel',
          'Ingredient science explained in 30 seconds',
          'Myth vs fact skincare series',
          'Quick application technique demo',
        ],
        3,
      ),
    }),
    () => ({
      name: 'Before/After Campaigns',
      category: 'Social Proof',
      description: pick([
        'Authentic, unedited before/after content remains one of the highest-converting social proof formats.',
        'Real customer transformation content is outperforming studio photography in ad testing.',
      ]),
      suggestedCampaign: pick([
        'UGC-driven "Real Results" transformation campaign',
        '30-day transformation challenge with customer features',
      ]),
      suggestedPlatforms: pickMany(['Instagram', 'Facebook Ads', 'TikTok'], 2),
      contentIdeas: pickMany(
        [
          'Customer transformation carousel',
          'Timelapse before/after video',
          '"Send us your results" UGC callout',
          'Split-screen comparison ad creative',
        ],
        3,
      ),
    }),
    () => ({
      name: 'Sustainable Packaging',
      category: 'Brand Values',
      description:
        'Refillable and recyclable packaging is becoming a purchase-deciding factor for eco-conscious beauty shoppers.',
      suggestedCampaign: '"Beauty Without Waste" refill program launch',
      suggestedPlatforms: pickMany(['Instagram', 'Website', 'Email'], 2),
      contentIdeas: pickMany(
        [
          'Unboxing the refill system',
          'Packaging lifecycle infographic',
          'Behind-the-scenes at the sustainable factory',
        ],
        3,
      ),
    }),
    () => ({
      name: 'Micro-Influencer Collabs',
      category: 'Influencer Marketing',
      description:
        'Smaller, niche creators are driving higher trust and conversion than mega-influencers for cosmetics brands.',
      suggestedCampaign: 'Micro-influencer seeding and honest-review campaign',
      suggestedPlatforms: pickMany(['Instagram', 'TikTok'], 2),
      contentIdeas: pickMany(
        [
          'Creator unboxing and first-impressions video',
          '7-day routine takeover with a micro-influencer',
          'Cross-posted UGC testimonial reel',
        ],
        3,
      ),
    }),
    () => ({
      name: 'Multi-Use Hybrid Products',
      category: 'Product Formulation',
      description:
        'Time-strapped consumers are gravitating toward hybrid products that combine skincare and makeup benefits.',
      suggestedCampaign: '"One Step, Many Wins" hybrid product launch',
      suggestedPlatforms: pickMany(['TikTok', 'Instagram', 'Website'], 2),
      contentIdeas: pickMany(
        [
          '"5-in-1" product demo reel',
          'Morning routine simplification tips',
          'Side-by-side vs a 5-step routine',
        ],
        3,
      ),
    }),
  ];
}
