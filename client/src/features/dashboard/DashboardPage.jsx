import PageWrapper from '../../components/layout/PageWrapper';
import { useAuth } from '../../providers/AuthProvider';
import { useDashboardStats, useRevenueChart, useExpenseChart, useRecentActivities, useTopProducts } from './useDashboard';
import StatCard from './StatCard';
import RevenueChart from './RevenueChart';
import ExpenseChart from './ExpenseChart';
import RecentActivity from './RecentActivity';
import TopProducts from './TopProducts';
import QuickActions from './QuickActions';

const DashboardPage = () => {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueChart();
  const { data: expenseData, isLoading: expenseLoading } = useExpenseChart();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities(8);
  const { data: topProducts, isLoading: productsLoading } = useTopProducts(5);

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
        </h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">
          Here's what's happening with your business today.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Revenue"
          value={stats?.revenue || 0}
          type="revenue"
          isCurrency
          subtitle={`${stats?.totalInvoices || 0} invoices total`}
          index={0}
        />
        <StatCard
          title="Total Expenses"
          value={stats?.expenses || 0}
          type="expenses"
          isCurrency
          index={1}
        />
        <StatCard
          title="Net Profit"
          value={stats?.profit || 0}
          type="profit"
          isCurrency
          subtitle={stats?.profitMargin ? `${stats.profitMargin}% margin` : undefined}
          index={2}
        />
        <StatCard
          title="Customers"
          value={stats?.totalCustomers || 0}
          type="customers"
          index={3}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Active Products"
          value={stats?.totalProducts || 0}
          type="products"
          subtitle={stats?.lowStockCount ? `${stats.lowStockCount} low stock` : undefined}
          index={4}
        />
        <StatCard
          title="Active Employees"
          value={stats?.totalEmployees || 0}
          type="invoices"
          index={5}
        />
        <StatCard
          title="Pending Invoices"
          value={stats?.pendingInvoices || 0}
          type="lowStock"
          subtitle="Awaiting payment"
          index={6}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData || []} isLoading={revenueLoading} />
        </div>
        <ExpenseChart data={expenseData || []} isLoading={expenseLoading} />
      </div>

      {/* Bottom Row — Activity, Top Products, Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentActivity data={activities || []} isLoading={activitiesLoading} />
        <TopProducts data={topProducts || []} isLoading={productsLoading} />
        <QuickActions />
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;
