import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  );
}
