'use client';

import { useCallback, useEffect, useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import DataTable, { DataTableColumn } from '@/components/DataTable';
import { listTasks, createTask, updateTaskStatus } from '@/lib/api';
import type { TaskPriority, TaskStatus, WorkflowTask } from '@/types';

const PRIORITY_OPTIONS: TaskPriority[] = ['Low', 'Medium', 'High'];
const STATUS_OPTIONS: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

interface TaskFormState {
  title: string;
  productName: string;
  contentType: string;
  assignedTo: string;
  priority: TaskPriority;
  dueDate: string;
  notes: string;
}

const INITIAL_FORM: TaskFormState = {
  title: '',
  productName: '',
  contentType: '',
  assignedTo: '',
  priority: 'Medium',
  dueDate: '',
  notes: '',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<TaskFormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function update<K extends keyof TaskFormState>(key: K, value: TaskFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!form.title.trim() || !form.productName.trim() || !form.assignedTo.trim()) {
      setFormError('Task Title, Product, and Assigned To are required.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await createTask({
        title: form.title.trim(),
        productName: form.productName.trim(),
        contentType: form.contentType.trim(),
        assignedTo: form.assignedTo.trim(),
        priority: form.priority,
        dueDate: form.dueDate || undefined,
        notes: form.notes.trim() || undefined,
      });
      setTasks((prev) => [created, ...prev]);
      setModalOpen(false);
      setForm(INITIAL_FORM);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create task.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(task: WorkflowTask, status: TaskStatus) {
    setStatusUpdatingId(task.id);
    setError(null);
    try {
      const updated = await updateTaskStatus(task.id, status);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status.');
    } finally {
      setStatusUpdatingId(null);
    }
  }

  const columns: DataTableColumn<WorkflowTask>[] = [
    { key: 'title', header: 'Title', render: (t) => <span>{t.title}</span> },
    { key: 'productName', header: 'Product', render: (t) => t.productName },
    { key: 'contentType', header: 'Content Type', render: (t) => t.contentType },
    { key: 'assignedTo', header: 'Assigned To', render: (t) => t.assignedTo },
    {
      key: 'priority',
      header: 'Priority',
      render: (t) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            t.priority === 'High'
              ? 'bg-red-100 text-red-700'
              : t.priority === 'Medium'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {t.priority}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (t) => (t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'),
    },
    {
      key: 'status',
      header: 'Status',
      render: (t) => (
        <select
          data-testid="select-task-status"
          value={t.status}
          disabled={statusUpdatingId === t.id}
          onChange={(e) => handleStatusChange(t, e.target.value as TaskStatus)}
          className="rounded-lg border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          <p className="text-sm text-gray-500">Track marketing content workflow tasks.</p>
        </div>
        <Button data-testid="btn-create-task" onClick={() => setModalOpen(true)}>
          + Create Task
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading tasks…</p>
      ) : (
        <DataTable
          columns={columns}
          rows={tasks}
          rowKey={(t) => t.id}
          rowTestId={() => 'task-row'}
          emptyMessage="No tasks yet. Create one to get started."
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Task" data-testid="create-task-modal">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              data-testid="input-task-title"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
            <input
              type="text"
              data-testid="input-task-product"
              value={form.productName}
              onChange={(e) => update('productName', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
            <input
              type="text"
              data-testid="input-task-content-type"
              value={form.contentType}
              onChange={(e) => update('contentType', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
            <input
              type="text"
              data-testid="input-task-assignee"
              value={form.assignedTo}
              onChange={(e) => update('assignedTo', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                data-testid="select-task-priority"
                value={form.priority}
                onChange={(e) => update('priority', e.target.value as TaskPriority)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                data-testid="input-task-due-date"
                value={form.dueDate}
                onChange={(e) => update('dueDate', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              data-testid="input-task-notes"
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" data-testid="btn-submit-task" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
