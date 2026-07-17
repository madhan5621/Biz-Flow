import * as invoiceService from '../services/invoice.service.js';
import { logActivity, getClientIp } from '../services/activity.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/invoices
 */
export const getInvoices = asyncHandler(async (req, res) => {
  const { invoices, total, page, limit } = await invoiceService.getInvoices(req.query);

  sendPaginated(res, {
    data: invoices,
    page,
    limit,
    total,
    message: 'Invoices retrieved',
  });
});

/**
 * GET /api/invoices/:id
 */
export const getInvoiceById = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id);
  sendSuccess(res, { data: invoice, message: 'Invoice retrieved' });
});

/**
 * POST /api/invoices
 */
export const createInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.body);

  await logActivity({
    userId: req.user.id,
    action: 'CREATE',
    entity: 'Invoice',
    entityId: invoice.id,
    details: `Created invoice: ${invoice.invoiceNumber}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, {
    data: invoice,
    message: 'Invoice created successfully',
    statusCode: 201,
  });
});

/**
 * PUT /api/invoices/:id
 */
export const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.updateInvoice(req.params.id, req.body);

  await logActivity({
    userId: req.user.id,
    action: 'UPDATE',
    entity: 'Invoice',
    entityId: invoice.id,
    details: `Updated invoice: ${invoice.invoiceNumber}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { data: invoice, message: 'Invoice updated successfully' });
});

/**
 * DELETE /api/invoices/:id
 */
export const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id);
  await invoiceService.deleteInvoice(req.params.id);

  await logActivity({
    userId: req.user.id,
    action: 'DELETE',
    entity: 'Invoice',
    entityId: req.params.id,
    details: `Deleted invoice: ${invoice.invoiceNumber}`,
    ipAddress: getClientIp(req),
  });

  sendSuccess(res, { message: 'Invoice deleted successfully' });
});
