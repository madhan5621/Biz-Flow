import { forwardRef, useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const SearchInput = forwardRef(
  ({ value, onChange, placeholder = 'Search...', className, onClear, ...props }, ref) => {
    const [localValue, setLocalValue] = useState(value || '');

    const handleChange = useCallback(
      (e) => {
        setLocalValue(e.target.value);
        onChange?.(e.target.value);
      },
      [onChange]
    );

    const handleClear = useCallback(() => {
      setLocalValue('');
      onChange?.('');
      onClear?.();
    }, [onChange, onClear]);

    const displayValue = value !== undefined ? value : localValue;

    return (
      <div className={cn('relative', className)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          ref={ref}
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="input-base pl-10 pr-9"
          {...props}
        />
        {displayValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
export default SearchInput;
