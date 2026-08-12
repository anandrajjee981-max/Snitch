import { getstock } from '../dao/cart.dao.js';
import CartModel from '../models/cart.model.js';
import productmodel from '../models/Product.model.js';

async function buildCartItemResponse(item) {
  const plainItem = item.toObject ? item.toObject() : item;

  if (plainItem.origin === 'Main') {
    const productDoc = await productmodel.findById(plainItem.productid).select('title description image productprice stock');

    return {
      ...plainItem,
      productDetails: productDoc ? {
        title: productDoc.title,
        description: productDoc.description,
        images: productDoc.image || [],
        price: productDoc.productprice?.price,
        currency: productDoc.productprice?.currency,
        stock: productDoc.stock
      } : null
    };
  }

  const productDoc = await productmodel.findOne({
    variants: { $elemMatch: { _id: plainItem.productid } }
  }).select('title description variants');

  const variant = productDoc?.variants?.find((itemVariant) => itemVariant._id.toString() === plainItem.productid.toString());

  return {
    ...plainItem,
    productDetails: productDoc && variant ? {
      title: productDoc.title,
      description: productDoc.description,
      images: (variant.images || []).map((image) => image.url),
      price: variant.productprice?.price,
      currency: variant.productprice?.currency,
      stock: variant.stock
    } : null
  };
}

export async function addtocart(req, res) {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: 'Quantity must be a positive integer'
      });
    }
    const productid = req.params.productid;

    const product = await productmodel.findById(productid);
    let variant = null;

    if (!product) {
      const variantProduct = await productmodel.findOne({
        variants: { $elemMatch: { _id: productid } }
      });

      if (variantProduct) {
        variant = variantProduct.variants.find((item) => item._id.toString() === productid);
      }
    }

    if (!product && !variant) {
      return res.status(404).json({
        message: 'product not found'
      });
    }

    let origin = 'Main';
    let price;

    if (product) {
      origin = 'Main';
      price = product.productprice?.price;
    } else {
      origin = 'Variant';
      price = variant?.productprice?.price;
    }

    const cart = await CartModel.findOne({ user: req.user._id }) || await CartModel.create({ user: req.user._id, items: [] });
    const existingItemIndex = cart.items.findIndex(item => item.productid.toString() === productid && item.origin === origin);
    const stock = await getstock(productid, origin);
    const isproductalreadyincart = existingItemIndex !== -1;

    if (isproductalreadyincart) {
      const existingItem = cart.items[existingItemIndex];
      if (existingItem.quantity + quantity > stock) {
        return res.status(400).json({
          message: 'Quantity exceeds available stock'
        });
      }
      existingItem.quantity += quantity;
    }

    if (quantity > stock) {
      return res.status(400).json({
        message: 'Quantity exceeds available stock'
      });
    }

    cart.items.push({
      productid,
      origin,
      quantity,
      price
    });

    await cart.save();
    return res.status(200).json({
      message: 'product added to cart successfully',
      cart
    });
  } catch (err) {
    return res.status(500).json({
      message: 'internal server error'
    });
  }
}

export async function getcart(req, res) {
  try {
    const aggregationResult = await CartModel.aggregate([
      { $match: { user: req.user._id } },
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
          __v: { $first: '$__v' }
        }
      }
    ], { maxTimeMS: 60000, allowDiskUse: true });

    if (!aggregationResult.length) {
      const createdCart = await CartModel.create({ user: req.user._id, items: [] });
      const cartResponse = createdCart.toObject ? createdCart.toObject() : createdCart;
      cartResponse.items = [];
      return res.status(200).json({
        message: 'cart fetched successfully',
        cart: cartResponse
      });
    }

    const cart = aggregationResult[0];
    const cartResponse = cart.toObject ? cart.toObject() : cart;
    const items = Array.isArray(cartResponse.items) ? cartResponse.items : [];
    cartResponse.items = await Promise.all(items.map(buildCartItemResponse));

    return res.status(200).json({
      message: 'cart fetched successfully',
      cart: cartResponse
    });
  } catch (err) {
    console.error('Error in getcart:', err);
    return res.status(500).json({
      message: 'internal server error'
    });
  }
}

export async function removecartitem(req, res) {
  try {
    const productid = req.params.productid;
    const cart = await CartModel.findOne({ user: req.user._id });  
    if (!cart) {
      return res.status(404).json({
        message: 'cart not found'
      });
    }
    const itemIndex = cart.items.findIndex(item => item.productid?.toString() === productid || item._id?.toString() === productid);
    if (itemIndex === -1) {
      return res.status(404).json({
        message: 'item not found in cart'
      });
    }
    cart.items.splice(itemIndex, 1);
    await cart.save();  
    const cartResponse = cart.toObject ? cart.toObject() : cart;
    cartResponse.items = await Promise.all(cart.items.map(buildCartItemResponse));

    return res.status(200).json({
      message: 'item removed from cart successfully',
      cart: cartResponse
    }); 
  }
  catch (err) {
    return res.status(500).json({
      message: 'internal server error'
    });
  }
}

export async function updatecartquantity(req, res) {
  try {
    const productid = req.params.productid;
    const { quantity } = req.body;
    
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: 'Quantity must be a positive integer or 0' });
    }

    const cart = await CartModel.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productid?.toString() === productid || item._id?.toString() === productid);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'item not found in cart' });
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const item = cart.items[itemIndex];
      const stock = await getstock(item.productid, item.origin);
      if (quantity > stock) {
        return res.status(400).json({ message: 'Quantity exceeds available stock' });
      }
      item.quantity = quantity;
    }

    await cart.save();
    
    const cartResponse = cart.toObject ? cart.toObject() : cart;
    cartResponse.items = await Promise.all(cart.items.map(buildCartItemResponse));

    return res.status(200).json({
      message: 'Cart updated successfully',
      cart: cartResponse
    });
  } catch (err) {
    return res.status(500).json({ message: 'internal server error' });
  }
}


















