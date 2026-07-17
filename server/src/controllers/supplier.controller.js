import * as supplierService from '../services/supplier.service.js';
import { logActivity, getClientIp } from '../services/activity.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/suppliers
 */
export const getSuppliers = asyncHandler(async (req, res) => {
  const { suppliers, total, page, limit } = await supplierService.getSuppliers(req.query);

  sendPaginated(res, {
    data: suppliers,
    page,
    limit,
    total,
    message: 'Suppliers retrieved',
  });
});

/**
 * GET /api/suppliers/:id
 */
export const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await supplierService.getSupplierById(req.params.id);
  sendSuccess(res, { data: supplier, message: 'Supplier retrieved' });
});

/**
 * POST /api/suppliers
 */
export const createSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierService.createSupplier(req.body);

  await logActivity({
    userId: req.user.id,
    action: 'CREATE',
    entity: 'Supplier',
    entityId: supplier.id,
    details: `Created supplier: ${supplier.name}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, {
    data: supplier,
    message: 'Supplier created successfully',
    statusCode: 201,
  });
});

/**
 * PUT /api/suppliers/:id
 */
export const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierService.updateSupplier(req.params.id, req.body);

  await logActivity({
    userId: req.user.id,
    action: 'UPDATE',
    entity: 'Supplier',
    entityId: supplier.id,
    details: `Updated supplier: ${supplier.name}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { data: supplier, message: 'Supplier updated successfully' });
});

/**
 * DELETE /api/suppliers/:id
 */
export const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await supplierService.getSupplierById(req.params.id);
  await supplierService.deleteSupplier(req.params.id);

  await logActivity({
    userId: req.user.id,
    action: 'DELETE',
    entity: 'Supplier',
    entityId: req.params.id,
    details: `Deleted supplier: ${supplier.name}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { message: 'Supplier deleted successfully' });
});

/**
 * GET /api/suppliers/list
 */
export const getSuppliersList = asyncHandler(async (_req, res) => {
  const suppliers = await supplierService.getSuppliersList();
  sendSuccess(res, { data: suppliers, message: 'Suppliers list retrieved' });
});
