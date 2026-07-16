import { useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from './Button';
import EmptyState from './EmptyState';
import { TableSkeleton } from './Skeleton';
import { PAGINATION } from '../../lib/constants';
import { FileX2 } from 'lucide-react';

const SortIcon = ({ active, direction }) => {
  if (!active) return <ChevronsUpDown className="w-3.5 h-3.5 text-surface-400" />;
  return direction === 'asc' ? (
    <ChevronUp className="w-3.5 h-3.5 text-primary-600" />
  ) : (
    <ChevronDown className="w-3.5 h-3.5 text-primary-600" />
  );
};

/**
 * Reusable DataTable with sorting, pagination, and loading state.
 *
 * columns: [{ key, label, sortable?, render?, className? }]
 */
const DataTable = ({
  columns,
  data = [],
  isLoading = false,
  sortBy,
  sortOrder,
  onSort,
  // Pagination
  page = 1,
  limit = PAGINATION.defaultLimit,
  total = 0,
  onPageChange,
  onLimitChange,
  // Empty state
  emptyTitle = 'No data found',
  emptyDescription = 'Try adjusting your search or filters.',
  emptyIcon = FileX2,
  // Row actions
  onRowClick,
  className,
}) => {
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const handleSort = (key) => {
    if (!onSort) return;
    if (sortBy === key) {
      onSort(key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'desc');
    }
  };

  if (isLoading) {
    return (
      <div className="table-container">
        <TableSkeleton rows={limit} cols={columns.length} />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="table-container">
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
        />
      </div>
    );
  }

  return (
    <div className={cn('table-container', className)}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="table-header">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-4 py-3 text-left font-medium text-surface-600 dark:text-surface-400 whitespace-nowrap',
                    col.sortable && 'cursor-pointer select-none hover:text-surface-800 dark:hover:text-surface-200',
                    col.className
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable && (
                      <SortIcon active={sortBy === col.key} direction={sortOrder} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.id || i}
                className={cn(
                  'table-row',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-surface-700 dark:text-surface-300',
                      col.className
                    )}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-surface-200 dark:border-surface-700">
          <div className="flex items-center gap-2 text-sm text-surface-500">
            <span>Showing</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
              className="px-2 py-1 border border-surface-300 dark:border-surface-600 rounded-md bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-sm"
            >
              {PAGINATION.limitOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span>
              of <strong className="text-surface-700 dark:text-surface-200">{total}</strong> results
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? 'primary' : 'ghost'}
                  size="icon-sm"
                  onClick={() => onPageChange?.(pageNum)}
                  className="w-8 h-8 text-xs"
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon-sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
