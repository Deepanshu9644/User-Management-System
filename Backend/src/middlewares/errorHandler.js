function errorHandler(err, req, res, next) {
  // Handle invalid JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload',
      errors: [{ message: err.message }]
    });
  }

  // Sequelize unique constraint -> 409
  if (err?.name === 'SequelizeUniqueConstraintError') {
    const fields = err?.errors?.map((e) => e.path).filter(Boolean) || [];
    const isEmail = fields.includes('email');

    return res.status(409).json({
      success: false,
      message: isEmail ? 'Email already exists' : 'Unique constraint violation',
      errors:
        err?.errors?.map((e) => ({
          field: e.path,
          message: e.message
        })) || []
    });
  }

  // Sequelize validation -> 400
  if (err?.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors:
        err?.errors?.map((e) => ({
          field: e.path,
          message: e.message
        })) || []
    });
  }

  const statusCode = err.statusCode || err.status || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    errors: err.errors || []
  });
}

module.exports = errorHandler;
