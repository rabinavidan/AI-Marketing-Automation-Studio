'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import CopyButton from '@/components/CopyButton';
import { generateImagePrompt } from '@/lib/api';
import type { ImagePromptInput } from '@/types';

const ASPECT_RATIO_OPTIONS = ['1:1', '4:5', '9:16', '16:9', '3:2'];
const TOOL_OPTIONS = ['Midjourney', 'Stable Diffusion', 'ChatGPT Image', 'Runway', 'Pika'];

const INITIAL_STATE: ImagePromptInput = {
  productName: '',
  productType: '',
  visualStyle: '',
  background: '',
  lighting: '',
  mood: '',
  brandStyle: '',
  aspectRatio: ASPECT_RATIO_OPTIONS[0],
  tool: TOOL_OPTIONS[0],
};

export default function ImagePromptGeneratorPage() {
  const [form, setForm] = useState<ImagePromptInput>(INITIAL_STATE);
  const [output, setOutput] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ImagePromptInput>(key: K, value: ImagePromptInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await generateImagePrompt(form);
      setOutput(result.prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image prompt.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Image Prompt Generator</h2>
        <p className="text-sm text-gray-500">
          Generate ready-to-use prompts for AI image tools like Midjourney or Stable Diffusion.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Product Name"
              testId="input-image-product-name"
              value={form.productName}
              onChange={(v) => update('productName', v)}
              placeholder="e.g. Radiant Glow Serum"
            />
            <Field
              label="Product Type"
              testId="input-product-type"
              value={form.productType}
              onChange={(v) => update('productType', v)}
              placeholder="e.g. Skincare bottle"
            />
            <Field
              label="Visual Style"
              testId="input-visual-style"
              value={form.visualStyle}
              onChange={(v) => update('visualStyle', v)}
              placeholder="e.g. Minimalist, editorial"
            />
            <Field
              label="Background"
              testId="input-background"
              value={form.background}
              onChange={(v) => update('background', v)}
              placeholder="e.g. Soft marble surface"
            />
            <Field
              label="Lighting"
              testId="input-lighting"
              value={form.lighting}
              onChange={(v) => update('lighting', v)}
              placeholder="e.g. Soft studio lighting"
            />
            <Field
              label="Mood"
              testId="input-mood"
              value={form.mood}
              onChange={(v) => update('mood', v)}
              placeholder="e.g. Calm, luxurious"
            />
            <Field
              label="Brand Style"
              testId="input-brand-style"
              value={form.brandStyle}
              onChange={(v) => update('brandStyle', v)}
              placeholder="e.g. Clean beauty, premium"
            />

            <div>
              <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-700 mb-1">
                Aspect Ratio
              </label>
              <select
                id="aspectRatio"
                data-testid="select-aspect-ratio"
                value={form.aspectRatio}
                onChange={(e) => update('aspectRatio', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {ASPECT_RATIO_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tool" className="block text-sm font-medium text-gray-700 mb-1">
                Tool
              </label>
              <select
                id="tool"
                data-testid="select-tool"
                value={form.tool}
                onChange={(e) => update('tool', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {TOOL_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <Button type="submit" data-testid="btn-generate-image-prompt" disabled={submitting}>
            {submitting ? 'Generating…' : 'Generate Image Prompt'}
          </Button>
        </form>
      </Card>

      {output && (
        <Card title="Generated Prompt">
          <div
            data-testid="image-prompt-output"
            className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 rounded-lg p-4 mb-3"
          >
            {output}
          </div>
          <CopyButton text={output} testId="btn-copy-image-prompt" label="Copy Prompt" />
        </Card>
      )}
    </div>
  );
}

function Field({
  label,
  testId,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  testId: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        data-testid={testId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  );
}
