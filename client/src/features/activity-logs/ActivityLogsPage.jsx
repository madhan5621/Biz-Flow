import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Filter,
  User,
  Plus,
  Edit,
  Trash2,
  LogIn,
  Eye,
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Button, Badge, SearchInput, Select, DataTable } from '../../components/ui';
import { useActivityLogs, useLogActions, useLogEntities } from './useActivityLogs';
import { formatDate, timeAgo, getInitials, getAvatarColor } from '../../lib/utils';

const actionIcons = {
  CREATE: Plus,
  UPDATE: Edit,
  DELETE: Trash2,
  LOGIN: LogIn,
  VIEW: Eye,
};

const actionVariants = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'danger',
  LOGIN: 'default',
  VIEW: 'default',
};

const ActivityLogsPage = () => {
  // Query params
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [entity, setEntity] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // UI
  const [showFilters, setShowFilters] = useState(false);

  // Data
  const { data, isLoading } = useActivityLogs({ search, action, entity, page, limit });
  const { data: actions = [] } = useLogActions();
  const { data: entities = [] } = useLogEntities();

  const logs = data?.data || [];
  const total = data?.meta?.total || 0;

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const actionOptions = actions.map((a) => ({ value: a, label: a }));
  const entityOptions = entities.map((e) => ({ value: e, label: e }));

  const activeFilterCount = [action, entity].filter(Boolean).length;

  // Table columns
  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getAvatarColor(
              row.user?.name
            )}`}
          >
            {getInitials(row.user?.name)}
          </div>
          <div>
            <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
              {row.user?.name || '—'}
            </p>
            <p className="text-xs text-surface-400 dark:text-surface-500">
              {row.user?.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (val) => {
        const Icon = actionIcons[val] || Activity;
        return (
          <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 text-surface-400" />
            <Badge variant={actionVariants[val] || 'default'} size="sm">
              {val}
            </Badge>
          </div>
        );
      },
    },
    {
      key: 'entity',
      label: 'Entity',
      className: 'hidden md:table-cell',
      render: (val) => (
        <Badge variant="default" size="sm">{val}</Badge>
      ),
    },
    {
      key: 'details',
      label: 'Details',
      className: 'hidden lg:table-cell',
      render: (val) => (
        <p className="text-sm text-surface-600 dark:text-surface-400 truncate max-w-[250px]">
          {val || '—'}
        </p>
      ),
    },
    {
      key: 'createdAt',
      label: 'When',
      render: (val) => (
        <div>
          <p className="text-sm text-surface-900 dark:text-surface-100">{timeAgo(val)}</p>
          <p className="text-xs text-surface-400 dark:text-surface-500">{formatDate(val)}</p>
        </div>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP',
      className: 'hidden xl:table-cell',
      render: (val) => (
        <span className="text-xs text-surface-400 dark:text-surface-500 font-mono">
          {val || '—'}
        </span>
      ),
    },
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary-500" />
            Activity Logs
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
            Track all system actions and user activity
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-5"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <SearchInput
              placeholder="Search by action, entity, user, details..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          <Button
            variant={showFilters ? 'secondary' : 'outline'}
            size="md"
            leftIcon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col sm:flex-row gap-3 mt-3 pt-3 border-t border-surface-200 dark:border-surface-700"
          >
            <div className="w-full sm:w-40">
              <Select
                placeholder="All Actions"
                options={actionOptions}
                value={action}
                onChange={(e) => { setAction(e.target.value); setPage(1); }}
              />
            </div>
            <div className="w-full sm:w-40">
              <Select
                placeholder="All Entities"
                options={entityOptions}
                value={entity}
                onChange={(e) => { setEntity(e.target.value); setPage(1); }}
              />
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setAction(''); setEntity(''); setPage(1); }}
              >
                Clear filters
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={logs}
        isLoading={isLoading}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
        emptyTitle="No activity logs found"
        emptyDescription="Try adjusting your search or filters."
        emptyIcon={Activity}
      />
    </PageWrapper>
  );
};

export default ActivityLogsPage;
