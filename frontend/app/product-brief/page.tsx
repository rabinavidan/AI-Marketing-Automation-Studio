'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { generateContent } from '@/lib/api';
import type { ProductBriefInput } from '@/types';

const PLATFORM_OPTIONS = ['Instagram', 'TikTok', 'Website', 'Email', 'Facebook Ads', 'Google Ads'];
const TONE_OPTIONS = ['Premium', 'Friendly', 'Professional', 'Luxury', 'Young', 'Natural', 'Scientific'];
const LANGUAGE_OPTIONS = ['English', 'Hebrew'];

interface FormState {
  productName: string;
  productCategory: string;
  targetAudience: string;
  mainBenefits: string;
  toneOfVoice: string;
  language: string;
  platform: string;
  campaignGoal: string;
  additionalNotes: string;
}

const INITIAL_STATE: FormState = {
  productName: '',
  productCategory: '',
  targetAudience: '',
  mainBenefits: '',
  toneOfVoice: TONE_OPTIONS[0],
  language: LANGUAGE_OPTIONS[0],
  platform: PLATFORM_OPTIONS[0],
  campaignGoal: '',
  additionalNotes: '',
};

type Errors = Partial<Record<'productName' | 'productCategory' | 'targetAudience' | 'platform' | 'language', string>>;

export default function ProductBriefPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!form.productName.trim()) next.productName = 'Product Name is required.';
    if (!form.productCategory.trim()) next.productCategory = 'Product Category is required.';
    if (!form.targetAudience.trim()) next.targetAudience = 'Target Audience is required.';
    if (!form.platform) next.platform = 'Platform is required.';
    if (!form.language) next.language = 'Language is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    const brief: ProductBriefInput = {
      productName: form.productName.trim(),
      productCategory: form.productCategory.trim(),
      targetAudience: form.targetAudience.trim(),
      mainBenefits: form.mainBenefits.trim() || undefined,
      toneOfVoice: form.toneOfVoice,
      language: form.language,
      platform: form.platform,
      campaignGoal: form.campaignGoal.trim() || undefined,
      additionalNotes: form.additionalNotes.trim() || undefined,
    };

    try {
      const content = await generateContent({ brief });
      router.push(`/generated-content/${content.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to generate content.');
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Product Brief</h2>
        <p className="text-sm text-gray-500">
          Fill in the product details and let AI generate a full marketing content package.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="productName"
              type="text"
              data-testid="input-product-name"
              value={form.productName}
              onChange={(e) => update('productName', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Radiant Glow Serum"
            />
            {errors.productName && (
              <p data-testid="error-product-name" className="mt-1 text-xs text-red-600">
                {errors.productName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Product Category <span className="text-red-500">*</span>
            </label>
            <input
              id="productCategory"
              type="text"
              data-testid="input-product-category"
              value={form.productCategory}
              onChange={(e) => update('productCategory', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Skincare"
            />
            {errors.productCategory && (
              <p data-testid="error-product-category" className="mt-1 text-xs text-red-600">
                {errors.productCategory}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <input
              id="targetAudience"
              type="text"
              data-testid="input-target-audience"
              value={form.targetAudience}
              onChange={(e) => update('targetAudience', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Women 25-40 interested in clean beauty"
            />
            {errors.targetAudience && (
              <p data-testid="error-target-audience" className="mt-1 text-xs text-red-600">
                {errors.targetAudience}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="mainBenefits" className="block text-sm font-medium text-gray-700 mb-1">
              Main Benefits
            </label>
            <textarea
              id="mainBenefits"
              data-testid="input-main-benefits"
              value={form.mainBenefits}
              onChange={(e) => update('mainBenefits', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Hydrates, reduces fine lines, brightens skin tone"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="toneOfVoice" className="block text-sm font-medium text-gray-700 mb-1">
                Tone of Voice
              </label>
              <select
                id="toneOfVoice"
                data-testid="select-tone"
                value={form.toneOfVoice}
                onChange={(e) => update('toneOfVoice', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {TONE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language <span className="text-red-500">*</span>
              </label>
              <select
                id="language"
                data-testid="select-language"
                value={form.language}
                onChange={(e) => update('language', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              {errors.language && (
                <p data-testid="error-language" className="mt-1 text-xs text-red-600">
                  {errors.language}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                Platform <span className="text-red-500">*</span>
              </label>
              <select
                id="platform"
                data-testid="select-platform"
                value={form.platform}
                onChange={(e) => update('platform', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {PLATFORM_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.platform && (
                <p data-testid="error-platform" className="mt-1 text-xs text-red-600">
                  {errors.platform}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="campaignGoal" className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Goal
            </label>
            <input
              id="campaignGoal"
              type="text"
              data-testid="input-campaign-goal"
              value={form.campaignGoal}
              onChange={(e) => update('campaignGoal', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="e.g. Drive launch-week sales"
            />
          </div>

          <div>
            <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              id="additionalNotes"
              data-testid="input-additional-notes"
              value={form.additionalNotes}
              onChange={(e) => update('additionalNotes', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Anything else the AI should know?"
            />
          </div>

          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" data-testid="btn-generate-content" disabled={submitting}>
              {submitting ? 'Generating…' : 'Generate Content'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
