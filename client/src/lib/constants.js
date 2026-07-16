/**
 * Application-wide constants.
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'BizFlow';

export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  EMPLOYEE: 'EMPLOYEE',
};

export const INVOICE_STATUS = {
  PAID: 'PAID',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
};

export const EMPLOYEE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ON_LEAVE: 'ON_LEAVE',
  TERMINATED: 'TERMINATED',
};

export const EXPENSE_CATEGORIES = [
  'Office Rent',
  'Salary',
  'Internet',
  'Electricity',
  'Travel',
  'Marketing',
  'Maintenance',
  'Software',
  'Equipment',
  'Other',
];

export const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Support',
  'Design',
  'Product',
  'Legal',
];

export const CURRENCY = {
  code: 'INR',
  symbol: '₹',
  locale: 'en-IN',
};

export const PAGINATION = {
  defaultPage: 1,
  defaultLimit: 10,
  limitOptions: [10, 25, 50, 100],
};
