import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Input, Select, Textarea, Button } from '../../components/ui';
import { useCustomers } from '../customers/useCustomers';
import { useProductsList } from '../products/useProducts';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { INVOICE_STATUS } from '../../lib/constants';

const invoiceItemSchema = z.object({
  productId: z.string().min(1, 'Select a product'),
  quantity: z.coerce.number().int().min(1, 'Min 1'),
  price: z.coerce.number().min(0, 'Invalid price'),
  discount: z.coerce.number().min(0).optional().default(0),
});

const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  invoiceDate: z.string().optional(),
  dueDate: z.string().optional().or(z.literal('')),
  taxRate: z.coerce.number().min(0).max(100).optional().default(0),
  discount: z.coerce.number().min(0).optional().default(0),
  status: z.enum(['PAID', 'PENDING', 'CANCELLED']).optional().default('PENDING'),
  notes: z.string().max(1000).optional().or(z.literal('')),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
});

const InvoiceForm = ({ isOpen, onClose, onSubmit, invoice = null, isLoading = false }) => {
  const isEdit = !!invoice;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerId: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      taxRate: 0,
      discount: 0,
      status: 'PENDING',
      notes: '',
      items: [{ productId: '', quantity: 1, price: 0, discount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  // Fetch customers and products for dropdowns
  const { data: customersData } = useCustomers({ limit: 200 });
  const { data: products = [] } = useProductsList();

  const customers = customersData?.data || [];
  const watchedItems = watch('items');
  const watchedTaxRate = watch('taxRate') || 0;
  const watchedDiscount = watch('discount') || 0;

  // Calculate totals
  const subtotal = (watchedItems || []).reduce((sum, item) => {
    const lineTotal = (Number(item.quantity) || 0) * (Number(item.price) || 0) - (Number(item.discount) || 0);
    return sum + Math.max(lineTotal, 0);
  }, 0);
  const taxAmount = subtotal * (Number(watchedTaxRate) / 100);
  const grandTotal = subtotal + taxAmount - Number(watchedDiscount);

  // Auto-fill price when product is selected
  const handleProductChange = useCallback(
    (index, productId) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setValue(`items.${index}.price`, Number(product.sellingPrice));
      }
    },
    [products, setValue]
  );

  // Reset form when invoice changes
  useEffect(() => {
    if (invoice) {
      reset({
        customerId: invoice.customerId || '',
        invoiceDate: invoice.invoiceDate
          ? new Date(invoice.invoiceDate).toISOString().split('T')[0]
          : '',
        dueDate: invoice.dueDate
          ? new Date(invoice.dueDate).toISOString().split('T')[0]
          : '',
        taxRate: Number(invoice.taxRate) || 0,
        discount: Number(invoice.discount) || 0,
        status: invoice.status || 'PENDING',
        notes: invoice.notes || '',
        items:
          invoice.items?.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: Number(item.price),
            discount: Number(item.discount) || 0,
          })) || [{ productId: '', quantity: 1, price: 0, discount: 0 }],
      });
    } else {
      reset({
        customerId: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        taxRate: 0,
        discount: 0,
        status: 'PENDING',
        notes: '',
        items: [{ productId: '', quantity: 1, price: 0, discount: 0 }],
      });
    }
  }, [invoice, reset]);

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      dueDate: data.dueDate || null,
      notes: data.notes || null,
      items: data.items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        price: Number(item.price),
        discount: Number(item.discount) || 0,
      })),
    };

    if (isEdit) {
      payload.id = invoice.id;
    }

    onSubmit(payload);
  };

  const customerOptions = customers.map((c) => ({
    value: c.id,
    label: `${c.name}${c.company ? ` — ${c.company}` : ''}`,
  }));

  const productOptions = products.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.sku})`,
  }));

  const statusOptions = Object.entries(INVOICE_STATUS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Invoice' : 'Create New Invoice'}
      description={isEdit ? 'Update invoice details and items' : 'Fill in customer, items, and payment details'}
      size="xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Row 1: Customer & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Customer"
            placeholder="Select customer"
            options={customerOptions}
            error={errors.customerId?.message}
            required
            {...register('customerId')}
          />
          <Select
            label="Status"
            options={statusOptions}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

        {/* Row 2: Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Invoice Date"
            type="date"
            error={errors.invoiceDate?.message}
            {...register('invoiceDate')}
          />
          <Input
            label="Due Date"
            type="date"
            error={errors.dueDate?.message}
            {...register('dueDate')}
          />
        </div>

        {/* Invoice Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
              Invoice Items <span className="text-danger-500">*</span>
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              leftIcon={Plus}
              onClick={() => append({ productId: '', quantity: 1, price: 0, discount: 0 })}
            >
              Add Item
            </Button>
          </div>

          {errors.items?.message && (
            <p className="text-xs text-danger-500 mb-2">{errors.items.message}</p>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
              >
                {/* Product */}
                <div className="col-span-12 sm:col-span-4">
                  <Select
                    label={index === 0 ? 'Product' : undefined}
                    placeholder="Select product"
                    options={productOptions}
                    error={errors.items?.[index]?.productId?.message}
                    {...register(`items.${index}.productId`, {
                      onChange: (e) => handleProductChange(index, e.target.value),
                    })}
                  />
                </div>

                {/* Quantity */}
                <div className="col-span-4 sm:col-span-2">
                  <Input
                    label={index === 0 ? 'Qty' : undefined}
                    type="number"
                    min="1"
                    error={errors.items?.[index]?.quantity?.message}
                    {...register(`items.${index}.quantity`)}
                  />
                </div>

                {/* Price */}
                <div className="col-span-4 sm:col-span-2">
                  <Input
                    label={index === 0 ? 'Price' : undefined}
                    type="number"
                    step="0.01"
                    min="0"
                    error={errors.items?.[index]?.price?.message}
                    {...register(`items.${index}.price`)}
                  />
                </div>

                {/* Item Discount */}
                <div className="col-span-3 sm:col-span-2">
                  <Input
                    label={index === 0 ? 'Disc.' : undefined}
                    type="number"
                    step="0.01"
                    min="0"
                    {...register(`items.${index}.discount`)}
                  />
                </div>

                {/* Line Total + Remove */}
                <div className="col-span-1 sm:col-span-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300 whitespace-nowrap hidden sm:inline">
                    {formatCurrency(
                      Math.max(
                        (Number(watchedItems?.[index]?.quantity) || 0) *
                          (Number(watchedItems?.[index]?.price) || 0) -
                          (Number(watchedItems?.[index]?.discount) || 0),
                        0
                      )
                    )}
                  </span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-danger-500 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tax & Discount */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tax Rate (%)"
            type="number"
            step="0.01"
            min="0"
            max="100"
            error={errors.taxRate?.message}
            {...register('taxRate')}
          />
          <Input
            label="Discount (₹)"
            type="number"
            step="0.01"
            min="0"
            error={errors.discount?.message}
            {...register('discount')}
          />
        </div>

        {/* Totals */}
        <div className="p-4 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-500 dark:text-surface-400">Subtotal</span>
            <span className="font-medium text-surface-900 dark:text-surface-100">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-500 dark:text-surface-400">Tax ({watchedTaxRate}%)</span>
            <span className="font-medium text-surface-900 dark:text-surface-100">
              {formatCurrency(taxAmount)}
            </span>
          </div>
          {watchedDiscount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-500 dark:text-surface-400">Discount</span>
              <span className="font-medium text-danger-500">
                -{formatCurrency(watchedDiscount)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-base pt-2 border-t border-surface-200 dark:border-surface-700">
            <span className="font-semibold text-surface-900 dark:text-surface-100">Grand Total</span>
            <span className="font-bold text-lg text-primary-600 dark:text-primary-400">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>

        {/* Notes */}
        <Textarea
          label="Notes"
          placeholder="Payment terms, special instructions..."
          rows={2}
          error={errors.notes?.message}
          {...register('notes')}
        />

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-700">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEdit ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default InvoiceForm;
