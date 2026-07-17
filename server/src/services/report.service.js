import prisma from '../config/db.js';

/**
 * Revenue report — monthly revenue, expenses, and profit.
 */
export const getRevenueReport = async (query) => {
  const months = parseInt(query.months, 10) || 12;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - (months - 1));
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const revenueData = await prisma.$queryRaw`
    SELECT
      TO_CHAR("invoiceDate", 'YYYY-MM') as month,
      TO_CHAR("invoiceDate", 'Mon YYYY') as label,
      COALESCE(SUM(CASE WHEN status = 'PAID' THEN "grandTotal" ELSE 0 END), 0)::float as revenue,
      COUNT(*)::int as "invoiceCount"
    FROM invoices
    WHERE "invoiceDate" >= ${startDate}
    GROUP BY month, label
    ORDER BY month
  `;

  const expenseData = await prisma.$queryRaw`
    SELECT
      TO_CHAR(date, 'YYYY-MM') as month,
      COALESCE(SUM(amount), 0)::float as expenses
    FROM expenses
    WHERE date >= ${startDate}
    GROUP BY month
    ORDER BY month
  `;

  const expenseMap = {};
  for (const e of expenseData) {
    expenseMap[e.month] = e.expenses;
  }

  const result = revenueData.map((r) => ({
    ...r,
    expenses: expenseMap[r.month] || 0,
    profit: r.revenue - (expenseMap[r.month] || 0),
  }));

  const totals = result.reduce(
    (acc, r) => ({
      revenue: acc.revenue + r.revenue,
      expenses: acc.expenses + r.expenses,
      profit: acc.profit + r.profit,
      invoiceCount: acc.invoiceCount + r.invoiceCount,
    }),
    { revenue: 0, expenses: 0, profit: 0, invoiceCount: 0 }
  );

  return { data: result, totals };
};

/**
 * Expense breakdown by category.
 */
export const getExpenseReport = async () => {
  const data = await prisma.$queryRaw`
    SELECT
      category as name,
      SUM(amount)::float as value,
      COUNT(*)::int as count
    FROM expenses
    GROUP BY category
    ORDER BY value DESC
  `;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return { data, total };
};

/**
 * Product performance report — top sellers, low stock.
 */
export const getProductReport = async () => {
  const topSellers = await prisma.$queryRaw`
    SELECT
      p.id, p.name, p.sku, p."sellingPrice"::float as price, p.stock,
      COALESCE(SUM(ii.quantity), 0)::int as "totalSold",
      COALESCE(SUM(ii.total), 0)::float as "totalRevenue"
    FROM products p
    LEFT JOIN invoice_items ii ON ii."productId" = p.id
    WHERE p."isActive" = true
    GROUP BY p.id, p.name, p.sku, p."sellingPrice", p.stock
    ORDER BY "totalSold" DESC
    LIMIT 10
  `;

  const lowStock = await prisma.$queryRaw`
    SELECT id, name, sku, stock, "minStock", "sellingPrice"::float as price
    FROM products
    WHERE "isActive" = true AND stock <= "minStock"
    ORDER BY stock ASC
  `;

  const totalProducts = await prisma.product.count({ where: { isActive: true } });
  const totalStockValue = await prisma.$queryRaw`
    SELECT COALESCE(SUM("sellingPrice" * stock), 0)::float as value
    FROM products
    WHERE "isActive" = true
  `;

  return {
    topSellers,
    lowStock,
    totalProducts,
    totalStockValue: totalStockValue[0]?.value || 0,
  };
};

/**
 * Export report data as CSV string.
 */
export const exportReportCSV = async (type) => {
  let rows = [];
  let headers = [];

  if (type === 'revenue') {
    const { data } = await getRevenueReport({ months: 12 });
    headers = ['Month', 'Revenue', 'Expenses', 'Profit', 'Invoices'];
    rows = data.map((r) => [r.label, r.revenue, r.expenses, r.profit, r.invoiceCount]);
  } else if (type === 'expenses') {
    const { data } = await getExpenseReport();
    headers = ['Category', 'Amount', 'Count'];
    rows = data.map((r) => [r.name, r.value, r.count]);
  } else if (type === 'products') {
    const { topSellers } = await getProductReport();
    headers = ['Name', 'SKU', 'Price', 'Stock', 'Sold', 'Revenue'];
    rows = topSellers.map((p) => [p.name, p.sku, p.price, p.stock, p.totalSold, p.totalRevenue]);
  }

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  return csv;
};
