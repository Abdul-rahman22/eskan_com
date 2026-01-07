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
    className: 'bg-warning/15 text-warning border-warning/30',
    icon: Clock,
  },
  approved: {
    label: 'تم الموافقة',
    className: 'bg-success/15 text-success border-success/30',
    icon: CheckCircle,
  },
  rejected: {
    label: 'تم الرفض',
    className: 'bg-destructive/15 text-destructive border-destructive/30',
    icon: XCircle,
  },
};

export function StatusBadge({ status, showIcon = true, size = 'md' }: StatusBadgeProps) {
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
