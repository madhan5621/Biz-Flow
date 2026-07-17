import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createEmployeeSchema, updateEmployeeSchema } from '../validators/employee.validator.js';

const router = Router();

// All employee routes require authentication
router.use(authenticate);

// GET /api/employees/export/csv — must be before /:id to avoid matching
router.get('/export/csv', employeeController.exportCSV);

// GET /api/employees/departments
router.get('/departments', employeeController.getDepartments);

// GET /api/employees
router.get('/', employeeController.getEmployees);

// GET /api/employees/:id
router.get('/:id', employeeController.getEmployeeById);

// POST /api/employees — admin/manager only
router.post('/', authorize('ADMIN', 'MANAGER'), validate(createEmployeeSchema), employeeController.createEmployee);

// PUT /api/employees/:id — admin/manager only
router.put('/:id', authorize('ADMIN', 'MANAGER'), validate(updateEmployeeSchema), employeeController.updateEmployee);

// DELETE /api/employees/:id — admin only
router.delete('/:id', authorize('ADMIN'), employeeController.deleteEmployee);

export default router;
