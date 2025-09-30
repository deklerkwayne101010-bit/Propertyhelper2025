import Joi from 'joi';
import { z } from 'zod';

// User validation schemas
export const userRegistrationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)')).required().messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.max': 'First name cannot exceed 50 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.max': 'Last name cannot exceed 50 characters',
    'any.required': 'Last name is required'
  }),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).allow('').optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  })
});

export const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

export const userUpdateSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).optional().messages({
    'string.max': 'First name cannot exceed 50 characters'
  }),
  lastName: Joi.string().trim().min(1).max(50).optional().messages({
    'string.max': 'Last name cannot exceed 50 characters'
  }),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).allow('').optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  }),
  avatar: Joi.string().uri().optional().messages({
    'string.uri': 'Avatar must be a valid URL'
  })
});

// Property validation schemas
export const propertyCreateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    'string.empty': 'Property title is required',
    'string.max': 'Title cannot exceed 200 characters',
    'any.required': 'Property title is required'
  }),
  description: Joi.string().max(5000).allow('').optional().messages({
    'string.max': 'Description cannot exceed 5000 characters'
  }),
  price: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'Price must be a positive number',
    'any.required': 'Property price is required'
  }),
  propertyType: Joi.string().valid('HOUSE', 'APARTMENT', 'TOWNHOUSE', 'LAND', 'COMMERCIAL', 'INDUSTRIAL', 'OTHER').required().messages({
    'any.only': 'Please select a valid property type',
    'any.required': 'Property type is required'
  }),
  status: Joi.string().valid('DRAFT', 'ACTIVE', 'PENDING', 'SOLD', 'RENTED', 'INACTIVE').default('DRAFT'),
  address: Joi.string().trim().min(1).max(200).required().messages({
    'string.empty': 'Property address is required',
    'string.max': 'Address cannot exceed 200 characters',
    'any.required': 'Property address is required'
  }),
  city: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'City is required',
    'string.max': 'City cannot exceed 100 characters',
    'any.required': 'City is required'
  }),
  province: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Province is required',
    'string.max': 'Province cannot exceed 100 characters',
    'any.required': 'Province is required'
  }),
  postalCode: Joi.string().pattern(/^\d{4}$/).optional().messages({
    'string.pattern.base': 'Postal code must be 4 digits'
  }),
  bedrooms: Joi.number().integer().min(0).max(50).optional(),
  bathrooms: Joi.number().min(0).max(50).precision(1).optional(),
  garages: Joi.number().integer().min(0).max(20).optional(),
  floorSize: Joi.number().positive().precision(2).optional().messages({
    'number.positive': 'Floor size must be a positive number'
  }),
  landSize: Joi.number().positive().precision(2).optional().messages({
    'number.positive': 'Land size must be a positive number'
  }),
  yearBuilt: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
  features: Joi.array().items(Joi.string()).optional()
});

export const propertyUpdateSchema = propertyCreateSchema.fork(['title', 'price', 'propertyType', 'address', 'city', 'province'], (schema) => schema.optional());

// Zod schemas for runtime validation
export const userRegistrationZodSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  firstName: z.string().trim().min(1, 'First name is required').max(50, 'First name cannot exceed 50 characters'),
  lastName: z.string().trim().min(1, 'Last name is required').max(50, 'Last name cannot exceed 50 characters'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number').optional().or(z.literal(''))
});

export const userLoginZodSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const propertyCreateZodSchema = z.object({
  title: z.string().trim().min(1, 'Property title is required').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().max(5000, 'Description cannot exceed 5000 characters').optional(),
  price: z.number().positive('Price must be a positive number'),
  propertyType: z.enum(['HOUSE', 'APARTMENT', 'TOWNHOUSE', 'LAND', 'COMMERCIAL', 'INDUSTRIAL', 'OTHER']),
  status: z.enum(['DRAFT', 'ACTIVE', 'PENDING', 'SOLD', 'RENTED', 'INACTIVE']).default('DRAFT'),
  address: z.string().trim().min(1, 'Property address is required').max(200, 'Address cannot exceed 200 characters'),
  city: z.string().trim().min(1, 'City is required').max(100, 'City cannot exceed 100 characters'),
  province: z.string().trim().min(1, 'Province is required').max(100, 'Province cannot exceed 100 characters'),
  postalCode: z.string().regex(/^\d{4}$/, 'Postal code must be 4 digits').optional(),
  bedrooms: z.number().int().min(0).max(50).optional(),
  bathrooms: z.number().min(0).max(50).optional(),
  garages: z.number().int().min(0).max(20).optional(),
  floorSize: z.number().positive('Floor size must be a positive number').optional(),
  landSize: z.number().positive('Land size must be a positive number').optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  features: z.array(z.string()).optional()
});

// Template validation schemas
export const templateCreateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Template name is required',
    'string.max': 'Template name cannot exceed 100 characters',
    'any.required': 'Template name is required'
  }),
  description: Joi.string().max(500).allow('').optional(),
  category: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'Template category is required',
    'string.max': 'Category cannot exceed 50 characters',
    'any.required': 'Template category is required'
  }),
  data: Joi.object().required().messages({
    'any.required': 'Template data is required'
  }),
  isPublic: Joi.boolean().default(false),
  tags: Joi.array().items(Joi.string().trim().max(30)).max(10).optional()
});

// Credit system validation schemas
export const creditPurchaseSchema = Joi.object({
  amount: Joi.number().integer().positive().min(100).max(10000).required().messages({
    'number.positive': 'Credit amount must be positive',
    'number.min': 'Minimum purchase is 100 credits',
    'number.max': 'Maximum purchase is 10,000 credits',
    'any.required': 'Credit amount is required'
  }),
  paymentMethod: Joi.string().valid('CARD', 'BANK_TRANSFER', 'PAYPAL').required().messages({
    'any.only': 'Please select a valid payment method',
    'any.required': 'Payment method is required'
  })
});

// Lead validation schemas
export const leadCreateSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.max': 'First name cannot exceed 50 characters',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().trim().max(50).allow('').optional(),
  email: Joi.string().email().allow('').optional().messages({
    'string.email': 'Please provide a valid email address'
  }),
  phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]+$/).allow('').optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  }),
  source: Joi.string().valid('WEBSITE', 'WHATSAPP', 'PROPERTY24', 'REFERRAL', 'SOCIAL_MEDIA', 'DIRECT', 'OTHER').default('WEBSITE'),
  notes: Joi.string().max(1000).allow('').optional(),
  propertyId: Joi.string().uuid().optional()
});

// Campaign validation schemas
export const campaignCreateSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    'string.empty': 'Campaign name is required',
    'string.max': 'Campaign name cannot exceed 100 characters',
    'any.required': 'Campaign name is required'
  }),
  description: Joi.string().max(500).allow('').optional(),
  type: Joi.string().valid('EMAIL', 'WHATSAPP', 'SMS', 'SOCIAL_MEDIA').required().messages({
    'any.only': 'Please select a valid campaign type',
    'any.required': 'Campaign type is required'
  }),
  budget: Joi.number().positive().precision(2).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional().messages({
    'date.min': 'End date must be after start date'
  })
});

// Validation middleware factory
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors
        }
      });
    }

    req.body = value;
    next();
  };
};

// Zod validation middleware factory
export const validateBodyZod = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));

        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            details: errors
          }
        });
      }
      next(error);
    }
  };
};