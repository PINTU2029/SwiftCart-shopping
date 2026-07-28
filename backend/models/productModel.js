const mongoose = require('mongoose');

// Individual Review Schema
const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Main Product Schema
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String, required: true }], // Cloudinary URLs
    reviews: [reviewSchema],                   // Array of user reviews
    rating: { type: Number, default: 0 },       // Average rating score
    numReviews: { type: Number, default: 0 },   // Total count of reviews
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);