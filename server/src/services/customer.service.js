import prisma from '../config/db.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { parsePagination, parseSorting } from '../utils/pagination.js';

/**
 * Get all customers with search, filter, sort, and pagination.
 */
export const getCustomers = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSorting(query, [
    'name', 'email', 'company', 'city', 'state', 'totalPurchase', 'createdAt',
  ]);

  // Build where clause
  const where = {};

  // Search by name, email, company, phone
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
      { company: { contains: query.search, mode: 'insensitive' } },
      { phone: { contains: query.search, mode: 'insensitive' } },
      { city: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  // Filter by city
  if (query.city) {
    where.city = query.city;
  }

  // Filter by state
  if (query.state) {
    where.state = query.state;
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        _count: { select: { invoices: true } },
      },
    }),
    prisma.customer.count({ where }),
  ]);

  return { customers, total, page, limit };
};

/**
 * Get single customer by ID, including their invoices (purchase history).
 */
export const getCustomerById = async (id) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      invoices: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          invoiceNumber: true,
          invoiceDate: true,
          grandTotal: true,
          status: true,
        },
      },
      _count: { select: { invoices: true } },
    },
  });
  if (!customer) {
    throw new NotFoundError('Customer');
  }
  return customer;
};

/**
 * Create a new customer.
 */
export const createCustomer = async (data) => {
  // Normalize empty email to null to avoid unique constraint issues
  const cleanData = { ...data };
  if (!cleanData.email || cleanData.email === '') {
    cleanData.email = null;
  }

  // Check for duplicate email if provided
  if (cleanData.email) {
    const existing = await prisma.customer.findUnique({ where: { email: cleanData.email } });
    if (existing) {
      throw new ConflictError('A customer with this email already exists');
    }
  }

  const customer = await prisma.customer.create({
    data: cleanData,
  });

  return customer;
};

/**
 * Update a customer.
 */
export const updateCustomer = async (id, data) => {
  // Check exists
  await getCustomerById(id);

  const cleanData = { ...data };
  if (cleanData.email === '') {
    cleanData.email = null;
  }

  // If email is being changed, check for duplicates
  if (cleanData.email) {
    const existing = await prisma.customer.findFirst({
      where: { email: cleanData.email, NOT: { id } },
    });
    if (existing) {
      throw new ConflictError('A customer with this email already exists');
    }
  }

  const customer = await prisma.customer.update({
    where: { id },
    data: cleanData,
  });

  return customer;
};

/**
 * Delete a customer.
 */
export const deleteCustomer = async (id) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: { _count: { select: { invoices: true } } },
  });

  if (!customer) {
    throw new NotFoundError('Customer');
  }

  // Prevent deletion if customer has invoices
  if (customer._count.invoices > 0) {
    throw new ConflictError('Cannot delete a customer with existing invoices. Delete their invoices first.');
  }

  await prisma.customer.delete({ where: { id } });
};

/**
 * Get unique cities for filter dropdown.
 */
export const getCities = async () => {
  const result = await prisma.customer.findMany({
    select: { city: true },
    distinct: ['city'],
    where: { city: { not: null } },
    orderBy: { city: 'asc' },
  });
  return result.map((r) => r.city);
};
