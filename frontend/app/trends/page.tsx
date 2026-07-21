'use client';

import { useCallback, useEffect, useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { listTrends, generateTrends } from '@/lib/api';
import type { Trend } from '@/types';

export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTrends();
      setTrends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trends.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const data = await generateTrends();
      setTrends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate new trends.');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Trends</h2>
          <p className="text-sm text-gray-500">AI-surfaced marketing trends for the beauty industry.</p>
        </div>
        <Button data-testid="btn-generate-trends" onClick={handleGenerate} disabled={generating}>
          {generating ? 'Generating…' : 'Generate New Trends'}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading trends…</p>
      ) : trends.length === 0 ? (
        <p className="text-sm text-gray-400">No trends yet. Try generating some.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trends.map((trend) => (
            <Card key={trend.id} data-testid="trend-card" className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900">{trend.name}</h3>
                <span className="text-xs bg-brand-50 text-brand-700 rounded-full px-2 py-0.5 whitespace-nowrap">
                  {trend.category}
                </span>
              </div>
              <p className="text-sm text-gray-600">{trend.description}</p>
              <div className="text-xs text-gray-500">
                <span className="font-medium text-gray-700">Suggested Campaign: </span>
                {trend.suggestedCampaign}
              </div>
              {trend.suggestedPlatforms?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {trend.suggestedPlatforms.map((p) => (
                    <span key={p} className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5">
                      {p}
                    </span>
                  ))}
                </div>
              )}
              {trend.contentIdeas?.length > 0 && (
                <div className="text-xs text-gray-600 mt-1">
                  <span className="font-medium text-gray-700">Content Ideas:</span>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    {trend.contentIdeas.map((idea, i) => (
                      <li key={i}>{idea}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
