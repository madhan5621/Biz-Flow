import config from '../config/index.js';

/**
 * Parse pagination parameters from query string.
 * Enforces min/max bounds to prevent abuse.
 */
export const parsePagination = (query) => {
  let page = parseInt(query.page, 10) || config.pagination.defaultPage;
  let limit = parseInt(query.limit, 10) || config.pagination.defaultLimit;

  page = Math.max(1, page);
  limit = Math.min(Math.max(1, limit), config.pagination.maxLimit);

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Parse sorting parameters from query string.
 * Format: ?sortBy=field&sortOrder=asc|desc
 */
export const parseSorting = (query, allowedFields = []) => {
  const sortBy = allowedFields.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

  return { [sortBy]: sortOrder };
};
