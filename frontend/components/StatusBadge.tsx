import type { ContentStatus } from '@/types';

const STATUS_STYLES: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  'Pending Review': 'bg-amber-100 text-amber-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  'Needs Design': 'bg-purple-100 text-purple-800',
  'Ready to Publish': 'bg-blue-100 text-blue-800',
};

interface StatusBadgeProps {
  status: ContentStatus | string;
  'data-testid'?: string;
}

export default function StatusBadge({ status, ...rest }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-700';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}
      {...rest}
    >
      {status}
    </span>
  );
}
