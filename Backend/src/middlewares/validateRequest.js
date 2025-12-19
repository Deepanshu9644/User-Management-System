const Joi = require('joi');

function toDetails(joiError) {
  return (joiError?.details || []).map((d) => ({
    field: d.path.join('.'),
    message: d.message
  }));
}

const validateRequest = (schemas = {}) => {
  return (req, res, next) => {
    try {
      const options = { abortEarly: false, stripUnknown: true, convert: true };

      if (schemas.params) {
        const { error, value } = schemas.params.validate(req.params, options);
        if (error) {
          return res.status(400).json({
            success: false,
            message: 'Invalid request params',
            errors: toDetails(error)
          });
        }
        req.params = value;
      }

      if (schemas.query) {
        const { error, value } = schemas.query.validate(req.query, options);
        if (error) {
          return res.status(400).json({
            success: false,
            message: 'Invalid query params',
            errors: toDetails(error)
          });
        }
        req.query = value;
      }

      if (schemas.body) {
        const { error, value } = schemas.body.validate(req.body, options);
        if (error) {
          return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: toDetails(error)
          });
        }
        req.body = value;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { validateRequest, Joi };
