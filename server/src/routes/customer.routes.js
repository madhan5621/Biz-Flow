import { Router } from 'express';
import * as customerController from '../controllers/customer.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createCustomerSchema, updateCustomerSchema } from '../validators/customer.validator.js';

const router = Router();

// All customer routes require authentication
router.use(authenticate);

// GET /api/customers/cities — must be before /:id to avoid matching
router.get('/cities', customerController.getCities);

// GET /api/customers
router.get('/', customerController.getCustomers);

// GET /api/customers/:id
router.get('/:id', customerController.getCustomerById);

// POST /api/customers — admin/manager only
router.post('/', authorize('ADMIN', 'MANAGER'), validate(createCustomerSchema), customerController.createCustomer);

// PUT /api/customers/:id — admin/manager only
router.put('/:id', authorize('ADMIN', 'MANAGER'), validate(updateCustomerSchema), customerController.updateCustomer);

// DELETE /api/customers/:id — admin only
router.delete('/:id', authorize('ADMIN'), customerController.deleteCustomer);

export default router;
