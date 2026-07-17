import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Input, Textarea, Button } from '../../components/ui';

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  gstNumber: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  zipCode: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

const CustomerForm = ({ isOpen, onClose, onSubmit, customer = null, isLoading = false }) => {
  const isEdit = !!customer;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      gstNumber: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      notes: '',
    },
  });

  // Reset form when customer changes
  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        gstNumber: customer.gstNumber || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
        zipCode: customer.zipCode || '',
        notes: customer.notes || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        gstNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        notes: '',
      });
    }
  }, [customer, reset]);

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      email: data.email || null,
      phone: data.phone || null,
      company: data.company || null,
      gstNumber: data.gstNumber || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      zipCode: data.zipCode || null,
      notes: data.notes || null,
    };

    if (isEdit) {
      payload.id = customer.id;
    }

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Customer' : 'Add New Customer'}
      description={isEdit ? 'Update customer information' : 'Fill in the details to add a new customer'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Row 1: Name & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="Enter customer name"
            error={errors.name?.message}
            required
            {...register('name')}
          />
          <Input
            label="Company"
            placeholder="Company name"
            error={errors.company?.message}
            {...register('company')}
          />
        </div>

        {/* Row 2: Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="email@company.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone"
            placeholder="+91 98765 43210"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        {/* Row 3: GST Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="GST Number"
            placeholder="e.g. 22AAAAA0000A1Z5"
            helperText="15-digit GST identification number"
            error={errors.gstNumber?.message}
            {...register('gstNumber')}
          />
        </div>

        {/* Row 4: Address */}
        <Textarea
          label="Address"
          placeholder="Street address"
          rows={2}
          {...register('address')}
        />

        {/* Row 5: City, State, Zip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="City"
            placeholder="City"
            error={errors.city?.message}
            {...register('city')}
          />
          <Input
            label="State"
            placeholder="State"
            error={errors.state?.message}
            {...register('state')}
          />
          <Input
            label="ZIP Code"
            placeholder="110001"
            error={errors.zipCode?.message}
            {...register('zipCode')}
          />
        </div>

        {/* Notes */}
        <Textarea
          label="Notes"
          placeholder="Any additional notes about this customer"
          rows={2}
          {...register('notes')}
        />

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-700">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEdit ? 'Update Customer' : 'Add Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerForm;
