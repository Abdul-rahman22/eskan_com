import { cn } from '@/lib/utils';
import { PropertyStatus } from '@/types/property';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: PropertyStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

const statusConfig = {
  pending: {
    label: 'قيد المراجعة',
    className:
      'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    icon: Clock,
  },
  approved: {
    label: 'تم الموافقة',
    className:
      'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    icon: CheckCircle,
  },
  rejected: {
    label: 'تم الرفض',
    className:
      'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    icon: XCircle,
  },
};

export function StatusBadge({
  status,
  showIcon = true,
  size = 'md',
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        config.className,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {showIcon && <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />}
      {config.label}
    </span>
  );
}
