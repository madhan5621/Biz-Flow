import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Input, Select, Textarea, Button } from '../../components/ui';
import { useCategoriesList } from '../categories/useCategories';
import { useSuppliersList } from '../suppliers/useSuppliers';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sku: z.string().min(1, 'SKU is required'),
  barcode: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  buyingPrice: z.string().min(1, 'Buying price is required').or(z.number()),
  sellingPrice: z.string().min(1, 'Selling price is required').or(z.number()),
  stock: z.string().optional().or(z.literal('')).or(z.number()),
  minStock: z.string().optional().or(z.literal('')).or(z.number()),
  categoryId: z.string().min(1, 'Category is required'),
  supplierId: z.string().optional().or(z.literal('')),
  isActive: z.string().optional().or(z.boolean()),
});

const ProductForm = ({ isOpen, onClose, onSubmit, product = null, isLoading = false }) => {
  const isEdit = !!product;
  const { data: categories = [] } = useCategoriesList();
  const { data: suppliers = [] } = useSuppliersList();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      barcode: '',
      description: '',
      buyingPrice: '',
      sellingPrice: '',
      stock: '0',
      minStock: '5',
      categoryId: '',
      supplierId: '',
      isActive: 'true',
    },
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        description: product.description || '',
        buyingPrice: product.buyingPrice ? String(Number(product.buyingPrice)) : '',
        sellingPrice: product.sellingPrice ? String(Number(product.sellingPrice)) : '',
        stock: product.stock != null ? String(product.stock) : '0',
        minStock: product.minStock != null ? String(product.minStock) : '5',
        categoryId: product.categoryId || '',
        supplierId: product.supplierId || '',
        isActive: String(product.isActive ?? true),
      });
    } else {
      reset({
        name: '',
        sku: '',
        barcode: '',
        description: '',
        buyingPrice: '',
        sellingPrice: '',
        stock: '0',
        minStock: '5',
        categoryId: '',
        supplierId: '',
        isActive: 'true',
      });
    }
  }, [product, reset]);

  const handleFormSubmit = (data) => {
    const payload = {
      name: data.name,
      sku: data.sku,
      barcode: data.barcode || null,
      description: data.description || null,
      buyingPrice: parseFloat(data.buyingPrice),
      sellingPrice: parseFloat(data.sellingPrice),
      stock: parseInt(data.stock, 10) || 0,
      minStock: parseInt(data.minStock, 10) || 5,
      categoryId: data.categoryId,
      supplierId: data.supplierId || null,
      isActive: data.isActive === 'true' || data.isActive === true,
    };

    if (isEdit) {
      payload.id = product.id;
    }

    onSubmit(payload);
  };

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));
  const supplierOptions = suppliers.map((s) => ({
    value: s.id,
    label: s.company ? `${s.name} (${s.company})` : s.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Product' : 'Add New Product'}
      description={isEdit ? 'Update product information' : 'Fill in the details to add a new product'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Row 1: Name & SKU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            placeholder="e.g. Wireless Mouse"
            error={errors.name?.message}
            required
            {...register('name')}
          />
          <Input
            label="SKU"
            placeholder="e.g. WM-001"
            error={errors.sku?.message}
            required
            {...register('sku')}
          />
        </div>

        {/* Row 2: Category & Supplier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={categoryOptions}
            error={errors.categoryId?.message}
            required
            {...register('categoryId')}
          />
          <Select
            label="Supplier"
            placeholder="Select a supplier (optional)"
            options={supplierOptions}
            error={errors.supplierId?.message}
            {...register('supplierId')}
          />
        </div>

        {/* Row 3: Buying Price & Selling Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Buying Price (₹)"
            type="number"
            placeholder="0.00"
            error={errors.buyingPrice?.message}
            required
            {...register('buyingPrice')}
          />
          <Input
            label="Selling Price (₹)"
            type="number"
            placeholder="0.00"
            error={errors.sellingPrice?.message}
            required
            {...register('sellingPrice')}
          />
        </div>

        {/* Row 4: Stock, Min Stock & Barcode */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Stock"
            type="number"
            placeholder="0"
            {...register('stock')}
          />
          <Input
            label="Min Stock (Alert)"
            type="number"
            placeholder="5"
            helperText="Alert when stock falls below"
            {...register('minStock')}
          />
          <Input
            label="Barcode"
            placeholder="Optional barcode"
            {...register('barcode')}
          />
        </div>

        {/* Row 5: Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Status"
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
            {...register('isActive')}
          />
        </div>

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Product description"
          rows={2}
          {...register('description')}
        />

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-700">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEdit ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;
