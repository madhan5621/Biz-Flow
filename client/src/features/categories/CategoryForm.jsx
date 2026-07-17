import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Input, Textarea, Button } from '../../components/ui';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional().or(z.literal('')),
});

const CategoryForm = ({ isOpen, onClose, onSubmit, category = null, isLoading = false }) => {
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Reset form when category changes
  useEffect(() => {
    if (category) {
      reset({
        name: category.name || '',
        description: category.description || '',
      });
    } else {
      reset({
        name: '',
        description: '',
      });
    }
  }, [category, reset]);

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      description: data.description || null,
    };

    if (isEdit) {
      payload.id = category.id;
    }

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Category' : 'Add New Category'}
      description={isEdit ? 'Update category information' : 'Fill in the details to create a new category'}
      size="sm"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <Input
          label="Category Name"
          placeholder="e.g. Electronics, Office Supplies"
          error={errors.name?.message}
          required
          {...register('name')}
        />

        <Textarea
          label="Description"
          placeholder="Brief description of this category"
          rows={3}
          {...register('description')}
        />

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-700">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEdit ? 'Update Category' : 'Add Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryForm;
