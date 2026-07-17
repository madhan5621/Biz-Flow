import { motion } from 'framer-motion';
import { Package, TrendingUp } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../lib/utils';

const TopProducts = ({ data = [], isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="card p-5"
      >
        <div className="animate-pulse">
          <div className="h-5 w-40 bg-surface-200 dark:bg-surface-700 rounded mb-5" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="w-10 h-10 rounded-lg bg-surface-200 dark:bg-surface-700" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-surface-200 dark:bg-surface-700 rounded w-2/3" />
                <div className="h-3 bg-surface-100 dark:bg-surface-800 rounded w-1/3" />
              </div>
              <div className="h-4 w-16 bg-surface-200 dark:bg-surface-700 rounded" />
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  const maxSold = Math.max(...data.map((p) => p.totalSold || 0), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100">
          Top Products
        </h3>
        <TrendingUp className="w-4 h-4 text-surface-400" />
      </div>

      {data.length === 0 ? (
        <div className="py-8 text-center">
          <Package className="w-8 h-8 text-surface-300 dark:text-surface-600 mx-auto mb-2" />
          <p className="text-sm text-surface-400 dark:text-surface-500">
            No product data yet
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {data.map((product, index) => {
            const barWidth = ((product.totalSold || 0) / maxSold) * 100;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="py-3 border-b border-surface-100 dark:border-surface-700/50 last:border-0"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-sm font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-surface-400 dark:text-surface-500">
                        {product.sku} · Stock: {formatNumber(product.stock)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                      {formatCurrency(product.totalRevenue)}
                    </p>
                    <p className="text-xs text-surface-400 dark:text-surface-500">
                      {formatNumber(product.totalSold)} sold
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="ml-11 h-1.5 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.8, delay: 0.1 * index, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default TopProducts;
