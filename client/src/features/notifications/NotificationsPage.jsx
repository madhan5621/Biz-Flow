import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Package,
  FileText,
  CreditCard,
  Info,
  Filter,
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Button, Badge, Select } from '../../components/ui';
import { Spinner } from '../../components/ui';
import { useNotifications, useMarkAsRead, useMarkAllAsRead, useDeleteNotification } from './useNotifications';
import { useToast } from '../../providers/ToastProvider';
import { timeAgo } from '../../lib/utils';

const typeIcons = {
  LOW_STOCK: AlertTriangle,
  NEW_INVOICE: FileText,
  PAYMENT_RECEIVED: CreditCard,
  NEW_ORDER: Package,
};

const typeColors = {
  LOW_STOCK: 'text-warning-500 bg-warning-50 dark:bg-warning-900/20',
  NEW_INVOICE: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20',
  PAYMENT_RECEIVED: 'text-success-500 bg-success-50 dark:bg-success-900/20',
  NEW_ORDER: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
};

const NotificationsPage = () => {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [isRead, setIsRead] = useState('');
  const limit = 20;

  const { data, isLoading } = useNotifications({ page, limit, isRead });
  const markAsReadMutation = useMarkAsRead();
  const markAllMutation = useMarkAllAsRead();
  const deleteMutation = useDeleteNotification();

  const notifications = data?.data || [];
  const total = data?.meta?.total || 0;
  const unreadCount = data?.meta?.unreadCount || 0;
  const totalPages = Math.ceil(total / limit);

  const handleMarkRead = async (id) => {
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch {
      toast.error('Failed to mark notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllMutation.mutateAsync();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const filterOptions = [
    { value: '', label: 'All' },
    { value: 'false', label: 'Unread' },
    { value: 'true', label: 'Read' },
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary-500" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="danger" size="sm">{unreadCount} unread</Badge>
            )}
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
            Stay updated with alerts and activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-32">
            <Select
              options={filterOptions}
              value={isRead}
              onChange={(e) => { setIsRead(e.target.value); setPage(1); }}
            />
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={CheckCheck}
              onClick={handleMarkAllRead}
              isLoading={markAllMutation.isPending}
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
          <p className="text-surface-500 dark:text-surface-400">
            {isRead === 'false' ? 'No unread notifications' : 'No notifications yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {notifications.map((notification) => {
              const Icon = typeIcons[notification.type] || Info;
              const colorClass = typeColors[notification.type] || 'text-surface-500 bg-surface-100 dark:bg-surface-700';

              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`card p-4 flex items-start gap-4 transition-colors ${
                    !notification.isRead
                      ? 'border-l-4 border-l-primary-500 bg-primary-50/30 dark:bg-primary-900/10'
                      : ''
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-medium ${
                          notification.isRead
                            ? 'text-surface-700 dark:text-surface-300'
                            : 'text-surface-900 dark:text-surface-100'
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-xs text-surface-400 dark:text-surface-500 whitespace-nowrap flex-shrink-0">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleMarkRead(notification.id)}
                        aria-label="Mark as read"
                      >
                        <Check className="w-4 h-4 text-success-500" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(notification.id)}
                      className="text-danger-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                      aria-label="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-surface-500 dark:text-surface-400">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default NotificationsPage;
