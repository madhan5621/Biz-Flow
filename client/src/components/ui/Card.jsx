import { cn } from '../../lib/utils';

const Card = ({ children, className, hover = true, padding = true, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-surface-800',
        'border border-surface-200 dark:border-surface-700',
        'rounded-xl',
        'shadow-soft',
        'transition-shadow duration-200',
        hover && 'hover:shadow-soft-md',
        padding && 'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => (
  <div className={cn('flex items-center justify-between mb-4', className)}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h3 className={cn('text-base font-semibold text-surface-900 dark:text-surface-100', className)}>
    {children}
  </h3>
);

const CardDescription = ({ children, className }) => (
  <p className={cn('text-sm text-surface-500 dark:text-surface-400', className)}>
    {children}
  </p>
);

const CardContent = ({ children, className }) => (
  <div className={cn(className)}>{children}</div>
);

const CardFooter = ({ children, className }) => (
  <div className={cn('flex items-center justify-end gap-3 mt-4 pt-4 border-t border-surface-100 dark:border-surface-700', className)}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
