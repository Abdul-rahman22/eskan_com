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
    bg: 'bg-primary/10',
    icon: 'bg-primary text-primary-foreground',
    text: 'text-primary',
  },
  success: {
    bg: 'bg-success/10',
    icon: 'bg-success text-success-foreground',
    text: 'text-success',
  },
  warning: {
    bg: 'bg-warning/10',
    icon: 'bg-warning text-warning-foreground',
    text: 'text-warning',
  },
  destructive: {
    bg: 'bg-destructive/10',
    icon: 'bg-destructive text-destructive-foreground',
    text: 'text-destructive',
  },
};

export function StatCard({ title, value, icon: Icon, variant }: StatCardProps) {
  const styles = variantStyles[variant];
  
  return (
    <div className="animate-fade-in rounded-xl bg-card p-4 shadow-card transition-all duration-300 hover:shadow-lg sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">{title}</p>
          <p className={cn('mt-1 text-2xl font-bold sm:mt-2 sm:text-4xl', styles.text)}>{value}</p>
        </div>
        <div className={cn('flex-shrink-0 rounded-lg p-2 sm:rounded-xl sm:p-4', styles.bg)}>
          <div className={cn('rounded-md p-1.5 sm:rounded-lg sm:p-2', styles.icon)}>
            <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
