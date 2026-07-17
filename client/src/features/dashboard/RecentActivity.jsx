import { motion } from 'framer-motion';
import {
  LogIn,
  LogOut,
  UserPlus,
  Edit,
  Trash2,
  Plus,
  Eye,
  Activity,
} from 'lucide-react';
import { Avatar } from '../../components/ui';
import { timeAgo } from '../../lib/utils';

const actionIcons = {
  LOGIN: { icon: LogIn, color: 'text-success-500', bg: 'bg-success-50 dark:bg-success-900/20' },
  LOGOUT: { icon: LogOut, color: 'text-surface-400', bg: 'bg-surface-100 dark:bg-surface-700' },
  REGISTER: { icon: UserPlus, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
  CREATE: { icon: Plus, color: 'text-success-500', bg: 'bg-success-50 dark:bg-success-900/20' },
  UPDATE: { icon: Edit, color: 'text-warning-500', bg: 'bg-warning-50 dark:bg-warning-900/20' },
  DELETE: { icon: Trash2, color: 'text-danger-500', bg: 'bg-danger-50 dark:bg-danger-900/20' },
  VIEW: { icon: Eye, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
};

const RecentActivity = ({ data = [], isLoading }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="card p-5"
      >
        <div className="animate-pulse">
          <div className="h-5 w-36 bg-surface-200 dark:bg-surface-700 rounded mb-5" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="w-9 h-9 rounded-full bg-surface-200 dark:bg-surface-700" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-surface-200 dark:bg-surface-700 rounded w-3/4" />
                <div className="h-3 bg-surface-100 dark:bg-surface-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100">
          Recent Activity
        </h3>
        <Activity className="w-4 h-4 text-surface-400" />
      </div>

      {data.length === 0 ? (
        <div className="py-8 text-center">
          <Activity className="w-8 h-8 text-surface-300 dark:text-surface-600 mx-auto mb-2" />
          <p className="text-sm text-surface-400 dark:text-surface-500">
            No recent activity
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {data.map((activity, index) => {
            const config = actionIcons[activity.action] || actionIcons.VIEW;
            const ActionIcon = config.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="flex items-start gap-3 py-3 border-b border-surface-100 dark:border-surface-700/50 last:border-0"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                  <ActionIcon className={`w-4 h-4 ${config.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-surface-700 dark:text-surface-300 leading-snug">
                    <span className="font-medium text-surface-900 dark:text-surface-100">
                      {activity.user?.name || 'System'}
                    </span>
                    {' '}
                    <span className="text-surface-500 dark:text-surface-400">
                      {activity.details || `${activity.action.toLowerCase()} ${activity.entity.toLowerCase()}`}
                    </span>
                  </p>
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                    {timeAgo(activity.createdAt)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default RecentActivity;
