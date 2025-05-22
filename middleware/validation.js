const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Z])(?=.*[a-z]).*$/)
    .required()
    .messages({
      "string.min": "Username must be at least 8 characters",
      "string.pattern.base":
        "Username must contain uppercase and lowercase letters",
      "any.required": "Username is required",
    }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),

  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character",
      "any.required": "Password is required",
    }),
});

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username is required",
    "string.empty": "Username cannot be empty",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  }),
});

const movieSearchSchema = Joi.object({
  search: Joi.string().optional(),
  type: Joi.string().valid("movie", "series", "episode").optional(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
});

const validate = (schema) => {
  return (req, res, next) => {
    console.log("Validating data:", req.body);

    const dataToValidate = req.method === "GET" ? req.query : req.body;
    const { error } = schema.validate(dataToValidate);

    if (error) {
      console.log("Validation error:", error.details);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        errors: error.details.map((detail) => ({
          field: detail.path[0],
          message: detail.message,
        })),
      });
    }

    console.log("Validation passed");
    next();
  };
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
  validateMovieSearch: validate(movieSearchSchema),
};
