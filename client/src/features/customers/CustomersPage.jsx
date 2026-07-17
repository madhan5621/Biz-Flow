import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  UserCircle,
  Filter,
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Button, Badge, SearchInput, Select, DataTable, ConfirmDialog } from '../../components/ui';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer, useCities } from './useCustomers';
import CustomerForm from './CustomerForm';
import CustomerDetail from './CustomerDetail';
import { useToast } from '../../providers/ToastProvider';
import { useAuth } from '../../providers/AuthProvider';
import { formatCurrency, formatDate } from '../../lib/utils';

const CustomersPage = () => {
  const toast = useToast();
  const { isAdmin, isManager } = useAuth();
  const canEdit = isAdmin || isManager;

  // Query params
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [detailCustomer, setDetailCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Data fetching
  const { data, isLoading } = useCustomers({
    search, city, page, limit, sortBy, sortOrder,
  });
  const { data: cities = [] } = useCities();

  // Mutations
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const customers = data?.data || [];
  const total = data?.meta?.total || 0;

  // Handlers
  const handleSort = useCallback((key, order) => {
    setSortBy(key);
    setSortOrder(order);
  }, []);

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleCreate = async (formData) => {
    try {
      await createMutation.mutateAsync(formData);
      toast.success('Customer created successfully');
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create customer');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateMutation.mutateAsync(formData);
      toast.success('Customer updated successfully');
      setEditCustomer(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update customer');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Customer deleted successfully');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete customer');
    }
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Customer',
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-medium text-surface-900 dark:text-surface-100">{row.name}</p>
          {row.email && (
            <p className="text-xs text-surface-400 dark:text-surface-500">{row.email}</p>
          )}
        </div>
      ),
    },
    {
      key: 'company',
      label: 'Company',
      sortable: true,
      className: 'hidden md:table-cell',
      render: (val) => val || '—',
    },
    {
      key: 'city',
      label: 'City',
      sortable: true,
      className: 'hidden lg:table-cell',
      render: (val) => val || '—',
    },
    {
      key: 'totalPurchase',
      label: 'Total Purchase',
      sortable: true,
      className: 'hidden xl:table-cell',
      render: (val) => (
        <span className="font-semibold text-success-600 dark:text-success-400">
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      key: '_count',
      label: 'Invoices',
      className: 'hidden xl:table-cell',
      render: (val) => (
        <Badge variant="default" size="sm">
          {val?.invoices ?? 0}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Added',
      sortable: true,
      className: 'hidden xl:table-cell',
      render: (val) => formatDate(val),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => { e.stopPropagation(); setDetailCustomer(row); }}
            aria-label="View customer"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {canEdit && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => { e.stopPropagation(); setEditCustomer(row); }}
              aria-label="Edit customer"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => { e.stopPropagation(); setDeleteTarget(row); }}
              className="text-danger-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20"
              aria-label="Delete customer"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const cityOptions = cities.map((c) => ({ value: c, label: c }));

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-primary-500" />
            Customers
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
            Manage your customers and track their purchases
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Button size="sm" leftIcon={Plus} onClick={() => setShowForm(true)}>
              Add Customer
            </Button>
          )}
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
              placeholder="Search customers by name, email, company..."
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
            {city && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                1
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
            <div className="w-full sm:w-48">
              <Select
                placeholder="All Cities"
                options={cityOptions}
                value={city}
                onChange={(e) => { setCity(e.target.value); setPage(1); }}
              />
            </div>
            {city && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setCity(''); setPage(1); }}
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
        data={customers}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
        onRowClick={(row) => setDetailCustomer(row)}
        emptyTitle="No customers found"
        emptyDescription="Try adjusting your search or filters, or add a new customer."
        emptyIcon={UserCircle}
      />

      {/* Create Modal */}
      <CustomerForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* Edit Modal */}
      <CustomerForm
        isOpen={!!editCustomer}
        onClose={() => setEditCustomer(null)}
        onSubmit={handleUpdate}
        customer={editCustomer}
        isLoading={updateMutation.isPending}
      />

      {/* Detail Modal */}
      <CustomerDetail
        isOpen={!!detailCustomer}
        onClose={() => setDetailCustomer(null)}
        customer={detailCustomer}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </PageWrapper>
  );
};

export default CustomersPage;
