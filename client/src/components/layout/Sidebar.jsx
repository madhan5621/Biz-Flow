import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Package,
  FolderOpen,
  Truck,
  FileText,
  Receipt,
  BarChart3,
  Bell,
  Activity,
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../providers/AuthProvider';
import Avatar from '../ui/Avatar';
import { APP_NAME } from '../../lib/constants';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Employees', icon: Users, path: '/employees' },
  { label: 'Customers', icon: UserCircle, path: '/customers' },
  { label: 'Products', icon: Package, path: '/products' },
  { label: 'Categories', icon: FolderOpen, path: '/categories' },
  { label: 'Suppliers', icon: Truck, path: '/suppliers' },
  { label: 'Invoices', icon: FileText, path: '/invoices' },
  { label: 'Expenses', icon: Receipt, path: '/expenses' },
  { label: 'Reports', icon: BarChart3, path: '/reports' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Activity Logs', icon: Activity, path: '/activity-logs' },
  { label: 'Settings', icon: Settings, path: '/settings' },
  { label: 'Profile', icon: Building2, path: '/profile' },
];

const Sidebar = ({ isOpen, onToggle, isMobile, onMobileClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-surface-200 dark:border-surface-700',
        isOpen ? 'justify-between' : 'justify-center'
      )}>
        {isOpen && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <LayoutDashboard className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-surface-900 dark:text-white tracking-tight">
              {APP_NAME}
            </span>
          </div>
        )}
        {!isOpen && !isMobile && (
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <LayoutDashboard className="w-4.5 h-4.5 text-white" />
          </div>
        )}
        {isMobile && (
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:text-surface-300 dark:hover:bg-surface-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 scrollbar-hide">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={isMobile ? onMobileClose : undefined}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                    'transition-all duration-150',
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200',
                    !isOpen && !isMobile && 'justify-center px-2'
                  )}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary-600 dark:text-primary-400')} />
                  {(isOpen || isMobile) && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-surface-200 dark:border-surface-700 p-3">
        {isOpen || isMobile ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar name={user?.name} src={user?.avatar} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-surface-500 truncate">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={logout}
              className="p-2 rounded-lg text-surface-400 hover:text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Collapse Toggle (desktop only) */}
      {!isMobile && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 shadow-sm flex items-center justify-center text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors z-10"
        >
          {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );

  // Mobile overlay sidebar
  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 z-50 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        'relative h-screen bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700',
        'transition-all duration-300 ease-in-out hidden lg:block shrink-0',
        isOpen ? 'w-[260px]' : 'w-[72px]'
      )}
    >
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;
