import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Truck,
  Filter,
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Button, Badge, SearchInput, Select, DataTable, ConfirmDialog } from '../../components/ui';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier } from './useSuppliers';
import SupplierForm from './SupplierForm';
import SupplierDetail from './SupplierDetail';
import { useToast } from '../../providers/ToastProvider';
import { useAuth } from '../../providers/AuthProvider';
import { formatDate } from '../../lib/utils';

const SuppliersPage = () => {
  const toast = useToast();
  const { isAdmin, isManager } = useAuth();
  const canEdit = isAdmin || isManager;

  // Query params
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [detailSupplier, setDetailSupplier] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Data fetching
  const { data, isLoading } = useSuppliers({
    search, page, limit, sortBy, sortOrder,
  });

  // Mutations
  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();

  const suppliers = data?.data || [];
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
      toast.success('Supplier created successfully');
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create supplier');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateMutation.mutateAsync(formData);
      toast.success('Supplier updated successfully');
      setEditSupplier(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update supplier');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Supplier deleted successfully');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete supplier');
    }
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Supplier',
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
      key: 'phone',
      label: 'Phone',
      className: 'hidden xl:table-cell',
      render: (val) => val || '—',
    },
    {
      key: '_count',
      label: 'Products',
      className: 'hidden lg:table-cell',
      render: (val) => (
        <Badge variant="default" size="sm">
          {val?.products ?? 0}
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
            onClick={(e) => { e.stopPropagation(); setDetailSupplier(row); }}
            aria-label="View supplier"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {canEdit && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => { e.stopPropagation(); setEditSupplier(row); }}
              aria-label="Edit supplier"
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
              aria-label="Delete supplier"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary-500" />
            Suppliers
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
            Manage your supplier directory and product associations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Button size="sm" leftIcon={Plus} onClick={() => setShowForm(true)}>
              Add Supplier
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-5"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <SearchInput
              placeholder="Search suppliers by name, email, company, city..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
      </motion.div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={suppliers}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
        onRowClick={(row) => setDetailSupplier(row)}
        emptyTitle="No suppliers found"
        emptyDescription="Try adjusting your search, or add a new supplier."
        emptyIcon={Truck}
      />

      {/* Create Modal */}
      <SupplierForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* Edit Modal */}
      <SupplierForm
        isOpen={!!editSupplier}
        onClose={() => setEditSupplier(null)}
        onSubmit={handleUpdate}
        supplier={editSupplier}
        isLoading={updateMutation.isPending}
      />

      {/* Detail Modal */}
      <SupplierDetail
        isOpen={!!detailSupplier}
        onClose={() => setDetailSupplier(null)}
        supplier={detailSupplier}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </PageWrapper>
  );
};

export default SuppliersPage;
