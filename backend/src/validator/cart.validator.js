import { body, validationResult } from 'express-validator';
// ⚠️ Also added .js extensions here to prevent your previous ESM import error:
import cartModel from '../models/cart.model.js';
import productModel from '../models/product.model.js';

export const cartValidator = [
    body('productid').custom(async (value, { req }) => {
        const product = await productModel.findById(value);
        if (!product) {
            throw new Error('Invalid product ID');
        }
    }), 

    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
];