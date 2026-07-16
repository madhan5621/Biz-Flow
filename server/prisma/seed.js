import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ─── Create Admin User ──────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bizflow.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@bizflow.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  const manager = await prisma.user.upsert({
    where: { email: 'manager@bizflow.com' },
    update: {},
    create: {
      name: 'Sarah Manager',
      email: 'manager@bizflow.com',
      password: hashedPassword,
      role: 'MANAGER',
    },
  });
  console.log(`✅ Manager user: ${manager.email}`);

  const employee = await prisma.user.upsert({
    where: { email: 'employee@bizflow.com' },
    update: {},
    create: {
      name: 'John Employee',
      email: 'employee@bizflow.com',
      password: hashedPassword,
      role: 'EMPLOYEE',
    },
  });
  console.log(`✅ Employee user: ${employee.email}`);

  // ─── Company Settings ───────────────────────────────────────────────────
  const settings = await prisma.companySettings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      businessName: 'BizFlow Technologies',
      email: 'contact@bizflow.com',
      phone: '+91 98765 43210',
      address: '123 Business Park, Mumbai, Maharashtra 400001',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
    },
  });
  console.log(`✅ Company settings created`);

  // ─── Categories ─────────────────────────────────────────────────────────
  const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories' },
    { name: 'Office Supplies', slug: 'office-supplies', description: 'Stationery and office equipment' },
    { name: 'Furniture', slug: 'furniture', description: 'Office and home furniture' },
    { name: 'Software', slug: 'software', description: 'Software licenses and subscriptions' },
    { name: 'Networking', slug: 'networking', description: 'Network equipment and cables' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${categories.length} categories created`);

  // ─── Suppliers ──────────────────────────────────────────────────────────
  const suppliers = [
    { name: 'TechWorld Supplies', email: 'sales@techworld.com', phone: '+91 98765 11111', company: 'TechWorld Pvt Ltd', gstNumber: '27AABCT1234A1Z5', city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Office Mart', email: 'orders@officemart.com', phone: '+91 98765 22222', company: 'Office Mart India', gstNumber: '29AADCO5678B1Z3', city: 'Bangalore', state: 'Karnataka' },
    { name: 'FurniCraft', email: 'info@furnicraft.com', phone: '+91 98765 33333', company: 'FurniCraft Industries', gstNumber: '33AAGCF9012C1Z1', city: 'Chennai', state: 'Tamil Nadu' },
  ];

  for (const sup of suppliers) {
    await prisma.supplier.upsert({
      where: { email: sup.email },
      update: {},
      create: sup,
    });
  }
  console.log(`✅ ${suppliers.length} suppliers created`);

  // ─── Employees ──────────────────────────────────────────────────────────
  const employees = [
    { name: 'Rahul Sharma', email: 'rahul@bizflow.com', phone: '+91 98765 10001', department: 'Engineering', position: 'Senior Developer', salary: 120000, joiningDate: new Date('2023-03-15'), status: 'ACTIVE', attendanceRate: 96.5, performanceRate: 4.2 },
    { name: 'Priya Patel', email: 'priya@bizflow.com', phone: '+91 98765 10002', department: 'Marketing', position: 'Marketing Manager', salary: 95000, joiningDate: new Date('2023-06-01'), status: 'ACTIVE', attendanceRate: 98.0, performanceRate: 4.5 },
    { name: 'Amit Kumar', email: 'amit@bizflow.com', phone: '+91 98765 10003', department: 'Sales', position: 'Sales Executive', salary: 60000, joiningDate: new Date('2024-01-10'), status: 'ACTIVE', attendanceRate: 92.0, performanceRate: 3.8 },
    { name: 'Sneha Reddy', email: 'sneha@bizflow.com', phone: '+91 98765 10004', department: 'Human Resources', position: 'HR Lead', salary: 85000, joiningDate: new Date('2023-09-20'), status: 'ACTIVE', attendanceRate: 97.0, performanceRate: 4.0 },
    { name: 'Vikram Singh', email: 'vikram@bizflow.com', phone: '+91 98765 10005', department: 'Finance', position: 'Accountant', salary: 70000, joiningDate: new Date('2024-04-05'), status: 'ACTIVE', attendanceRate: 94.5, performanceRate: 3.9 },
  ];

  for (const emp of employees) {
    await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: emp,
    });
  }
  console.log(`✅ ${employees.length} employees created`);

  // ─── Customers ──────────────────────────────────────────────────────────
  const customers = [
    { name: 'Acme Corporation', email: 'purchase@acme.com', phone: '+91 22 1234 5678', company: 'Acme Corp', gstNumber: '27AAACA1234A1Z5', city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Global Tech Solutions', email: 'billing@globaltech.com', phone: '+91 80 2345 6789', company: 'Global Tech', gstNumber: '29AADCG5678B1Z3', city: 'Bangalore', state: 'Karnataka' },
    { name: 'Star Enterprises', email: 'accounts@starenterprises.com', phone: '+91 44 3456 7890', company: 'Star Enterprises', gstNumber: '33AAGCS9012C1Z1', city: 'Chennai', state: 'Tamil Nadu' },
    { name: 'Pinnacle Industries', email: 'info@pinnacle.com', phone: '+91 11 4567 8901', company: 'Pinnacle Ltd', gstNumber: '07AADCP3456D1Z7', city: 'Delhi', state: 'Delhi' },
  ];

  for (const cust of customers) {
    await prisma.customer.upsert({
      where: { email: cust.email },
      update: {},
      create: cust,
    });
  }
  console.log(`✅ ${customers.length} customers created`);

  // ─── Products ───────────────────────────────────────────────────────────
  const electronicsCategory = await prisma.category.findUnique({ where: { slug: 'electronics' } });
  const officeCategory = await prisma.category.findUnique({ where: { slug: 'office-supplies' } });
  const softwareCategory = await prisma.category.findUnique({ where: { slug: 'software' } });
  const techSupplier = await prisma.supplier.findUnique({ where: { email: 'sales@techworld.com' } });
  const officeSupplier = await prisma.supplier.findUnique({ where: { email: 'orders@officemart.com' } });

  const products = [
    { name: 'Laptop Pro 15"', sku: 'ELEC-LP-001', barcode: '8901234567890', buyingPrice: 55000, sellingPrice: 72000, stock: 25, minStock: 5, categoryId: electronicsCategory.id, supplierId: techSupplier.id },
    { name: 'Wireless Mouse', sku: 'ELEC-WM-002', barcode: '8901234567891', buyingPrice: 500, sellingPrice: 899, stock: 150, minStock: 20, categoryId: electronicsCategory.id, supplierId: techSupplier.id },
    { name: 'USB-C Hub', sku: 'ELEC-UH-003', barcode: '8901234567892', buyingPrice: 1200, sellingPrice: 1999, stock: 80, minStock: 10, categoryId: electronicsCategory.id, supplierId: techSupplier.id },
    { name: 'A4 Paper (500 sheets)', sku: 'OFF-A4-001', barcode: '8901234567893', buyingPrice: 180, sellingPrice: 299, stock: 200, minStock: 30, categoryId: officeCategory.id, supplierId: officeSupplier.id },
    { name: 'Premium Pen Set', sku: 'OFF-PS-002', barcode: '8901234567894', buyingPrice: 350, sellingPrice: 599, stock: 100, minStock: 15, categoryId: officeCategory.id, supplierId: officeSupplier.id },
    { name: 'Project Management License', sku: 'SOFT-PM-001', barcode: '8901234567895', buyingPrice: 8000, sellingPrice: 12000, stock: 50, minStock: 5, categoryId: softwareCategory.id },
    { name: 'Monitor 27" 4K', sku: 'ELEC-MN-004', barcode: '8901234567896', buyingPrice: 22000, sellingPrice: 32000, stock: 3, minStock: 5, categoryId: electronicsCategory.id, supplierId: techSupplier.id },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {},
      create: prod,
    });
  }
  console.log(`✅ ${products.length} products created`);

  // ─── Expenses ───────────────────────────────────────────────────────────
  const expenses = [
    { title: 'Office Rent - July', amount: 85000, category: 'Office Rent', date: new Date('2024-07-01') },
    { title: 'Internet Bill - July', amount: 3500, category: 'Internet', date: new Date('2024-07-05') },
    { title: 'Electricity Bill - July', amount: 12000, category: 'Electricity', date: new Date('2024-07-10') },
    { title: 'Team Lunch', amount: 4500, category: 'Travel', date: new Date('2024-07-12') },
    { title: 'Google Ads Campaign', amount: 25000, category: 'Marketing', date: new Date('2024-07-15') },
    { title: 'AC Maintenance', amount: 8000, category: 'Maintenance', date: new Date('2024-07-18') },
  ];

  for (const exp of expenses) {
    await prisma.expense.create({ data: exp });
  }
  console.log(`✅ ${expenses.length} expenses created`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin:    admin@bizflow.com    / admin123');
  console.log('   Manager:  manager@bizflow.com  / admin123');
  console.log('   Employee: employee@bizflow.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
