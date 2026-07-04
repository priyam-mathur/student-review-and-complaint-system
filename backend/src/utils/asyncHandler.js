/**
 * Wraps async route handlers to eliminate repetitive try/catch blocks.
 * Catches any thrown error and passes it to the Express error middleware.
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
