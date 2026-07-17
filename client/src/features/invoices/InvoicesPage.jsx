import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  Filter,
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Button, Badge, SearchInput, Select, DataTable, ConfirmDialog } from '../../components/ui';
import { useInvoices, useCreateInvoice, useUpdateInvoice, useDeleteInvoice } from './useInvoices';
import InvoiceForm from './InvoiceForm';
import InvoiceDetail from './InvoiceDetail';
import { useToast } from '../../providers/ToastProvider';
import { useAuth } from '../../providers/AuthProvider';
import { formatCurrency, formatDate } from '../../lib/utils';
import { INVOICE_STATUS } from '../../lib/constants';

const statusVariants = {
  PAID: 'success',
  PENDING: 'warning',
  CANCELLED: 'danger',
};

const InvoicesPage = () => {
  const toast = useToast();
  const { isAdmin, isManager } = useAuth();
  const canEdit = isAdmin || isManager;

  // Query params
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [detailInvoice, setDetailInvoice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Data fetching
  const { data, isLoading } = useInvoices({
    search, status, page, limit, sortBy, sortOrder,
  });

  // Mutations
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();
  const deleteMutation = useDeleteInvoice();

  const invoices = data?.data || [];
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
      toast.success('Invoice created successfully');
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create invoice');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateMutation.mutateAsync(formData);
      toast.success('Invoice updated successfully');
      setEditInvoice(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update invoice');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Invoice deleted successfully');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete invoice');
    }
  };

  // Table columns
  const columns = [
    {
      key: 'invoiceNumber',
      label: 'Invoice',
      sortable: true,
      render: (_, row) => (
        <div>
          <p className="font-medium text-surface-900 dark:text-surface-100">{row.invoiceNumber}</p>
          <p className="text-xs text-surface-400 dark:text-surface-500">
            {row.customer?.name}
          </p>
        </div>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      className: 'hidden md:table-cell',
      render: (_, row) => (
        <div>
          <p className="text-sm text-surface-900 dark:text-surface-100">{row.customer?.name}</p>
          {row.customer?.company && (
            <p className="text-xs text-surface-400 dark:text-surface-500">{row.customer.company}</p>
          )}
        </div>
      ),
    },
    {
      key: 'invoiceDate',
      label: 'Date',
      sortable: true,
      className: 'hidden lg:table-cell',
      render: (val) => formatDate(val),
    },
    {
      key: 'grandTotal',
      label: 'Amount',
      sortable: true,
      render: (val) => (
        <span className="font-semibold text-surface-900 dark:text-surface-100">
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <Badge variant={statusVariants[val]} size="sm">
          {val}
        </Badge>
      ),
    },
    {
      key: '_count',
      label: 'Items',
      className: 'hidden xl:table-cell',
      render: (val) => (
        <Badge variant="default" size="sm">
          {val?.items ?? 0}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => { e.stopPropagation(); setDetailInvoice(row); }}
            aria-label="View invoice"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {canEdit && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => { e.stopPropagation(); setEditInvoice(row); }}
              aria-label="Edit invoice"
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
              aria-label="Delete invoice"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const statusOptions = Object.entries(INVOICE_STATUS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary-500" />
            Invoices
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
            Create and manage invoices for your customers
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Button size="sm" leftIcon={Plus} onClick={() => setShowForm(true)}>
              New Invoice
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
              placeholder="Search by invoice number, customer..."
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
            {status && (
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
                placeholder="All Statuses"
                options={statusOptions}
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              />
            </div>
            {status && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setStatus(''); setPage(1); }}
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
        data={invoices}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
        onRowClick={(row) => setDetailInvoice(row)}
        emptyTitle="No invoices found"
        emptyDescription="Try adjusting your search or filters, or create a new invoice."
        emptyIcon={FileText}
      />

      {/* Create Modal */}
      <InvoiceForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* Edit Modal */}
      <InvoiceForm
        isOpen={!!editInvoice}
        onClose={() => setEditInvoice(null)}
        onSubmit={handleUpdate}
        invoice={editInvoice}
        isLoading={updateMutation.isPending}
      />

      {/* Detail Modal */}
      <InvoiceDetail
        isOpen={!!detailInvoice}
        onClose={() => setDetailInvoice(null)}
        invoice={detailInvoice}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message={`Are you sure you want to delete "${deleteTarget?.invoiceNumber}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </PageWrapper>
  );
};

export default InvoicesPage;
