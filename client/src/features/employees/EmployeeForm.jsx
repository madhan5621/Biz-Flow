import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Input, Select, Textarea, Button } from '../../components/ui';
import { DEPARTMENTS, EMPLOYEE_STATUS } from '../../lib/constants';

const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  salary: z.string().min(1, 'Salary is required').or(z.number()),
  joiningDate: z.string().min(1, 'Joining date is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED']).optional(),
  attendanceRate: z.string().optional().or(z.literal('')),
  performanceRate: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

const EmployeeForm = ({ isOpen, onClose, onSubmit, employee = null, isLoading = false }) => {
  const isEdit = !!employee;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      salary: '',
      joiningDate: '',
      status: 'ACTIVE',
      attendanceRate: '',
      performanceRate: '',
      address: '',
      notes: '',
    },
  });

  // Reset form when employee changes
  useEffect(() => {
    if (employee) {
      reset({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        position: employee.position || '',
        salary: employee.salary ? String(Number(employee.salary)) : '',
        joiningDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : '',
        status: employee.status || 'ACTIVE',
        attendanceRate: employee.attendanceRate != null ? String(Number(employee.attendanceRate)) : '',
        performanceRate: employee.performanceRate != null ? String(Number(employee.performanceRate)) : '',
        address: employee.address || '',
        notes: employee.notes || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        salary: '',
        joiningDate: '',
        status: 'ACTIVE',
        attendanceRate: '',
        performanceRate: '',
        address: '',
        notes: '',
      });
    }
  }, [employee, reset]);

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      salary: parseFloat(data.salary),
      attendanceRate: data.attendanceRate ? parseFloat(data.attendanceRate) : null,
      performanceRate: data.performanceRate ? parseFloat(data.performanceRate) : null,
      phone: data.phone || null,
      address: data.address || null,
      notes: data.notes || null,
    };

    if (isEdit) {
      payload.id = employee.id;
    }

    onSubmit(payload);
  };

  const statusOptions = Object.entries(EMPLOYEE_STATUS).map(([key, value]) => ({
    value: key,
    label: value.replace(/_/g, ' '),
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Employee' : 'Add New Employee'}
      description={isEdit ? 'Update employee information' : 'Fill in the details to add a new employee'}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="Enter full name"
            error={errors.name?.message}
            required
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="name@company.com"
            error={errors.email?.message}
            required
            {...register('email')}
          />
        </div>

        {/* Row 2: Phone & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone"
            placeholder="+91 98765 43210"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Select
            label="Department"
            options={DEPARTMENTS}
            error={errors.department?.message}
            required
            {...register('department')}
          />
        </div>

        {/* Row 3: Position & Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Position"
            placeholder="e.g. Senior Developer"
            error={errors.position?.message}
            required
            {...register('position')}
          />
          <Input
            label="Salary (₹)"
            type="number"
            placeholder="50000"
            error={errors.salary?.message}
            required
            {...register('salary')}
          />
        </div>

        {/* Row 4: Joining Date & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Joining Date"
            type="date"
            error={errors.joiningDate?.message}
            required
            {...register('joiningDate')}
          />
          <Select
            label="Status"
            options={statusOptions}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

        {/* Row 5: Attendance & Performance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Attendance Rate (%)"
            type="number"
            placeholder="e.g. 96.5"
            helperText="0-100"
            {...register('attendanceRate')}
          />
          <Input
            label="Performance Rating"
            type="number"
            placeholder="e.g. 4.2"
            helperText="0-5 scale"
            {...register('performanceRate')}
          />
        </div>

        {/* Address */}
        <Textarea
          label="Address"
          placeholder="Enter address"
          rows={2}
          {...register('address')}
        />

        {/* Notes */}
        <Textarea
          label="Notes"
          placeholder="Any additional notes"
          rows={2}
          {...register('notes')}
        />

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-700">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEdit ? 'Update Employee' : 'Add Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeForm;
