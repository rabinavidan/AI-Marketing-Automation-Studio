'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import DataTable, { DataTableColumn } from '@/components/DataTable';
import StatusBadge from '@/components/StatusBadge';
import { listGeneratedContent } from '@/lib/api';
import type { GeneratedContent, ContentStatus } from '@/types';

const STATUS_OPTIONS: ContentStatus[] = [
  'Draft',
  'Pending Review',
  'Approved',
  'Rejected',
  'Needs Design',
  'Ready to Publish',
];

export default function GeneratedContentListPage() {
  const [items, setItems] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const load = useCallback(async (searchValue: string, statusValue: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listGeneratedContent({
        search: searchValue || undefined,
        status: statusValue || undefined,
      });
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load generated content.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => {
      load(search, status);
    }, 250);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  const columns: DataTableColumn<GeneratedContent>[] = [
    { key: 'productName', header: 'Product Name', render: (r) => r.productBrief?.productName ?? '—' },
    { key: 'contentType', header: 'Content Type', render: (r) => r.contentType },
    { key: 'language', header: 'Language', render: (r) => r.productBrief?.language ?? '—' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'owner', header: 'Owner', render: (r) => r.owner },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <Link href={`/generated-content/${r.id}`} className="text-brand-600 hover:underline text-xs font-medium">
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Generated Content</h2>
        <p className="text-sm text-gray-500">Browse and manage all AI-generated marketing content.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          data-testid="search-generated-content"
          placeholder="Search by product name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <select
          data-testid="filter-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:w-56 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          rowKey={(r) => r.id}
          emptyMessage="No generated content matches your filters."
        />
      )}
    </div>
  );
}
