import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
  Filter,
} from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import { Button, Badge, Avatar, SearchInput, Select, DataTable, ConfirmDialog } from '../../components/ui';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee, useDepartments, exportEmployeesCSV } from './useEmployees';
import EmployeeForm from './EmployeeForm';
import EmployeeDetail from './EmployeeDetail';
import { useToast } from '../../providers/ToastProvider';
import { useAuth } from '../../providers/AuthProvider';
import { formatCurrency, formatDate } from '../../lib/utils';
import { EMPLOYEE_STATUS } from '../../lib/constants';

const statusVariants = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  ON_LEAVE: 'warning',
  TERMINATED: 'danger',
};

const EmployeesPage = () => {
  const toast = useToast();
  const { isAdmin, isManager } = useAuth();
  const canEdit = isAdmin || isManager;

  // Query params
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [detailEmployee, setDetailEmployee] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Data fetching
  const { data, isLoading } = useEmployees({
    search, department, status, page, limit, sortBy, sortOrder,
  });
  const { data: departments = [] } = useDepartments();

  // Mutations
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const employees = data?.data || [];
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
      toast.success('Employee created successfully');
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create employee');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateMutation.mutateAsync(formData);
      toast.success('Employee updated successfully');
      setEditEmployee(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update employee');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success('Employee deleted successfully');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    }
  };

  const handleExportCSV = async () => {
    try {
      await exportEmployeesCSV({ search, department, status });
      toast.success('CSV downloaded');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  // Table columns
  const columns = [
    {
      key: 'name',
      label: 'Employee',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} src={row.photo} size="sm" />
          <div>
            <p className="font-medium text-surface-900 dark:text-surface-100">{row.name}</p>
            <p className="text-xs text-surface-400 dark:text-surface-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
    },
    {
      key: 'position',
      label: 'Position',
      sortable: true,
      className: 'hidden md:table-cell',
    },
    {
      key: 'salary',
      label: 'Salary',
      sortable: true,
      className: 'hidden lg:table-cell',
      render: (val) => formatCurrency(val),
    },
    {
      key: 'joiningDate',
      label: 'Joined',
      sortable: true,
      className: 'hidden xl:table-cell',
      render: (val) => formatDate(val),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => (
        <Badge variant={statusVariants[val]} size="sm" dot>
          {val.replace(/_/g, ' ')}
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
            onClick={(e) => { e.stopPropagation(); setDetailEmployee(row); }}
            aria-label="View employee"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {canEdit && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={(e) => { e.stopPropagation(); setEditEmployee(row); }}
              aria-label="Edit employee"
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
              aria-label="Delete employee"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const statusOptions = Object.entries(EMPLOYEE_STATUS).map(([key, value]) => ({
    value: key,
    label: value.replace(/_/g, ' '),
  }));

  const departmentOptions = departments.map((d) => ({ value: d, label: d }));

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-500" />
            Employees
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-0.5">
            Manage your team members and their details
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={Download} onClick={handleExportCSV}>
            Export
          </Button>
          {canEdit && (
            <Button size="sm" leftIcon={Plus} onClick={() => setShowForm(true)}>
              Add Employee
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
              placeholder="Search employees by name, email, department..."
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
            {(department || status) && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center">
                {[department, status].filter(Boolean).length}
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
                placeholder="All Departments"
                options={departmentOptions}
                value={department}
                onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                placeholder="All Statuses"
                options={statusOptions}
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              />
            </div>
            {(department || status) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setDepartment(''); setStatus(''); setPage(1); }}
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
        data={employees}
        isLoading={isLoading}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        page={page}
        limit={limit}
        total={total}
        onPageChange={setPage}
        onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
        onRowClick={(row) => setDetailEmployee(row)}
        emptyTitle="No employees found"
        emptyDescription="Try adjusting your search or filters, or add a new employee."
        emptyIcon={Users}
      />

      {/* Create Modal */}
      <EmployeeForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* Edit Modal */}
      <EmployeeForm
        isOpen={!!editEmployee}
        onClose={() => setEditEmployee(null)}
        onSubmit={handleUpdate}
        employee={editEmployee}
        isLoading={updateMutation.isPending}
      />

      {/* Detail Modal */}
      <EmployeeDetail
        isOpen={!!detailEmployee}
        onClose={() => setDetailEmployee(null)}
        employee={detailEmployee}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </PageWrapper>
  );
};

export default EmployeesPage;
