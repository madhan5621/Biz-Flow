import { Router } from 'express';
import * as supplierController from '../controllers/supplier.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createSupplierSchema, updateSupplierSchema } from '../validators/supplier.validator.js';

const router = Router();

// All supplier routes require authentication
router.use(authenticate);

// GET /api/suppliers/list — lightweight list for dropdowns (must be before /:id)
router.get('/list', supplierController.getSuppliersList);

// GET /api/suppliers
router.get('/', supplierController.getSuppliers);

// GET /api/suppliers/:id
router.get('/:id', supplierController.getSupplierById);

// POST /api/suppliers — admin/manager only
router.post('/', authorize('ADMIN', 'MANAGER'), validate(createSupplierSchema), supplierController.createSupplier);

// PUT /api/suppliers/:id — admin/manager only
router.put('/:id', authorize('ADMIN', 'MANAGER'), validate(updateSupplierSchema), supplierController.updateSupplier);

// DELETE /api/suppliers/:id — admin only
router.delete('/:id', authorize('ADMIN'), supplierController.deleteSupplier);

export default router;
