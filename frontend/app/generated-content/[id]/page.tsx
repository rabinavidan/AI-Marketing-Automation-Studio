'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import CopyButton from '@/components/CopyButton';
import {
  getGeneratedContent,
  regenerateContent,
  updateGeneratedContent,
  updateGeneratedContentStatus,
} from '@/lib/api';
import type { ContentStatus, GeneratedContent } from '@/types';

interface EditableFields {
  productDescription: string;
  instagramPost: string;
  tiktokScript: string;
  emailCampaign: string;
  adCopy: string;
  seoTitle: string;
  hashtagsText: string;
  imagePrompt: string;
}

function toFields(content: GeneratedContent): EditableFields {
  return {
    productDescription: content.productDescription ?? '',
    instagramPost: content.instagramPost ?? '',
    tiktokScript: content.tiktokScript ?? '',
    emailCampaign: content.emailCampaign ?? '',
    adCopy: content.adCopy ?? '',
    seoTitle: content.seoTitle ?? '',
    hashtagsText: (content.hashtags ?? []).join(', '),
    imagePrompt: content.imagePrompt ?? '',
  };
}

function buildFullContentText(content: GeneratedContent, fields: EditableFields): string {
  return [
    `Product Description:\n${fields.productDescription}`,
    `Instagram Post:\n${fields.instagramPost}`,
    `TikTok Video Script:\n${fields.tiktokScript}`,
    `Email Campaign:\n${fields.emailCampaign}`,
    `Ad Copy:\n${fields.adCopy}`,
    `SEO Title:\n${fields.seoTitle}`,
    `Hashtags:\n${fields.hashtagsText}`,
    `Image Generation Prompt:\n${fields.imagePrompt}`,
  ].join('\n\n');
}

export default function GeneratedContentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [fields, setFields] = useState<EditableFields | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<ContentStatus | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getGeneratedContent(id);
      setContent(data);
      setFields(toFields(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load generated content.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  function updateField<K extends keyof EditableFields>(key: K, value: EditableFields[K]) {
    setFields((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave() {
    if (!content || !fields) return;
    setSaving(true);
    setSaveMessage(null);
    setActionError(null);
    try {
      const updated = await updateGeneratedContent(content.id, {
        productDescription: fields.productDescription,
        instagramPost: fields.instagramPost,
        tiktokScript: fields.tiktokScript,
        emailCampaign: fields.emailCampaign,
        adCopy: fields.adCopy,
        seoTitle: fields.seoTitle,
        hashtags: fields.hashtagsText
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        imagePrompt: fields.imagePrompt,
      });
      setContent(updated);
      setFields(toFields(updated));
      setSaveMessage('Saved successfully.');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  }

  async function handleRegenerate() {
    if (!content) return;
    setRegenerating(true);
    setActionError(null);
    try {
      const updated = await regenerateContent(content.id);
      setContent(updated);
      setFields(toFields(updated));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to regenerate content.');
    } finally {
      setRegenerating(false);
    }
  }

  async function handleStatusChange(status: ContentStatus) {
    if (!content) return;
    setStatusUpdating(status);
    setActionError(null);
    try {
      const updated = await updateGeneratedContentStatus(content.id, status);
      setContent(updated);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update status.');
    } finally {
      setStatusUpdating(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-400">Loading content…</p>;
  }

  if (error || !content || !fields) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error ?? 'Content not found.'}{' '}
        <button className="underline font-medium" onClick={load} type="button">
          Retry
        </button>
      </div>
    );
  }

  const fullText = buildFullContentText(content, fields);

  const sections: { key: string; testId: string; label: string; value: string; editKey?: keyof EditableFields }[] = [
    {
      key: 'productDescription',
      testId: 'section-product-description',
      label: 'Product Description',
      value: fields.productDescription,
      editKey: 'productDescription',
    },
    {
      key: 'instagramPost',
      testId: 'section-instagram-post',
      label: 'Instagram Post',
      value: fields.instagramPost,
      editKey: 'instagramPost',
    },
    {
      key: 'tiktokScript',
      testId: 'section-tiktok-script',
      label: 'TikTok Video Script',
      value: fields.tiktokScript,
      editKey: 'tiktokScript',
    },
    {
      key: 'emailCampaign',
      testId: 'section-email-campaign',
      label: 'Email Campaign',
      value: fields.emailCampaign,
      editKey: 'emailCampaign',
    },
    {
      key: 'adCopy',
      testId: 'section-ad-copy',
      label: 'Ad Copy',
      value: fields.adCopy,
      editKey: 'adCopy',
    },
    {
      key: 'seoTitle',
      testId: 'section-seo-title',
      label: 'SEO Title',
      value: fields.seoTitle,
      editKey: 'seoTitle',
    },
    {
      key: 'hashtags',
      testId: 'section-hashtags',
      label: 'Hashtags',
      value: fields.hashtagsText,
      editKey: 'hashtagsText',
    },
    {
      key: 'imagePrompt',
      testId: 'section-image-prompt',
      label: 'Image Generation Prompt',
      value: fields.imagePrompt,
      editKey: 'imagePrompt',
    },
  ];

  return (
    <div data-testid="generated-content-page" className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {content.productBrief?.productName ?? 'Generated Content'}
          </h2>
          <p className="text-sm text-gray-500">Content type: {content.contentType} • Owner: {content.owner}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Status:</span>
          <StatusBadge status={content.status} data-testid="content-status" />
        </div>
      </div>

      {content.productBrief && (
        <Card title="Product Brief Summary">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <dt className="text-gray-500">Product Name</dt>
              <dd className="text-gray-900">{content.productBrief.productName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Category</dt>
              <dd className="text-gray-900">{content.productBrief.productCategory}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Target Audience</dt>
              <dd className="text-gray-900">{content.productBrief.targetAudience}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Platform</dt>
              <dd className="text-gray-900">{content.productBrief.platform}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Tone of Voice</dt>
              <dd className="text-gray-900">{content.productBrief.toneOfVoice || '—'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Language</dt>
              <dd className="text-gray-900">{content.productBrief.language}</dd>
            </div>
          </dl>
        </Card>
      )}

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</div>
      )}
      {saveMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {saveMessage}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button data-testid="btn-save" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <Button
          data-testid="btn-regenerate"
          variant="secondary"
          onClick={handleRegenerate}
          disabled={regenerating}
        >
          {regenerating ? 'Regenerating…' : 'Regenerate'}
        </Button>
        <CopyButton text={fullText} testId="btn-copy" label="Copy" />
        <Button
          data-testid="btn-send-to-review"
          variant="secondary"
          onClick={() => handleStatusChange('Pending Review')}
          disabled={statusUpdating !== null}
        >
          Send to Review
        </Button>
        <Button
          data-testid="btn-approve"
          variant="secondary"
          className="!bg-green-600 !text-white hover:!bg-green-700"
          onClick={() => handleStatusChange('Approved')}
          disabled={statusUpdating !== null}
        >
          Approve
        </Button>
        <Button
          data-testid="btn-reject"
          variant="danger"
          onClick={() => handleStatusChange('Rejected')}
          disabled={statusUpdating !== null}
        >
          Reject
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <Card key={section.key} data-testid={section.testId} title={section.label}>
            <textarea
              value={section.value}
              onChange={(e) => section.editKey && updateField(section.editKey, e.target.value)}
              rows={section.key === 'hashtags' || section.key === 'seoTitle' ? 2 : 4}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </Card>
        ))}
      </div>

      <Card title="Review Notes">
        <textarea
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          rows={3}
          placeholder="Notes for the review team (kept locally in this session)."
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </Card>
    </div>
  );
}
