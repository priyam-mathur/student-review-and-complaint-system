import { ApiError } from '../utils/ApiError.js';

/**
 * Request validation middleware using Joi schemas.
 * Validates body, query, and params against provided schema.
 *
 * Usage: validate(schema) where schema = { body, query, params }
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    ['body', 'query', 'params'].forEach((key) => {
      if (schema[key]) {
        const { error } = schema[key].validate(req[key], {
          abortEarly: false,
          stripUnknown: true,
          errors: { wrap: { label: false } },
        });

        if (error) {
          error.details.forEach((detail) => {
            errors.push({
              field: detail.path.join('.'),
              message: detail.message,
            });
          });
        } else {
          // Replace req[key] with validated/stripped data
          req[key] = schema[key].validate(req[key], { stripUnknown: true }).value;
        }
      }
    });

    if (errors.length > 0) {
      return next(ApiError.badRequest('Validation failed', errors));
    }

    next();
  };
};
