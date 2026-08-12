import { body, param, validationResult } from 'express-validator';
import productModel from '../models/Product.model.js';

export const cartValidator = [
    param('productid').custom(async (value, { req }) => {
        const product = await productModel.findById(value);
        let variant = null;
        if (!product) {
            const variantProduct = await productModel.findOne({
                variants: { $elemMatch: { _id: value } }
            });
            if (variantProduct) {
                variant = true;
            }
        }
        if (!product && !variant) {
            throw new Error('Invalid product ID');
        }
        return true;
    }), 

    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];