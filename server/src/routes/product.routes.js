import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createProductSchema, updateProductSchema } from '../validators/product.validator.js';

const router = Router();

// All product routes require authentication
router.use(authenticate);

// GET /api/products/list — lightweight list for dropdowns (must be before /:id)
router.get('/list', productController.getProductsList);

// GET /api/products/low-stock — products below minimum stock
router.get('/low-stock', productController.getLowStockProducts);

// GET /api/products
router.get('/', productController.getProducts);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

// POST /api/products — admin/manager only
router.post('/', authorize('ADMIN', 'MANAGER'), validate(createProductSchema), productController.createProduct);

// PUT /api/products/:id — admin/manager only
router.put('/:id', authorize('ADMIN', 'MANAGER'), validate(updateProductSchema), productController.updateProduct);

// DELETE /api/products/:id — admin only
router.delete('/:id', authorize('ADMIN'), productController.deleteProduct);

export default router;
