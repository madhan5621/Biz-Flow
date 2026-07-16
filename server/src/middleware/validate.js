import { sendError } from '../utils/response.js';

/**
 * Zod validation middleware factory.
 * Validates request body, query, or params against a Zod schema.
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));

      return sendError(res, {
        message: 'Validation failed',
        statusCode: 400,
        errors,
      });
    }

    // Replace with parsed (and potentially transformed) data
    req[source] = result.data;
    next();
  };
};

export default validate;
