import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const ProductCard = ({ product }) => {
  // Test ke liye default 20% offer set kiya gaya hai
  const discountPercent = Number(product.discount) || 20; 
  const originalPrice = Number(product.price) || 0;

  const discountedPrice = discountPercent > 0
    ? Math.round(originalPrice - (originalPrice * discountPercent) / 100)
    : originalPrice;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition group relative">
      
      {/* Red Offer Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md z-10 shadow-sm">
          {discountPercent}% OFF
        </div>
      )}

      {/* Product Image */}
      <Link to={`/product/${product._id}`}>
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300'}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
        />
      </Link>

      <div className="p-4">
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
          {product.category}
        </span>
        <Link to={`/product/${product._id}`}>
          <h2 className="font-semibold text-slate-800 line-clamp-1 mt-2 group-hover:text-indigo-600 transition">
            {product.title}
          </h2>
        </Link>
        <Rating value={product.ratings || 4} text={product.numOfReviews} />

        {/* Price & Offer Section */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-slate-900">
                ₹{discountedPrice}
              </span>

              {discountPercent > 0 && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ₹{originalPrice}
                </span>
              )}
            </div>

            {discountPercent > 0 && (
              <span className="text-[10px] text-green-600 font-bold block">
                Save ₹{originalPrice - discountedPrice}
              </span>
            )}
          </div>

          <Link
            to={`/product/${product._id}`}
            className="text-xs font-semibold bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;