import * as productService from '../services/product.service.js';
import { logActivity, getClientIp } from '../services/activity.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/products
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { products, total, page, limit } = await productService.getProducts(req.query);

  sendPaginated(res, {
    data: products,
    page,
    limit,
    total,
    message: 'Products retrieved',
  });
});

/**
 * GET /api/products/list
 */
export const getProductsList = asyncHandler(async (_req, res) => {
  const products = await productService.getProductsList();
  sendSuccess(res, { data: products, message: 'Products list retrieved' });
});

/**
 * GET /api/products/low-stock
 */
export const getLowStockProducts = asyncHandler(async (_req, res) => {
  const products = await productService.getLowStockProducts();
  sendSuccess(res, { data: products, message: 'Low stock products retrieved' });
});

/**
 * GET /api/products/:id
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  sendSuccess(res, { data: product, message: 'Product retrieved' });
});

/**
 * POST /api/products
 */
export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);

  await logActivity({
    userId: req.user.id,
    action: 'CREATE',
    entity: 'Product',
    entityId: product.id,
    details: `Created product: ${product.name} (SKU: ${product.sku})`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, {
    data: product,
    message: 'Product created successfully',
    statusCode: 201,
  });
});

/**
 * PUT /api/products/:id
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  await logActivity({
    userId: req.user.id,
    action: 'UPDATE',
    entity: 'Product',
    entityId: product.id,
    details: `Updated product: ${product.name}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { data: product, message: 'Product updated successfully' });
});

/**
 * DELETE /api/products/:id
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  await productService.deleteProduct(req.params.id);

  await logActivity({
    userId: req.user.id,
    action: 'DELETE',
    entity: 'Product',
    entityId: req.params.id,
    details: `Deleted product: ${product.name} (SKU: ${product.sku})`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { message: 'Product deleted successfully' });
});
