const express = require('express');
const router = express.Router();
const multer = require('multer');

// Multer memory storage setup (file memory me hold karke Cloudinary bhejne ke liye)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  updateProductReview, // <--- Import Edit Review
  deleteProductReview, // <--- Import Delete Review
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Public Product List & Admin Create Product
router.route('/')
  .get(getProducts)
  .post(protect, admin, upload.single('image'), createProduct);

// User Add Review Route (Logged-in users only)
router.route('/:id/reviews').post(protect, createProductReview);

// Review Edit & Delete Route (Logged-in users / Admin)
router.route('/:id/reviews/:reviewId')
  .put(protect, updateProductReview)      // User can edit their review
  .delete(protect, deleteProductReview);  // User can delete theirs, Admin can delete any

// Single Product GET, PUT, DELETE
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.single('image'), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;