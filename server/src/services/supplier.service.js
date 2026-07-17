import prisma from '../config/db.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { parsePagination, parseSorting } from '../utils/pagination.js';

/**
 * Get all suppliers with search, filter, sort, and pagination.
 */
export const getSuppliers = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSorting(query, [
    'name', 'email', 'company', 'city', 'state', 'createdAt',
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

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.supplier.count({ where }),
  ]);

  return { suppliers, total, page, limit };
};

/**
 * Get single supplier by ID, including products they supply.
 */
export const getSupplierById = async (id) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      products: {
        orderBy: { name: 'asc' },
        take: 10,
        select: {
          id: true,
          name: true,
          sku: true,
          sellingPrice: true,
          stock: true,
          isActive: true,
        },
      },
      _count: { select: { products: true } },
    },
  });
  if (!supplier) {
    throw new NotFoundError('Supplier');
  }
  return supplier;
};

/**
 * Create a new supplier.
 */
export const createSupplier = async (data) => {
  const cleanData = { ...data };
  if (!cleanData.email || cleanData.email === '') {
    cleanData.email = null;
  }

  // Check for duplicate email if provided
  if (cleanData.email) {
    const existing = await prisma.supplier.findUnique({ where: { email: cleanData.email } });
    if (existing) {
      throw new ConflictError('A supplier with this email already exists');
    }
  }

  const supplier = await prisma.supplier.create({
    data: cleanData,
  });

  return supplier;
};

/**
 * Update a supplier.
 */
export const updateSupplier = async (id, data) => {
  // Check exists
  await getSupplierById(id);

  const cleanData = { ...data };
  if (cleanData.email === '') {
    cleanData.email = null;
  }

  // If email is being changed, check for duplicates
  if (cleanData.email) {
    const existing = await prisma.supplier.findFirst({
      where: { email: cleanData.email, NOT: { id } },
    });
    if (existing) {
      throw new ConflictError('A supplier with this email already exists');
    }
  }

  const supplier = await prisma.supplier.update({
    where: { id },
    data: cleanData,
  });

  return supplier;
};

/**
 * Delete a supplier.
 */
export const deleteSupplier = async (id) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!supplier) {
    throw new NotFoundError('Supplier');
  }

  // Prevent deletion if supplier has linked products
  if (supplier._count.products > 0) {
    throw new ConflictError('Cannot delete a supplier with linked products. Unlink their products first.');
  }

  await prisma.supplier.delete({ where: { id } });
};

/**
 * Get all suppliers as a lightweight list (for select dropdowns in other modules).
 */
export const getSuppliersList = async () => {
  const suppliers = await prisma.supplier.findMany({
    select: { id: true, name: true, company: true },
    orderBy: { name: 'asc' },
  });
  return suppliers;
};
