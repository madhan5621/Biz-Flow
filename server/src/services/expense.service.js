import prisma from '../config/db.js';
import { NotFoundError } from '../utils/errors.js';
import { parsePagination, parseSorting } from '../utils/pagination.js';

/**
 * Get all expenses with search, filter, sort, and pagination.
 */
export const getExpenses = async (query) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSorting(query, [
    'title', 'amount', 'category', 'date', 'createdAt',
  ]);

  const where = {};

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { category: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.category) {
    where.category = query.category;
  }

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.expense.count({ where }),
  ]);

  return { expenses, total, page, limit };
};

/**
 * Get single expense by ID.
 */
export const getExpenseById = async (id) => {
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) {
    throw new NotFoundError('Expense');
  }
  return expense;
};

/**
 * Create a new expense.
 */
export const createExpense = async (data) => {
  const expense = await prisma.expense.create({
    data: {
      title: data.title,
      amount: data.amount,
      category: data.category,
      description: data.description || null,
      date: data.date ? new Date(data.date) : new Date(),
      receipt: data.receipt || null,
    },
  });

  return expense;
};

/**
 * Update an expense.
 */
export const updateExpense = async (id, data) => {
  await getExpenseById(id);

  const updateData = { ...data };
  if (updateData.date) {
    updateData.date = new Date(updateData.date);
  }
  if (updateData.description === '') updateData.description = null;
  if (updateData.receipt === '') updateData.receipt = null;

  const expense = await prisma.expense.update({
    where: { id },
    data: updateData,
  });

  return expense;
};

/**
 * Delete an expense.
 */
export const deleteExpense = async (id) => {
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) {
    throw new NotFoundError('Expense');
  }
  await prisma.expense.delete({ where: { id } });
};

/**
 * Get unique expense categories for filter.
 */
export const getExpenseCategories = async () => {
  const result = await prisma.expense.findMany({
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  });
  return result.map((r) => r.category);
};

/**
 * Get monthly expense breakdown.
 */
export const getMonthlyExpenses = async () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const data = await prisma.$queryRaw`
    SELECT
      TO_CHAR(date, 'YYYY-MM') as month,
      TO_CHAR(date, 'Mon') as label,
      COALESCE(SUM(amount), 0)::float as total
    FROM expenses
    WHERE date >= ${twelveMonthsAgo}
    GROUP BY month, label
    ORDER BY month
  `;

  return data;
};
