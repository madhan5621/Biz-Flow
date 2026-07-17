import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Input, Select, Textarea, Button } from '../../components/ui';
import { EXPENSE_CATEGORIES } from '../../lib/constants';

const expenseSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  amount: z.coerce.number().min(0, 'Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(1000).optional().or(z.literal('')),
  date: z.string().optional(),
  receipt: z.string().max(500).optional().or(z.literal('')),
});

const ExpenseForm = ({ isOpen, onClose, onSubmit, expense = null, isLoading = false }) => {
  const isEdit = !!expense;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: '',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      receipt: '',
    },
  });

  useEffect(() => {
    if (expense) {
      reset({
        title: expense.title || '',
        amount: Number(expense.amount) || '',
        category: expense.category || '',
        description: expense.description || '',
        date: expense.date
          ? new Date(expense.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        receipt: expense.receipt || '',
      });
    } else {
      reset({
        title: '',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        receipt: '',
      });
    }
  }, [expense, reset]);

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      amount: Number(data.amount),
      description: data.description || null,
      receipt: data.receipt || null,
    };

    if (isEdit) {
      payload.id = expense.id;
    }

    onSubmit(payload);
  };

  const categoryOptions = EXPENSE_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Expense' : 'Add New Expense'}
      description={isEdit ? 'Update expense details' : 'Record a new business expense'}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Title */}
        <Input
          label="Title"
          placeholder="e.g. Office rent for July"
          error={errors.title?.message}
          required
          {...register('title')}
        />

        {/* Amount & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount (₹)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            error={errors.amount?.message}
            required
            {...register('amount')}
          />
          <Select
            label="Category"
            placeholder="Select category"
            options={categoryOptions}
            error={errors.category?.message}
            required
            {...register('category')}
          />
        </div>

        {/* Date */}
        <Input
          label="Date"
          type="date"
          error={errors.date?.message}
          {...register('date')}
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Brief description of the expense"
          rows={2}
          error={errors.description?.message}
          {...register('description')}
        />

        {/* Receipt URL */}
        <Input
          label="Receipt URL"
          placeholder="https://..."
          helperText="Link to the receipt or attachment"
          error={errors.receipt?.message}
          {...register('receipt')}
        />

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-700">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEdit ? 'Update Expense' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseForm;
