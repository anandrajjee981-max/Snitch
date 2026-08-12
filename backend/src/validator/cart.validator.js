import { body, param } from 'express-validator';
// ⚠️ Also added .js extensions here to prevent your previous ESM import error:
import cartModel from '../models/cart.model.js';
import productModel from '../models/Product.model.js';

export const cartValidator = [
    param('productid').custom(async (value, { req }) => {
        const product = await productModel.findById(value);
        if (!product) {
            throw new Error('Invalid product ID');
        }
        return true;
    }), 

    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
];