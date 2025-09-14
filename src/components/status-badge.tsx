import { cn } from '@/lib/utils';
import type { SubstitutionRequest } from '@/lib/types';

export function StatusBadge({ status }: { status: SubstitutionRequest['status'] }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        {
          'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800':
            status === 'Pending',
          'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800':
            status === 'Approved',
          'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800':
            status === 'Denied',
        }
      )}
    >
      {status}
    </div>
  );
}
