import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: 'primary' | 'success' | 'warning' | 'destructive';
}

const variantStyles = {
  primary: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon: 'bg-blue-600 text-white',
    text: 'text-blue-600 dark:text-blue-400',
  },
  success: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    icon: 'bg-green-600 text-white',
    text: 'text-green-600 dark:text-green-400',
  },
  warning: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    icon: 'bg-yellow-600 text-white',
    text: 'text-yellow-600 dark:text-yellow-400',
  },
  destructive: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    icon: 'bg-red-600 text-white',
    text: 'text-red-600 dark:text-red-400',
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  variant,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="rounded-xl bg-card p-4 shadow-md transition-all duration-300 hover:shadow-lg sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">
            {title}
          </p>
          <p
            className={cn(
              'mt-1 text-2xl font-bold sm:mt-2 sm:text-4xl',
              styles.text
            )}
          >
            {value.toLocaleString('ar-EG')}
          </p>
        </div>
        <div
          className={cn(
            'flex-shrink-0 rounded-lg p-2 sm:rounded-xl sm:p-4',
            styles.bg
          )}
        >
          <div className={cn('rounded-md p-1.5 sm:rounded-lg sm:p-2', styles.icon)}>
            <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
