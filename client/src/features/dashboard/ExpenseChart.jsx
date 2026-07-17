import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { formatCurrency } from '../../lib/utils';

const COLORS = [
  '#3b82f6', // primary blue
  '#f59e0b', // warning amber
  '#ef4444', // danger red
  '#22c55e', // success green
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ec4899', // pink
  '#14b8a6', // teal
  '#6366f1', // indigo
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0];

  return (
    <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-soft-lg p-3 text-sm">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: entry.payload.fill }}
        />
        <span className="font-medium text-surface-900 dark:text-surface-100">
          {entry.name}
        </span>
      </div>
      <p className="text-surface-500 dark:text-surface-400 mt-1">
        {formatCurrency(entry.value)}
      </p>
    </div>
  );
};

const ExpenseChart = ({ data = [], isLoading }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="card p-5"
      >
        <div className="animate-pulse">
          <div className="h-5 w-40 bg-surface-200 dark:bg-surface-700 rounded mb-6" />
          <div className="h-[250px] flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-surface-100 dark:bg-surface-800" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="card p-5"
    >
      <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-1">
        Expense Breakdown
      </h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
        By category
      </p>

      {data.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-sm text-surface-400 dark:text-surface-500">No expense data</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                paddingAngle={3}
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {/* Center label */}
              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-surface-900 dark:fill-surface-100 text-lg font-bold"
              >
                {formatCurrency(total)}
              </text>
              <text
                x="50%"
                y="57%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-surface-400 dark:fill-surface-500 text-xs"
              >
                Total
              </text>
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-3 space-y-2">
            {data.map((item, i) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
              return (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-surface-600 dark:text-surface-300 truncate">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-surface-400 dark:text-surface-500 text-xs">
                      {pct}%
                    </span>
                    <span className="font-medium text-surface-900 dark:text-surface-100 w-24 text-right">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ExpenseChart;
