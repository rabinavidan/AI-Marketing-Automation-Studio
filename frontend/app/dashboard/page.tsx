'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Card from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';
import DataTable, { DataTableColumn } from '@/components/DataTable';
import { getDashboardSummary, updateGeneratedContentStatus } from '@/lib/api';
import type { DashboardSummary, DashboardTableRow } from '@/types';

const SUMMARY_CARDS: { key: keyof DashboardSummary; label: string; testId: string }[] = [
  { key: 'totalGeneratedContent', label: 'Total Generated Content', testId: 'summary-card-total' },
  { key: 'pendingReview', label: 'Pending Review', testId: 'summary-card-pending' },
  { key: 'approved', label: 'Approved', testId: 'summary-card-approved' },
  { key: 'rejected', label: 'Rejected', testId: 'summary-card-rejected' },
  { key: 'campaignsReady', label: 'Campaigns Ready', testId: 'summary-card-campaigns-ready' },
  { key: 'tasksInProgress', label: 'Tasks In Progress', testId: 'summary-card-tasks-in-progress' },
];

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard summary.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(row: DashboardTableRow, status: 'Approved' | 'Rejected') {
    setActionError(null);
    try {
      await updateGeneratedContentStatus(row.id, status);
      setSummary((prev) =>
        prev
          ? {
              ...prev,
              table: prev.table.map((r) => (r.id === row.id ? { ...r, status } : r)),
            }
          : prev,
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update status.');
    }
  }

  const columns: DataTableColumn<DashboardTableRow>[] = [
    { key: 'productName', header: 'Product Name', render: (r) => r.productName },
    { key: 'contentType', header: 'Content Type', render: (r) => r.contentType },
    { key: 'language', header: 'Language', render: (r) => r.language },
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
        <div className="flex items-center gap-2">
          <Link href={`/generated-content/${r.id}`} className="text-brand-600 hover:underline text-xs font-medium">
            View
          </Link>
          <Link href={`/generated-content/${r.id}`} className="text-gray-600 hover:underline text-xs font-medium">
            Edit
          </Link>
          <button
            type="button"
            onClick={() => handleStatusChange(r, 'Approved')}
            className="text-green-600 hover:underline text-xs font-medium"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange(r, 'Rejected')}
            className="text-red-600 hover:underline text-xs font-medium"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500">Overview of your AI marketing content pipeline.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}{' '}
          <button className="underline font-medium" onClick={load} type="button">
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {SUMMARY_CARDS.map((card) => (
          <Card key={card.testId} data-testid={card.testId} className="text-center">
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className="text-2xl font-semibold text-gray-900">
              {loading ? '—' : summary ? String(summary[card.key] ?? 0) : '0'}
            </p>
          </Card>
        ))}
      </div>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Content</h3>
        {loading ? (
          <p className="text-sm text-gray-400">Loading table…</p>
        ) : (
          <DataTable
            data-testid="dashboard-table"
            columns={columns}
            rows={summary?.table ?? []}
            rowKey={(r) => r.id}
            emptyMessage="No generated content yet."
          />
        )}
      </div>
    </div>
  );
}
