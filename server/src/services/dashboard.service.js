import prisma from '../config/db.js';

/**
 * Get overview statistics for the dashboard.
 */
export const getStats = async () => {
  const [
    totalRevenue,
    totalExpenses,
    totalCustomers,
    totalProducts,
    totalEmployees,
    totalInvoices,
    pendingInvoices,
    lowStockProducts,
  ] = await Promise.all([
    // Total revenue from paid invoices
    prisma.invoice.aggregate({
      _sum: { grandTotal: true },
      where: { status: 'PAID' },
    }),
    // Total expenses
    prisma.expense.aggregate({
      _sum: { amount: true },
    }),
    // Customer count
    prisma.customer.count(),
    // Product count
    prisma.product.count({ where: { isActive: true } }),
    // Employee count
    prisma.employee.count({ where: { status: 'ACTIVE' } }),
    // Total invoices
    prisma.invoice.count(),
    // Pending invoices
    prisma.invoice.count({ where: { status: 'PENDING' } }),
    // Low stock products
    prisma.product.count({
      where: {
        isActive: true,
        stock: { lte: prisma.product.fields?.minStock ?? 5 },
      },
    }),
  ]);

  const revenue = Number(totalRevenue._sum.grandTotal || 0);
  const expenses = Number(totalExpenses._sum.amount || 0);
  const profit = revenue - expenses;

  // Get low stock count via raw comparison
  const lowStock = await prisma.$queryRaw`
    SELECT COUNT(*)::int as count FROM products WHERE "isActive" = true AND stock <= "minStock"
  `;

  return {
    revenue,
    expenses,
    profit,
    profitMargin: revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0,
    totalCustomers,
    totalProducts,
    totalEmployees,
    totalInvoices,
    pendingInvoices,
    lowStockCount: lowStock[0]?.count || 0,
  };
};

/**
 * Get monthly revenue data for chart (last 12 months).
 */
export const getRevenueChart = async () => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  // Get monthly revenue from paid invoices
  const revenueData = await prisma.$queryRaw`
    SELECT
      TO_CHAR("invoiceDate", 'YYYY-MM') as month,
      TO_CHAR("invoiceDate", 'Mon') as label,
      EXTRACT(YEAR FROM "invoiceDate")::int as year,
      EXTRACT(MONTH FROM "invoiceDate")::int as month_num,
      COALESCE(SUM(CASE WHEN status = 'PAID' THEN "grandTotal" ELSE 0 END), 0)::float as revenue,
      COALESCE(SUM("grandTotal"), 0)::float as total
    FROM invoices
    WHERE "invoiceDate" >= ${twelveMonthsAgo}
    GROUP BY month, label, year, month_num
    ORDER BY year, month_num
  `;

  // Get monthly expenses
  const expenseData = await prisma.$queryRaw`
    SELECT
      TO_CHAR(date, 'YYYY-MM') as month,
      COALESCE(SUM(amount), 0)::float as expenses
    FROM expenses
    WHERE date >= ${twelveMonthsAgo}
    GROUP BY month
    ORDER BY month
  `;

  // Build a map of 12 months
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('en', { month: 'short' });
    months.push({ month: key, label, revenue: 0, expenses: 0, profit: 0 });
  }

  // Fill in revenue
  const revenueMap = {};
  for (const r of revenueData) {
    revenueMap[r.month] = r.revenue;
  }

  // Fill in expenses
  const expenseMap = {};
  for (const e of expenseData) {
    expenseMap[e.month] = e.expenses;
  }

  // Merge
  for (const m of months) {
    m.revenue = revenueMap[m.month] || 0;
    m.expenses = expenseMap[m.month] || 0;
    m.profit = m.revenue - m.expenses;
  }

  return months;
};

/**
 * Get expense breakdown by category.
 */
export const getExpenseChart = async () => {
  const result = await prisma.$queryRaw`
    SELECT
      category as name,
      SUM(amount)::float as value
    FROM expenses
    GROUP BY category
    ORDER BY value DESC
  `;

  return result;
};

/**
 * Get recent activity logs.
 */
export const getRecentActivities = async (limit = 10) => {
  const activities = await prisma.activityLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { id: true, name: true, avatar: true, role: true },
      },
    },
  });

  return activities;
};

/**
 * Get top selling products (by quantity sold from invoice items).
 */
export const getTopProducts = async (limit = 5) => {
  const products = await prisma.$queryRaw`
    SELECT
      p.id,
      p.name,
      p.sku,
      p.image,
      p."sellingPrice"::float as price,
      p.stock,
      COALESCE(SUM(ii.quantity), 0)::int as "totalSold",
      COALESCE(SUM(ii.total), 0)::float as "totalRevenue"
    FROM products p
    LEFT JOIN invoice_items ii ON ii."productId" = p.id
    WHERE p."isActive" = true
    GROUP BY p.id, p.name, p.sku, p.image, p."sellingPrice", p.stock
    ORDER BY "totalSold" DESC
    LIMIT ${limit}
  `;

  return products;
};

/**
 * Get counts summary for quick reference.
 */
export const getQuickCounts = async () => {
  const [invoicesByStatus, recentInvoices] = await Promise.all([
    prisma.invoice.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.invoice.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        invoiceNumber: true,
        grandTotal: true,
        status: true,
        createdAt: true,
        customer: {
          select: { name: true, company: true },
        },
      },
    }),
  ]);

  return { invoicesByStatus, recentInvoices };
};
