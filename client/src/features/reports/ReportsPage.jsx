import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Download,
  AlertTriangle,
  Receipt,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import PageWrapper from '../../components/layout/PageWrapper';
import { Button, Badge, Select } from '../../components/ui';
import { Spinner } from '../../components/ui';
import { useRevenueReport, useExpenseReport, useProductReport, useExportCSV } from './useReports';
import { useToast } from '../../providers/ToastProvider';
import { formatCurrency, formatNumber } from '../../lib/utils';

const PIE_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#a855f7',
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const ReportsPage = () => {
  const toast = useToast();
  const [months, setMonths] = useState(12);
  const { exportReport } = useExportCSV();

  const { data: revenueData, isLoading: revenueLoading } = useRevenueReport(months);
  const { data: expenseData, isLoading: expenseLoading } = useExpenseReport();
  const { data: productData, isLoading: productLoading } = useProductReport();

  const handleExport = async (type) => {
    try {
      await exportReport(type);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report exported`);
    } catch {
      toast.error('Failed to export report');
    }
  };

  const monthsOptions = [
    { value: '6', label: 'Last 6 months' },
    { value: '12', label: 'Last 12 months' },
  ];

  const isLoading = revenueLoading || expenseLoading || productLoading;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary-500" />
            Reports
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
            Revenue analytics, expense breakdowns, and product performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-40">
            <Select
              options={monthsOptions}
              value={String(months)}
              onChange={(e) => setMonths(Number(e.target.value))}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={Download}
            onClick={() => handleExport('revenue')}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Revenue',
                value: formatCurrency(revenueData?.totals?.revenue || 0),
                icon: TrendingUp,
                color: 'text-success-600 dark:text-success-400',
                bg: 'bg-success-50 dark:bg-success-900/20',
              },
              {
                label: 'Total Expenses',
                value: formatCurrency(revenueData?.totals?.expenses || 0),
                icon: TrendingDown,
                color: 'text-danger-600 dark:text-danger-400',
                bg: 'bg-danger-50 dark:bg-danger-900/20',
              },
              {
                label: 'Net Profit',
                value: formatCurrency(revenueData?.totals?.profit || 0),
                icon: DollarSign,
                color: (revenueData?.totals?.profit || 0) >= 0
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-danger-600 dark:text-danger-400',
                bg: (revenueData?.totals?.profit || 0) >= 0
                  ? 'bg-primary-50 dark:bg-primary-900/20'
                  : 'bg-danger-50 dark:bg-danger-900/20',
              },
              {
                label: 'Stock Value',
                value: formatCurrency(productData?.totalStockValue || 0),
                icon: Package,
                color: 'text-purple-600 dark:text-purple-400',
                bg: 'bg-purple-50 dark:bg-purple-900/20',
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="card p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-surface-500 dark:text-surface-400">{stat.label}</span>
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  Revenue vs Expenses
                </h2>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Monthly comparison for the last {months} months
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={Download}
                onClick={() => handleExport('revenue')}
              >
                CSV
              </Button>
            </div>

            {revenueData?.data?.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueData.data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-surface-200 dark:stroke-surface-700" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12 }}
                    className="fill-surface-500 dark:fill-surface-400"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    className="fill-surface-500 dark:fill-surface-400"
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: '0.75rem',
                      border: 'none',
                      boxShadow: '0 4px 20px rgba(0,0,0,.15)',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
                  <Bar dataKey="profit" fill="#6366f1" radius={[4, 4, 0, 0]} name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-surface-400 dark:text-surface-500">
                <BarChart3 className="w-12 h-12 mb-3" />
                <p>No revenue data available for this period</p>
              </div>
            )}
          </motion.div>

          {/* Row: Expense Breakdown & Product Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    Expense Breakdown
                  </h2>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    By category — Total: {formatCurrency(expenseData?.total || 0)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={Download}
                  onClick={() => handleExport('expenses')}
                >
                  CSV
                </Button>
              </div>

              {expenseData?.data?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseData.data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={2}
                      label={({ name, percent }) =>
                        `${name} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {expenseData.data.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-surface-400 dark:text-surface-500">
                  <Receipt className="w-12 h-12 mb-3" />
                  <p>No expense data available</p>
                </div>
              )}
            </motion.div>

            {/* Top Selling Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                    Top Selling Products
                  </h2>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    {formatNumber(productData?.totalProducts || 0)} active products
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={Download}
                  onClick={() => handleExport('products')}
                >
                  CSV
                </Button>
              </div>

              {productData?.topSellers?.length > 0 ? (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {productData.topSellers.map((product, i) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-surface-50 dark:bg-surface-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                            {product.name}
                          </p>
                          <p className="text-xs text-surface-400 dark:text-surface-500">
                            {product.sku} · Stock: {product.stock}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                          {formatCurrency(product.totalRevenue)}
                        </p>
                        <p className="text-xs text-surface-400 dark:text-surface-500">
                          {product.totalSold} sold
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-surface-400 dark:text-surface-500">
                  <Package className="w-12 h-12 mb-3" />
                  <p>No product data available</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Low Stock Alert */}
          {productData?.lowStock?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="card p-6 border-l-4 border-l-warning-500"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-warning-500" />
                <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                  Low Stock Alert
                </h2>
                <Badge variant="warning" size="sm">{productData.lowStock.length}</Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-200 dark:border-surface-700">
                      <th className="text-left py-2 px-3 text-xs font-medium text-surface-500 dark:text-surface-400">Product</th>
                      <th className="text-left py-2 px-3 text-xs font-medium text-surface-500 dark:text-surface-400">SKU</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-surface-500 dark:text-surface-400">Stock</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-surface-500 dark:text-surface-400">Min Stock</th>
                      <th className="text-right py-2 px-3 text-xs font-medium text-surface-500 dark:text-surface-400">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.lowStock.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-surface-100 dark:border-surface-800"
                      >
                        <td className="py-2.5 px-3 font-medium text-surface-900 dark:text-surface-100">
                          {product.name}
                        </td>
                        <td className="py-2.5 px-3 text-surface-500 dark:text-surface-400">
                          {product.sku}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Badge
                            variant={product.stock === 0 ? 'danger' : 'warning'}
                            size="sm"
                          >
                            {product.stock}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right text-surface-500 dark:text-surface-400">
                          {product.minStock}
                        </td>
                        <td className="py-2.5 px-3 text-right text-surface-900 dark:text-surface-100">
                          {formatCurrency(product.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default ReportsPage;
