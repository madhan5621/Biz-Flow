import * as employeeService from '../services/employee.service.js';
import { logActivity, getClientIp } from '../services/activity.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/employees
 */
export const getEmployees = asyncHandler(async (req, res) => {
  const { employees, total, page, limit } = await employeeService.getEmployees(req.query);

  sendPaginated(res, {
    data: employees,
    page,
    limit,
    total,
    message: 'Employees retrieved',
  });
});

/**
 * GET /api/employees/:id
 */
export const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  sendSuccess(res, { data: employee, message: 'Employee retrieved' });
});

/**
 * POST /api/employees
 */
export const createEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body);

  await logActivity({
    userId: req.user.id,
    action: 'CREATE',
    entity: 'Employee',
    entityId: employee.id,
    details: `Created employee: ${employee.name}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, {
    data: employee,
    message: 'Employee created successfully',
    statusCode: 201,
  });
});

/**
 * PUT /api/employees/:id
 */
export const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.updateEmployee(req.params.id, req.body);

  await logActivity({
    userId: req.user.id,
    action: 'UPDATE',
    entity: 'Employee',
    entityId: employee.id,
    details: `Updated employee: ${employee.name}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { data: employee, message: 'Employee updated successfully' });
});

/**
 * DELETE /api/employees/:id
 */
export const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  await employeeService.deleteEmployee(req.params.id);

  await logActivity({
    userId: req.user.id,
    action: 'DELETE',
    entity: 'Employee',
    entityId: req.params.id,
    details: `Deleted employee: ${employee.name}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { message: 'Employee deleted successfully' });
});

/**
 * GET /api/employees/export/csv
 */
export const exportCSV = asyncHandler(async (req, res) => {
  const csv = await employeeService.exportCSV(req.query);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=employees_${Date.now()}.csv`);
  res.send(csv);
});

/**
 * GET /api/employees/departments
 */
export const getDepartments = asyncHandler(async (_req, res) => {
  const departments = await employeeService.getDepartments();
  sendSuccess(res, { data: departments, message: 'Departments retrieved' });
});
