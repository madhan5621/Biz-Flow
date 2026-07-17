import prisma from '../config/db.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { parsePagination, parseSorting } from '../utils/pagination.js';

/**
 * Slugify a category name.
 */
const slugify = (name) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Get all categories with search, sort, and pagination.
 */
export const getCategories = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSorting(query, ['name', 'slug', 'createdAt']);

  const where = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.category.count({ where }),
  ]);

  return { categories, total, page, limit };
};

/**
 * Get single category by ID with products.
 */
export const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        orderBy: { name: 'asc' },
        take: 20,
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
  if (!category) {
    throw new NotFoundError('Category');
  }
  return category;
};

/**
 * Get all categories as a lightweight list for dropdowns.
 */
export const getCategoriesList = async () => {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' },
  });
  return categories;
};

/**
 * Create a new category.
 */
export const createCategory = async (data) => {
  const slug = slugify(data.name);

  // Check duplicate name or slug
  const existing = await prisma.category.findFirst({
    where: { OR: [{ name: data.name }, { slug }] },
  });
  if (existing) {
    throw new ConflictError('A category with this name already exists');
  }

  const category = await prisma.category.create({
    data: {
      ...data,
      slug,
    },
  });

  return category;
};

/**
 * Update a category.
 */
export const updateCategory = async (id, data) => {
  await getCategoryById(id);

  const updateData = { ...data };

  // If name is being updated, regenerate slug
  if (data.name) {
    updateData.slug = slugify(data.name);

    // Check duplicate name/slug excluding current
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: updateData.slug }],
        NOT: { id },
      },
    });
    if (existing) {
      throw new ConflictError('A category with this name already exists');
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data: updateData,
  });

  return category;
};

/**
 * Delete a category.
 */
export const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    throw new NotFoundError('Category');
  }

  if (category._count.products > 0) {
    throw new ConflictError('Cannot delete a category with linked products. Reassign or delete products first.');
  }

  await prisma.category.delete({ where: { id } });
};
