import prisma from '../config/db.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { parsePagination, parseSorting } from '../utils/pagination.js';

/**
 * Get all products with search, filter, sort, and pagination.
 */
export const getProducts = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSorting(query, [
    'name', 'sku', 'buyingPrice', 'sellingPrice', 'stock', 'createdAt',
  ]);

  const where = {};

  // Search by name, sku, barcode, description
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { sku: { contains: query.search, mode: 'insensitive' } },
      { barcode: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  // Filter by category
  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  // Filter by supplier
  if (query.supplierId) {
    where.supplierId = query.supplierId;
  }

  // Filter by active status
  if (query.isActive !== undefined && query.isActive !== '') {
    where.isActive = query.isActive === 'true';
  }

  // Filter low stock
  if (query.lowStock === 'true') {
    where.stock = { lte: prisma.product.fields?.minStock ?? 5 };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        category: { select: { id: true, name: true } },
        supplier: { select: { id: true, name: true, company: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total, page, limit };
};

/**
 * Get single product by ID.
 */
export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true, company: true } },
      _count: { select: { invoiceItems: true } },
    },
  });
  if (!product) {
    throw new NotFoundError('Product');
  }
  return product;
};

/**
 * Get products with low stock (below minStock threshold).
 */
export const getLowStockProducts = async () => {
  const products = await prisma.$queryRaw`
    SELECT p.id, p.name, p.sku, p.stock, p."minStock", p."sellingPrice",
           c.name as "categoryName"
    FROM products p
    LEFT JOIN categories c ON p."categoryId" = c.id
    WHERE p.stock <= p."minStock"
    ORDER BY p.stock ASC
  `;
  return products;
};

/**
 * Get all products as a lightweight list for dropdowns (e.g. invoice items).
 */
export const getProductsList = async () => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      sku: true,
      sellingPrice: true,
      stock: true,
    },
    orderBy: { name: 'asc' },
  });
  return products;
};

/**
 * Create a new product.
 */
export const createProduct = async (data) => {
  // Check duplicate SKU
  const existingSku = await prisma.product.findUnique({ where: { sku: data.sku } });
  if (existingSku) {
    throw new ConflictError('A product with this SKU already exists');
  }

  // Check duplicate barcode if provided
  if (data.barcode) {
    const existingBarcode = await prisma.product.findUnique({ where: { barcode: data.barcode } });
    if (existingBarcode) {
      throw new ConflictError('A product with this barcode already exists');
    }
  }

  // Normalize empty optional fields
  const cleanData = { ...data };
  if (!cleanData.barcode) cleanData.barcode = null;
  if (!cleanData.supplierId) cleanData.supplierId = null;

  const product = await prisma.product.create({
    data: cleanData,
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true, company: true } },
    },
  });

  return product;
};

/**
 * Update a product.
 */
export const updateProduct = async (id, data) => {
  await getProductById(id);

  const cleanData = { ...data };

  // If SKU is being changed, check duplicates
  if (cleanData.sku) {
    const existing = await prisma.product.findFirst({
      where: { sku: cleanData.sku, NOT: { id } },
    });
    if (existing) {
      throw new ConflictError('A product with this SKU already exists');
    }
  }

  // If barcode is being changed, check duplicates
  if (cleanData.barcode) {
    const existing = await prisma.product.findFirst({
      where: { barcode: cleanData.barcode, NOT: { id } },
    });
    if (existing) {
      throw new ConflictError('A product with this barcode already exists');
    }
  }

  if (cleanData.barcode === '') cleanData.barcode = null;
  if (cleanData.supplierId === '') cleanData.supplierId = null;

  const product = await prisma.product.update({
    where: { id },
    data: cleanData,
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true, company: true } },
    },
  });

  return product;
};

/**
 * Delete a product.
 */
export const deleteProduct = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { _count: { select: { invoiceItems: true } } },
  });

  if (!product) {
    throw new NotFoundError('Product');
  }

  if (product._count.invoiceItems > 0) {
    throw new ConflictError('Cannot delete a product that appears in invoices.');
  }

  await prisma.product.delete({ where: { id } });
};
