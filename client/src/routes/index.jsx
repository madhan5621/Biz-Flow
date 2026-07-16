import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './guards';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import PublicLayout from '../components/layout/PublicLayout';
import NotFound from '../components/layout/NotFound';
import ErrorBoundary from '../components/layout/ErrorBoundary';
import { PageSpinner } from '../components/ui/Spinner';

// ─── Lazy-loaded Pages ──────────────────────────────────────────────────────
// Auth
const Login = lazy(() => import('../features/auth/LoginPage'));
const Register = lazy(() => import('../features/auth/RegisterPage'));
const ForgotPassword = lazy(() => import('../features/auth/ForgotPasswordPage'));
const ResetPassword = lazy(() => import('../features/auth/ResetPasswordPage'));

// App
const Dashboard = lazy(() => import('../features/dashboard/DashboardPage'));
const Employees = lazy(() => import('../features/employees/EmployeesPage'));
const Customers = lazy(() => import('../features/customers/CustomersPage'));
const Products = lazy(() => import('../features/products/ProductsPage'));
const Categories = lazy(() => import('../features/categories/CategoriesPage'));
const Suppliers = lazy(() => import('../features/suppliers/SuppliersPage'));
const Invoices = lazy(() => import('../features/invoices/InvoicesPage'));
const Expenses = lazy(() => import('../features/expenses/ExpensesPage'));
const Reports = lazy(() => import('../features/reports/ReportsPage'));
const Notifications = lazy(() => import('../features/notifications/NotificationsPage'));
const ActivityLogs = lazy(() => import('../features/activity-logs/ActivityLogsPage'));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage'));
const ProfilePage = lazy(() => import('../features/profile/ProfilePage'));

// ─── Suspense Wrapper ───────────────────────────────────────────────────────
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<PageSpinner />}>{children}</Suspense>
);

// ─── Router ─────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  // Public (Auth) Routes
  {
    element: (
      <PublicRoute>
        <PublicLayout />
      </PublicRoute>
    ),
    children: [
      { path: '/login', element: <SuspenseWrapper><Login /></SuspenseWrapper> },
      { path: '/register', element: <SuspenseWrapper><Register /></SuspenseWrapper> },
      { path: '/forgot-password', element: <SuspenseWrapper><ForgotPassword /></SuspenseWrapper> },
      { path: '/reset-password', element: <SuspenseWrapper><ResetPassword /></SuspenseWrapper> },
    ],
  },

  // Protected Routes
  {
    element: (
      <ProtectedRoute>
        <ErrorBoundary>
          <ProtectedLayout />
        </ErrorBoundary>
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <SuspenseWrapper><Dashboard /></SuspenseWrapper> },
      { path: '/employees', element: <SuspenseWrapper><Employees /></SuspenseWrapper> },
      { path: '/customers', element: <SuspenseWrapper><Customers /></SuspenseWrapper> },
      { path: '/products', element: <SuspenseWrapper><Products /></SuspenseWrapper> },
      { path: '/categories', element: <SuspenseWrapper><Categories /></SuspenseWrapper> },
      { path: '/suppliers', element: <SuspenseWrapper><Suppliers /></SuspenseWrapper> },
      { path: '/invoices', element: <SuspenseWrapper><Invoices /></SuspenseWrapper> },
      { path: '/expenses', element: <SuspenseWrapper><Expenses /></SuspenseWrapper> },
      { path: '/reports', element: <SuspenseWrapper><Reports /></SuspenseWrapper> },
      { path: '/notifications', element: <SuspenseWrapper><Notifications /></SuspenseWrapper> },
      { path: '/activity-logs', element: <SuspenseWrapper><ActivityLogs /></SuspenseWrapper> },
      { path: '/settings', element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
      { path: '/profile', element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper> },
    ],
  },

  // Redirects
  { path: '/', element: <Navigate to="/dashboard" replace /> },

  // 404
  { path: '*', element: <NotFound /> },
]);

export default router;
