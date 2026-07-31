import productmodel from '../models/Product.model.js'
import { uploadimage } from '../service/imagekit.service.js'

export async function submitproduct(req, res) {
  try {
    const { title, description, price, currency } = req.body;
    
    // 1. FIX: Seller ki poori object ki jagah uski ID nikal li
    const sellerId = req.user._id; 

    // Check agar files upload nahi hui hain
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one product image" });
    }

    // Images ko parallel mein upload karna
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        return await uploadimage({
          buffer: file.buffer,
          filename: file.originalname // 2. FIX: Spelling corrected (originalname)
        });
      })
    );

    // Product create karna
    const product = await productmodel.create({
      title: title,
      description: description,
      productprice: {
        price: price,
        currency: currency || "INR" // Default currency backup
      },
      image: uploadedImages, // 3. FIX: Variable ka naam sahi kiya (uploadedImages)
      seller: sellerId // Sahi ID pass ki
    });

    return res.status(201).json({ // 201 status code 'Created' ke liye best hai
      message: "Product created successfully",
      product
    });

  } catch (err) {
    console.error("Submit Product Error:", err);
    console.error("Error stack:", err.stack);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

export async function getproduct(req, res) {
  try {
    // 1. Get the seller ID (assuming req.user is populated by your auth middleware)
    const seller = req.user?._id || req.user; 

    if (!seller) {
      return res.status(401).json({
        message: "Unauthorized: Seller information not found"
      });
    }

    // 2. Query the database
    const products = await productmodel.find({ seller: seller });

    // 3. Correctly check if the array is empty
    if (products.length === 0) {
      return res.status(404).json({
        message: "No products found for this seller"
      });
    }

    // 4. Return the products
    return res.status(200).json({
      message: "Product list retrieved successfully",
      products // Renamed to plural "products" for cleaner API semantics
    });

  } catch (err) {
    console.error("Error in getproduct:", err); // Log the actual error for backend debugging
    return res.status(500).json({
      message: "Internal server error"
    });
  }
}
export async function getproductbyid(req, res) {
  try {
    const seller = req.user?._id || req.user;
    const { productid } = req.params;
    const product = await productmodel.findOne({ _id: productid, seller: seller });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product retrieved successfully", product });
  } catch (err) {
    console.error("Error in getproductbyid:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function submitvariant(req, res) {
  try {
    const seller = req.user?._id || req.user;
    const productid = req.params.productid;
    const product = await productmodel.findOne({
      _id: productid,
      seller: seller
    });
    if (!product) {
      return res.status(404).json({
        message: "product or user not found"
      });
    }

    const images = [];
    const files = req.files || [];
    if (files.length > 0) {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const url = await uploadimage({
            buffer: file.buffer,
            filename: file.originalname
          });
          return { url };
        })
      );
      images.push(...uploadedUrls);
    }

    const { price, currency, stock } = req.body;
    let attribute = {};
    if (req.body.attribute) {
      attribute = typeof req.body.attribute === 'string' ? JSON.parse(req.body.attribute) : req.body.attribute;
    } else if (req.body.attributes) {
      attribute = typeof req.body.attributes === 'string' ? JSON.parse(req.body.attributes) : req.body.attributes;
    }

    product.variants.push({
      images,
      productprice: {
        price: Number(price),
        currency: currency || "INR"
      },
      stock: Number(stock) || 0,
      attribute
    });

    const savedProduct = await product.save();
    return res.status(200).json({
      message: "variant added successfully",
      product: savedProduct
    });

  } catch (err) {
    console.error("Error in submitvariant:", err);
    return res.status(500).json({
      message: "internal server error",
      error: err.message
    });
  }
}



