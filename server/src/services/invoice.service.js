import prisma from '../config/db.js';
import { NotFoundError } from '../utils/errors.js';
import { parsePagination, parseSorting } from '../utils/pagination.js';

/**
 * Generate next invoice number (INV-0001, INV-0002, ...)
 */
const generateInvoiceNumber = async () => {
  const last = await prisma.invoice.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { invoiceNumber: true },
  });

  if (!last) return 'INV-0001';

  const num = parseInt(last.invoiceNumber.replace('INV-', ''), 10) || 0;
  return `INV-${String(num + 1).padStart(4, '0')}`;
};

/**
 * Get all invoices with search, filter, sort, and pagination.
 */
export const getInvoices = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSorting(query, [
    'invoiceNumber', 'invoiceDate', 'dueDate', 'grandTotal', 'status', 'createdAt',
  ]);

  const where = {};

  if (query.search) {
    where.OR = [
      { invoiceNumber: { contains: query.search, mode: 'insensitive' } },
      { customer: { name: { contains: query.search, mode: 'insensitive' } } },
      { customer: { company: { contains: query.search, mode: 'insensitive' } } },
    ];
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.customerId) {
    where.customerId = query.customerId;
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        customer: { select: { id: true, name: true, company: true, email: true } },
        _count: { select: { items: true } },
      },
    }),
    prisma.invoice.count({ where }),
  ]);

  return { invoices, total, page, limit };
};

/**
 * Get single invoice by ID with items and customer.
 */
export const getInvoiceById = async (id) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true } },
        },
      },
    },
  });
  if (!invoice) {
    throw new NotFoundError('Invoice');
  }
  return invoice;
};

/**
 * Create a new invoice with items.
 */
export const createInvoice = async (data) => {
  const invoiceNumber = await generateInvoiceNumber();

  // Calculate totals from items
  const items = data.items.map((item) => {
    const total = (item.quantity * item.price) - (item.discount || 0);
    return { ...item, total };
  });

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = subtotal * ((data.taxRate || 0) / 100);
  const grandTotal = subtotal + taxAmount - (data.discount || 0);

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      subtotal,
      taxRate: data.taxRate || 0,
      taxAmount,
      discount: data.discount || 0,
      grandTotal,
      status: data.status || 'PENDING',
      notes: data.notes || null,
      customerId: data.customerId,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          total: item.total,
        })),
      },
    },
    include: {
      customer: { select: { id: true, name: true, company: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true } },
        },
      },
    },
  });

  // Update customer totalPurchase if invoice is PAID
  if (invoice.status === 'PAID') {
    await prisma.customer.update({
      where: { id: data.customerId },
      data: { totalPurchase: { increment: grandTotal } },
    });
  }

  return invoice;
};

/**
 * Update an invoice.
 */
export const updateInvoice = async (id, data) => {
  const existing = await getInvoiceById(id);

  const updateData = {};

  if (data.customerId) updateData.customerId = data.customerId;
  if (data.invoiceDate) updateData.invoiceDate = new Date(data.invoiceDate);
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  if (data.notes !== undefined) updateData.notes = data.notes || null;

  // If items are provided, recalculate totals
  if (data.items) {
    const items = data.items.map((item) => {
      const total = (item.quantity * item.price) - (item.discount || 0);
      return { ...item, total };
    });

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = data.taxRate !== undefined ? data.taxRate : Number(existing.taxRate);
    const discount = data.discount !== undefined ? data.discount : Number(existing.discount);
    const taxAmount = subtotal * (taxRate / 100);
    const grandTotal = subtotal + taxAmount - discount;

    updateData.subtotal = subtotal;
    updateData.taxRate = taxRate;
    updateData.taxAmount = taxAmount;
    updateData.discount = discount;
    updateData.grandTotal = grandTotal;

    // Delete old items and create new
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });

    await prisma.invoiceItem.createMany({
      data: items.map((item) => ({
        invoiceId: id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
        total: item.total,
      })),
    });
  } else {
    if (data.taxRate !== undefined) updateData.taxRate = data.taxRate;
    if (data.discount !== undefined) updateData.discount = data.discount;
  }

  // Handle status change and update customer totalPurchase
  if (data.status && data.status !== existing.status) {
    updateData.status = data.status;

    const total = Number(updateData.grandTotal || existing.grandTotal);
    const custId = updateData.customerId || existing.customerId;

    if (existing.status === 'PAID' && data.status !== 'PAID') {
      await prisma.customer.update({
        where: { id: custId },
        data: { totalPurchase: { decrement: total } },
      });
    } else if (existing.status !== 'PAID' && data.status === 'PAID') {
      await prisma.customer.update({
        where: { id: custId },
        data: { totalPurchase: { increment: total } },
      });
    }
  }

  const invoice = await prisma.invoice.update({
    where: { id },
    data: updateData,
    include: {
      customer: { select: { id: true, name: true, company: true } },
      items: {
        include: {
          product: { select: { id: true, name: true, sku: true } },
        },
      },
    },
  });

  return invoice;
};

/**
 * Delete an invoice.
 */
export const deleteInvoice = async (id) => {
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) {
    throw new NotFoundError('Invoice');
  }

  // If it was paid, decrement customer totalPurchase
  if (invoice.status === 'PAID') {
    await prisma.customer.update({
      where: { id: invoice.customerId },
      data: { totalPurchase: { decrement: Number(invoice.grandTotal) } },
    });
  }

  // Items cascade-delete due to schema
  await prisma.invoice.delete({ where: { id } });
};
