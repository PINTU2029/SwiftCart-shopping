const Product = require('../models/productModel');
const cloudinary = require('../config/cloudinary');

// @desc    Get all products (With Search & Category Filter)
// @route   GET /api/v1/products
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { title: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const products = await Product.find({ ...keyword, ...category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/v1/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a Product (Admin Only - Supports File Upload & Discount)
// @route   POST /api/v1/products
const createProduct = async (req, res) => {
  try {
    const { title, description, price, discount, category, stock } = req.body;

    let imageUrls = [];

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'shoppro_products' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      imageUrls.push(result.secure_url);
    } else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images];
    } else {
      imageUrls.push('https://via.placeholder.com/300');
    }

    const product = new Product({
      title,
      description,
      price: Number(price),
      discount: discount !== undefined ? Number(discount) : 0, // Catch & save discount
      category,
      stock: Number(stock),
      images: imageUrls,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a Product (Admin Only - Supports Image & Discount Update)
// @route   PUT /api/v1/products/:id
const updateProduct = async (req, res) => {
  try {
    const { title, description, price, discount, category, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price !== undefined ? Number(price) : product.price;
      
      // Update discount field explicitly
      if (discount !== undefined) {
        product.discount = Number(discount);
      }

      product.category = category || product.category;
      product.stock = stock !== undefined ? Number(stock) : product.stock;

      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'shoppro_products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });

        product.images = [result.secure_url];
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a Product (Admin Only)
// @route   DELETE /api/v1/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/v1/products/:id/reviews
// @access  Private (Logged-in Users)
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed by you' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a review (User can edit their own review)
// @route   PUT /api/v1/products/:id/reviews/:reviewId
// @access  Private (Review Owner Only)
const updateProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const review = product.reviews.find(
        (r) => r._id.toString() === req.params.reviewId
      );

      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      if (review.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to edit this review' });
      }

      review.rating = rating !== undefined ? Number(rating) : review.rating;
      review.comment = comment || review.comment;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.json({ message: 'Review updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review (User can delete their own, Admin can delete any)
// @route   DELETE /api/v1/products/:id/reviews/:reviewId
// @access  Private (Review Owner or Admin)
const deleteProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const reviewIndex = product.reviews.findIndex(
        (r) => r._id.toString() === req.params.reviewId
      );

      if (reviewIndex === -1) {
        return res.status(404).json({ message: 'Review not found' });
      }

      const review = product.reviews[reviewIndex];

      const isOwner = review.user.toString() === req.user._id.toString();
      const isAdmin = req.user.isAdmin || req.user.role === 'admin';

      if (isOwner || isAdmin) {
        product.reviews.splice(reviewIndex, 1);
        product.numReviews = product.reviews.length;

        product.rating =
          product.reviews.length > 0
            ? product.reviews.reduce((acc, item) => item.rating + acc, 0) /
              product.reviews.length
            : 0;

        await product.save();
        res.json({ message: 'Review deleted successfully' });
      } else {
        res.status(403).json({ message: 'Not authorized to delete this review' });
      }
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  updateProductReview, 
  deleteProductReview, 
};