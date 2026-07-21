'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';
import CopyButton from '@/components/CopyButton';
import { listPromptTemplates, updatePromptTemplate, createPromptTemplate } from '@/lib/api';
import type { PromptTemplate } from '@/types';

export default function PromptLibraryPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ title: string; description: string; promptText: string }>({
    title: '',
    description: '',
    promptText: '',
  });
  const [savingId, setSavingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPromptTemplates();
      setPrompts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prompt templates.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(() => {
    const set = new Set(prompts.map((p) => p.category));
    return Array.from(set).sort();
  }, [prompts]);

  const filtered = category ? prompts.filter((p) => p.category === category) : prompts;

  function startEdit(prompt: PromptTemplate) {
    setEditingId(prompt.id);
    setEditDraft({
      title: prompt.title,
      description: prompt.description,
      promptText: prompt.promptText,
    });
    setActionMessage(null);
  }

  async function saveEdit(id: string) {
    setSavingId(id);
    setError(null);
    try {
      const updated = await updatePromptTemplate(id, editDraft);
      setPrompts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save prompt template.');
    } finally {
      setSavingId(null);
    }
  }

  async function handleSaveAsTemplate(prompt: PromptTemplate) {
    setDuplicatingId(prompt.id);
    setActionMessage(null);
    setError(null);
    try {
      const created = await createPromptTemplate({
        title: `${prompt.title} (Copy)`,
        category: prompt.category,
        description: prompt.description,
        promptText: prompt.promptText,
        tags: prompt.tags,
      });
      setPrompts((prev) => [created, ...prev]);
      setActionMessage(`Saved a copy as "${created.title}".`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template copy.');
    } finally {
      setDuplicatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Prompt Library</h2>
        <p className="text-sm text-gray-500">Reusable AI prompt templates for marketing content.</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <select
          data-testid="filter-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {actionMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {actionMessage}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading prompt templates…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400">No prompt templates found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((prompt) => {
            const isEditing = editingId === prompt.id;
            return (
              <Card key={prompt.id} data-testid="prompt-card" className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {isEditing ? (
                      <input
                        value={editDraft.title}
                        onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm font-semibold"
                      />
                    ) : (
                      <h3 className="text-sm font-semibold text-gray-900">{prompt.title}</h3>
                    )}
                    <span className="inline-block mt-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-700">
                      {prompt.category}
                    </span>
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    value={editDraft.description}
                    onChange={(e) => setEditDraft((d) => ({ ...d, description: e.target.value }))}
                    rows={2}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-600">{prompt.description}</p>
                )}

                {isEditing ? (
                  <textarea
                    value={editDraft.promptText}
                    onChange={(e) => setEditDraft((d) => ({ ...d, promptText: e.target.value }))}
                    rows={4}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-xs font-mono"
                  />
                ) : (
                  <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 line-clamp-4 whitespace-pre-wrap">
                    {prompt.promptText}
                  </p>
                )}

                {prompt.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 mt-auto">
                  {isEditing ? (
                    <>
                      <Button variant="primary" onClick={() => saveEdit(prompt.id)} disabled={savingId === prompt.id}>
                        {savingId === prompt.id ? 'Saving…' : 'Save'}
                      </Button>
                      <Button variant="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <CopyButton text={prompt.promptText} testId="btn-copy-prompt" label="Copy" />
                      <Button
                        data-testid="btn-run-prompt"
                        variant="secondary"
                        onClick={() => router.push('/product-brief')}
                      >
                        Run
                      </Button>
                      <Button data-testid="btn-edit-prompt" variant="secondary" onClick={() => startEdit(prompt)}>
                        Edit
                      </Button>
                      <Button
                        data-testid="btn-save-as-template"
                        variant="ghost"
                        onClick={() => handleSaveAsTemplate(prompt)}
                        disabled={duplicatingId === prompt.id}
                      >
                        {duplicatingId === prompt.id ? 'Saving…' : 'Save as Template'}
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
