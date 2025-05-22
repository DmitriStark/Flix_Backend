const Joi = require('joi');

class ValidationHelper {
  validateRegistration(data) {
    const schema = Joi.object({
      username: Joi.string()
        .min(8)
        .pattern(/^[A-Za-z]+$/)
        .required()
        .messages({
          'string.min': 'Username must be at least 8 characters',
          'string.pattern.base': 'Username must contain only letters (A-Z, a-z)',
          'any.required': 'Username is required'
        }),
      password: Joi.string()
        .min(6)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
          'string.min': 'Password must be at least 6 characters',
          'string.pattern.base': 'Password must contain uppercase, lowercase, number and special character',
          'any.required': 'Password is required'
        })
    });

    return schema.validate(data, { abortEarly: false });
  }

  validateLogin(data) {
    const schema = Joi.object({
      username: Joi.string()
        .min(8)
        .pattern(/^[A-Za-z]+$/)
        .required()
        .messages({
          'string.min': 'Username must be at least 8 characters',
          'string.pattern.base': 'Username must contain only letters',
          'any.required': 'Username is required'
        }),
      password: Joi.string()
        .min(6)
        .required()
        .messages({
          'string.min': 'Password must be at least 6 characters',
          'any.required': 'Password is required'
        })
    });

    return schema.validate(data, { abortEarly: false });
  }

  validateMovieSearch(data) {
    const schema = Joi.object({
      search: Joi.string()
        .min(1)
        .required()
        .messages({
          'string.min': 'Search term must not be empty',
          'any.required': 'Search term is required'
        }),
      type: Joi.string()
        .valid('movie', 'series', 'episode')
        .default('movie')
        .messages({
          'any.only': 'Type must be movie, series, or episode'
        }),
      year: Joi.number()
        .integer()
        .min(1900)
        .max(new Date().getFullYear() + 1)
        .optional()
        .messages({
          'number.min': 'Year must be after 1900',
          'number.max': 'Year cannot be in the future'
        }),
      page: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(1)
        .messages({
          'number.min': 'Page must be at least 1',
          'number.max': 'Page cannot exceed 100'
        })
    });

    return schema.validate(data, { abortEarly: false });
  }

  validateImdbId(data) {
    const schema = Joi.object({
      imdbID: Joi.string()
        .pattern(/^tt\d+$/)
        .required()
        .messages({
          'string.pattern.base': 'Invalid IMDB ID format',
          'any.required': 'IMDB ID is required'
        })
    });

    return schema.validate(data, { abortEarly: false });
  }
}

module.exports = new ValidationHelper();