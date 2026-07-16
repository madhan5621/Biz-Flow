import { clsx } from 'clsx';
import { CURRENCY } from './constants';

/**
 * Merge class names conditionally (wrapper around clsx for consistency).
 */
export const cn = (...inputs) => clsx(inputs);

/**
 * Format currency value.
 */
export const formatCurrency = (value) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return `${CURRENCY.symbol}0.00`;

  return new Intl.NumberFormat(CURRENCY.locale, {
    style: 'currency',
    currency: CURRENCY.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Format a date string to locale-friendly display.
 */
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(date);
};

/**
 * Format a number with commas.
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Get initials from a name (for avatars).
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Truncate a string with ellipsis.
 */
export const truncate = (str, length = 50) => {
  if (!str) return '';
  return str.length > length ? `${str.slice(0, length)}...` : str;
};

/**
 * Generate a random color for avatars.
 */
export const getAvatarColor = (name) => {
  const colors = [
    'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
    'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
    'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
    'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  ];
  const index = (name || '').charCodeAt(0) % colors.length;
  return colors[index];
};

/**
 * Debounce a function.
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Build query string from an object, omitting empty values.
 */
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
};

/**
 * Relative time display (e.g., "2 hours ago").
 */
export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};
