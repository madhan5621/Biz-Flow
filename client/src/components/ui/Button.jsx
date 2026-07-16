import { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500/30 shadow-sm',
  secondary: 'bg-surface-100 text-surface-700 hover:bg-surface-200 focus:ring-surface-500/30 dark:bg-surface-700 dark:text-surface-200 dark:hover:bg-surface-600',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500/30 shadow-sm',
  success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500/30 shadow-sm',
  warning: 'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500/30 shadow-sm',
  ghost: 'bg-transparent text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800',
  outline: 'border border-surface-300 text-surface-700 hover:bg-surface-50 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-800',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs gap-1',
  sm: 'px-3 py-2 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2',
  xl: 'px-6 py-3.5 text-base gap-2.5',
  icon: 'p-2',
  'icon-sm': 'p-1.5',
  'icon-lg': 'p-3',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-surface-900',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : LeftIcon ? (
          <LeftIcon className="w-4 h-4" />
        ) : null}
        {children}
        {RightIcon && !isLoading && <RightIcon className="w-4 h-4" />}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
