import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Package,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Button, Badge, SearchInput, Select, DataTable, ConfirmDialog } from '../../components/ui';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from './useProducts';
import { useCategoriesList } from '../categories/useCategories';
import { useSuppliersList } from '../suppliers/useSuppliers';
import ProductForm from './ProductForm';
import ProductDetail from './ProductDetail';
import { useToast } from '../../providers/ToastProvider';
import { useAuth } from '../../providers/AuthProvider';
import { formatCurrency } from '../../lib/utils';

const ProductsPage = () => {
  const toast = useToast();
  const { isAdmin, isManager } = useAuth();
  const canEdit = isAdmin || isManager;

  // Query params
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [isActive, setIsActive] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Data fetching
  const { data, isLoading } = useProducts({
    search, categoryId, supplierId, isActive, page, limit, sortBy, sortOrder,
  });
  const { data: categories = [] } = useCategoriesList();
  const { data: suppliers = [] } = useSuppliersList();

  // Mutations
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const products = data?.data || [];
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
      toast.success('Product created successfully');
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateMutation.mutateAsync(formData);
      toast.success('Product updated successfully');
      setEditProduct(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Product deleted successfully');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Product',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {row.image ? (
              <img src={row.image} alt={row.name} className="w-9 h-9 rounded-lg object-cover" />
            ) : (
              <Package className="w-4 h-4 text-surface-400" />
            )}
          </div>
          <div>
            <p className="font-medium text-surface-900 dark:text-surface-100">{row.name}</p>
            <p className="text-xs text-surface-400 dark:text-surface-500">SKU: {row.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      className: 'hidden md:table-cell',
      render: (val) => val?.name || '—',
    },
    {
      key: 'sellingPrice',
      label: 'Price',
      sortable: true,
      className: 'hidden md:table-cell',
      render: (val) => (
        <span className="font-semibold text-surface-900 dark:text-surface-100">
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (val, row) => {
        const isLow = val <= (row.minStock || 5);
        return (
          <div className="flex items-center gap-1.5">
            <span className={isLow ? 'font-semibold text-danger-600 dark:text-danger-400' : 'text-surface-900 dark:text-surface-100'}>
              {val}
            </span>
            {isLow && <AlertTriangle className="w-3.5 h-3.5 text-danger-500" />}
          </div>
        );
      },
    },
    {
      key: 'isActive',
      label: 'Status',
      className: 'hidden lg:table-cell',
      render: (val) => (
        <Badge variant={val ? 'success' : 'default'} size="sm" dot>
          {val ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'supplier',
      label: 'Supplier',
      className: 'hidden xl:table-cell',
      render: (val) => val?.name || val?.company || '—',
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => { e.stopPropagation(); setDetailProduct(row); }}
            aria-label="View product"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {canEdit && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => { e.stopPropagation(); setEditProduct(row); }}
              aria-label="Edit product"
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
              aria-label="Delete product"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));
  const supplierOptions = suppliers.map((s) => ({ value: s.id, label: s.name || s.company }));
  const activeFilterCount = [categoryId, supplierId, isActive].filter(Boolean).length;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <Package className="w-6 h-6 text-primary-500" />
            Products
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
            Manage your product catalog and inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEdit && (
            <Button size="sm" leftIcon={Plus} onClick={() => setShowForm(true)}>
              Add Product
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
              placeholder="Search products by name, SKU, barcode..."
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
            <div className="w-full sm:w-48">
              <Select
                placeholder="All Categories"
                options={categoryOptions}
                value={categoryId}
                onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                placeholder="All Suppliers"
                options={supplierOptions}
                value={supplierId}
                onChange={(e) => { setSupplierId(e.target.value); setPage(1); }}
              />
            </div>
            <div className="w-full sm:w-36">
              <Select
                placeholder="All Status"
                options={[{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]}
                value={isActive}
                onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
              />
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setCategoryId(''); setSupplierId(''); setIsActive(''); setPage(1); }}
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
        data={products}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
        onRowClick={(row) => setDetailProduct(row)}
        emptyTitle="No products found"
        emptyDescription="Try adjusting your search or filters, or add a new product."
        emptyIcon={Package}
      />

      {/* Create Modal */}
      <ProductForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* Edit Modal */}
      <ProductForm
        isOpen={!!editProduct}
        onClose={() => setEditProduct(null)}
        onSubmit={handleUpdate}
        product={editProduct}
        isLoading={updateMutation.isPending}
      />

      {/* Detail Modal */}
      <ProductDetail
        isOpen={!!detailProduct}
        onClose={() => setDetailProduct(null)}
        product={detailProduct}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </PageWrapper>
  );
};

export default ProductsPage;
