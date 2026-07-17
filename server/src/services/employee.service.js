import prisma from '../config/db.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { parsePagination, parseSorting } from '../utils/pagination.js';

/**
 * Get all employees with search, filter, sort, and pagination.
 */
export const getEmployees = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSorting(query, [
    'name', 'email', 'department', 'position', 'salary', 'joiningDate', 'status', 'createdAt',
  ]);

  // Build where clause
  const where = {};

  // Search by name, email, department, position
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
      { department: { contains: query.search, mode: 'insensitive' } },
      { position: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  // Filter by department
  if (query.department) {
    where.department = query.department;
  }

  // Filter by status
  if (query.status) {
    where.status = query.status;
  }

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.employee.count({ where }),
  ]);

  return { employees, total, page, limit };
};

/**
 * Get single employee by ID.
 */
export const getEmployeeById = async (id) => {
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) {
    throw new NotFoundError('Employee');
  }
  return employee;
};

/**
 * Create a new employee.
 */
export const createEmployee = async (data) => {
  // Check for duplicate email
  const existing = await prisma.employee.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new ConflictError('An employee with this email already exists');
  }

  const employee = await prisma.employee.create({
    data: {
      ...data,
      joiningDate: new Date(data.joiningDate),
    },
  });

  return employee;
};

/**
 * Update an employee.
 */
export const updateEmployee = async (id, data) => {
  // Check exists
  await getEmployeeById(id);

  // If email is being changed, check for duplicates
  if (data.email) {
    const existing = await prisma.employee.findFirst({
      where: { email: data.email, NOT: { id } },
    });
    if (existing) {
      throw new ConflictError('An employee with this email already exists');
    }
  }

  const updateData = { ...data };
  if (updateData.joiningDate) {
    updateData.joiningDate = new Date(updateData.joiningDate);
  }

  const employee = await prisma.employee.update({
    where: { id },
    data: updateData,
  });

  return employee;
};

/**
 * Delete an employee.
 */
export const deleteEmployee = async (id) => {
  await getEmployeeById(id);
  await prisma.employee.delete({ where: { id } });
};

/**
 * Export employees as CSV.
 */
export const exportCSV = async (query) => {
  // Build where clause (same as getEmployees but no pagination)
  const where = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
      { department: { contains: query.search, mode: 'insensitive' } },
      { position: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.department) {
    where.department = query.department;
  }

  if (query.status) {
    where.status = query.status;
  }

  const employees = await prisma.employee.findMany({
    where,
    orderBy: { name: 'asc' },
  });

  // Build CSV
  const headers = ['Name', 'Email', 'Phone', 'Department', 'Position', 'Salary', 'Joining Date', 'Status', 'Attendance Rate', 'Performance Rate'];
  const rows = employees.map((emp) => [
    emp.name,
    emp.email,
    emp.phone || '',
    emp.department,
    emp.position,
    Number(emp.salary),
    emp.joiningDate.toISOString().split('T')[0],
    emp.status,
    emp.attendanceRate != null ? Number(emp.attendanceRate) : '',
    emp.performanceRate != null ? Number(emp.performanceRate) : '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return csvContent;
};

/**
 * Get unique departments for filter dropdown.
 */
export const getDepartments = async () => {
  const result = await prisma.employee.findMany({
    select: { department: true },
    distinct: ['department'],
    orderBy: { department: 'asc' },
  });
  return result.map((r) => r.department);
};
