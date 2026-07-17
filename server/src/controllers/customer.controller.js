import * as customerService from '../services/customer.service.js';
import { logActivity, getClientIp } from '../services/activity.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/customers
 */
export const getCustomers = asyncHandler(async (req, res) => {
  const { customers, total, page, limit } = await customerService.getCustomers(req.query);

  sendPaginated(res, {
    data: customers,
    page,
    limit,
    total,
    message: 'Customers retrieved',
  });
});

/**
 * GET /api/customers/:id
 */
export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.id);
  sendSuccess(res, { data: customer, message: 'Customer retrieved' });
});

/**
 * POST /api/customers
 */
export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(req.body);

  await logActivity({
    userId: req.user.id,
    action: 'CREATE',
    entity: 'Customer',
    entityId: customer.id,
    details: `Created customer: ${customer.name}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, {
    data: customer,
    message: 'Customer created successfully',
    statusCode: 201,
  });
});

/**
 * PUT /api/customers/:id
 */
export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(req.params.id, req.body);

  await logActivity({
    userId: req.user.id,
    action: 'UPDATE',
    entity: 'Customer',
    entityId: customer.id,
    details: `Updated customer: ${customer.name}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { data: customer, message: 'Customer updated successfully' });
});

/**
 * DELETE /api/customers/:id
 */
export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerById(req.params.id);
  await customerService.deleteCustomer(req.params.id);

  await logActivity({
    userId: req.user.id,
    action: 'DELETE',
    entity: 'Customer',
    entityId: req.params.id,
    details: `Deleted customer: ${customer.name}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { message: 'Customer deleted successfully' });
});

/**
 * GET /api/customers/cities
 */
export const getCities = asyncHandler(async (_req, res) => {
  const cities = await customerService.getCities();
  sendSuccess(res, { data: cities, message: 'Cities retrieved' });
});
