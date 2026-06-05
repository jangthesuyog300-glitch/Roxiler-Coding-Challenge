const Joi = require('joi');

const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;

const schemas = {
  // Normal user signup
  register: Joi.object({
    name: Joi.string().min(20).max(60).required().messages({
      'string.min': 'Name must be at least 20 characters long',
      'string.max': 'Name cannot exceed 60 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address'
    }),
    password: Joi.string().min(8).max(16).pattern(passwordPattern).required().messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 16 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter and one special character'
    }),
    address: Joi.string().max(400).required().messages({
      'string.max': 'Address cannot exceed 400 characters'
    })
  }),

  // Admin creating a user (can specify role)
  adminCreateUser: Joi.object({
    name: Joi.string().min(20).max(60).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).pattern(passwordPattern).required().messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter and one special character'
    }),
    address: Joi.string().max(400).required(),
    role: Joi.string().valid('admin', 'user', 'store_owner').required()
  }),

  // Login schema
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Change password
  changePassword: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(16).pattern(passwordPattern).required().messages({
      'string.pattern.base': 'New password must contain at least one uppercase letter and one special character'
    })
  }),

  // Admin creating a store
  createStore: Joi.object({
    name: Joi.string().min(20).max(60).required().messages({
      'string.min': 'Store name must be at least 20 characters long',
      'string.max': 'Store name cannot exceed 60 characters'
    }),
    email: Joi.string().email().required(),
    address: Joi.string().max(400).required(),
    ownerId: Joi.string().uuid().required().messages({
      'string.guid': 'Please specify a valid Store Owner ID (UUID)'
    })
  }),

  // Submit / edit rating
  submitRating: Joi.object({
    storeId: Joi.string().uuid().required(),
    rating: Joi.number().integer().min(1).max(5).required().messages({
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot exceed 5'
    })
  })
};

const validateBody = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({ message: `Schema '${schemaName}' not found` });
    }

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const details = error.details.map(d => ({
        field: d.path[0],
        message: d.message
      }));
      return res.status(400).json({
        message: 'Validation failed',
        errors: details
      });
    }
    next();
  };
};

module.exports = {
  validateBody
};
