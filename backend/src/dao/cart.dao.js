import productmodel from '../models/Product.model.js';
import cartModel from '../models/cart.model.js';

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

export async function aggregationResult(userid){
 const cart = await CartModel.aggregate([
      { $match: { user: userid } },
      { $unwind: { path: '$items', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'products',
          let: {
            selectedId: '$items.productid',
            origin: '$items.origin'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ['$$origin', 'Main'] },
                        { $eq: [{ $toString: '$_id' }, '$$selectedId'] }
                      ]
                    },
                    {
                      $and: [
                        { $eq: ['$$origin', 'Variant'] },
                        {
                          $in: [
                            '$$selectedId',
                            {
                              $map: {
                                input: '$variants',
                                as: 'variant',
                                in: { $toString: '$$variant._id' }
                              }
                            }
                          ]
                        }
                      ]
                    }
                  ]
                }
              }
            }
          ],
          as: 'productcart'
        }
      },
      {
        $addFields: {
          productcart: { $ifNull: [{ $arrayElemAt: ['$productcart', 0] }, null] }
        }
      },
      {
        $addFields: {
          'items.itemTotal': {
            $multiply: [
              {
                $ifNull: ['$productcart.productprice.price', '$items.price']
              },
              '$items.quantity'
            ]
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          user: { $first: '$user' },
          items: { $push: '$items' },
          totalQuantity: { $sum: '$items.quantity' },
          totalCartAmount: { $sum: '$items.itemTotal' },
          currency: { $first: '$productcart.productprice.currency' },
          __v: { $first: '$__v' }
        }
      }
    ], { maxTimeMS: 60000, allowDiskUse: true });
return cart

}