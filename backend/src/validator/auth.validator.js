import { body, validationResult } from 'express-validator';
import User  from '../models/User.model.js'; 

export const registerValidator = [
  // 1. Username validation
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),

  // 2. Email validation + Unique check
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail() // Normalizes formats (e.g., converts to lowercase)
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Email is already registered');
      }
      return true;
    }),

  // 3. Password validation
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  // 4. Phone number validation + Unique check
  body('phonenumber')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .isNumeric().withMessage('Phone number must contain only numbers')
    .isLength({ min: 10, max: 15 }).withMessage('Phone number must be between 10 and 15 digits')
    .custom(async (value) => {
      const user = await User.findOne({ phonenumber: Number(value) });
      if (user) {
        throw new Error('Phone number is already registered');
      }
      return true;
    }),

  // 5. Role validation (matching your enum: ["buyer", "seller"])
  body('role')
    .optional() // Because you have a default value "buyer" in Mongoose
    .trim()
    .isIn(['buyer', 'seller']).withMessage('Role must be either "buyer" or "seller"'),

  // 6. Middleware to intercept errors and return them cleanly
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().map(err => ({ field: err.path, message: err.msg })) 
      });
    }
    next();
  }
];











