import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <Loader2
      className={cn('animate-spin text-primary-600', sizes[size], className)}
    />
  );
};

/**
 * Full-page loading spinner.
 */
export const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-surface-500 dark:text-surface-400 animate-pulse-soft">
        Loading...
      </p>
    </div>
  </div>
);

export default Spinner;
