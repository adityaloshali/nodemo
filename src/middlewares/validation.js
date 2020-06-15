const ValidationError = require('../errors/validation-error');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    const valid = error === undefined;

    if (valid) {
      next();
    } else {
      const { details } = error;

      const message = details.map(info => info.message).join(',');

      console.log('validate error', message);

      next(new ValidationError(message));
    }
  };
};

module.exports = validate;

