import productmodel from '../models/Product.model.js';

export async function getstock(productid, origin) {
  try {
    if (origin === 'Main') {
      const product = await productmodel.findById(productid);
      return product?.stock ?? 0;
    }

    if (origin === 'Variant') {
      const product = await productmodel.findOne({
        variants: { $elemMatch: { _id: productid } }
      });

      if (!product) {
        return 0;
      }

      const variant = product.variants.find((item) => item._id.toString() === productid);
      return variant?.stock ?? 0;
    }

    return 0;
  } catch (err) {
    console.error('Error in getstock:', err);
    return 0;
  }
}








