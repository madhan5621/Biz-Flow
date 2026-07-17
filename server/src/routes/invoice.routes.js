import { Router } from 'express';
import * as invoiceController from '../controllers/invoice.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createInvoiceSchema, updateInvoiceSchema } from '../validators/invoice.validator.js';

const router = Router();

// All invoice routes require authentication
router.use(authenticate);

// GET /api/invoices
router.get('/', invoiceController.getInvoices);

// GET /api/invoices/:id
router.get('/:id', invoiceController.getInvoiceById);

// POST /api/invoices — admin/manager only
router.post('/', authorize('ADMIN', 'MANAGER'), validate(createInvoiceSchema), invoiceController.createInvoice);

// PUT /api/invoices/:id — admin/manager only
router.put('/:id', authorize('ADMIN', 'MANAGER'), validate(updateInvoiceSchema), invoiceController.updateInvoice);

// DELETE /api/invoices/:id — admin only
router.delete('/:id', authorize('ADMIN'), invoiceController.deleteInvoice);

export default router;
