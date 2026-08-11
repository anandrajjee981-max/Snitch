import productModel from '../models/product.model.js';

export const searchProducts = async (req, res) => {
  try {
    const { query = '', page = 1, limit = 10 } = req.query;

    // 1. Guard against empty query
    if (!query.trim()) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: { total: 0, page: Number(page), pages: 0 }
      });
    }

    // 2. Escape special regex characters to prevent ReDoS security vulnerabilities
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(safeQuery, 'i');

    const filter = {
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    };

    const skip = (Number(page) - 1) * Number(limit);

    // 3. Execute query with pagination and explicit field selection (including image)
    const [products, total] = await Promise.all([
      productModel
        .find(filter)
        .select('title description price image images category createdAt') // Ensure image/images fields are selected
        .skip(skip)
        .limit(Number(limit))
        .lean(), // Converts Mongoose Documents to plain JS objects for better performance
      productModel.countDocuments(filter)
    ]);

    return res.status(200).json({
      success: true,
      total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit)
      },
      data: products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message
    });
  }
};