import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;

  if (!product) return null;

  // Image Fallback Handling
  const productImage = (product.images && product.images[0]) || product.image || 'https://via.placeholder.com/100';

  // 🔴 ProductCard Wala Exact Logic
  const discountPercent = Number(product.discount) || 20; 
  const originalPrice = Number(product.price) || 0;

  const discountedPrice = discountPercent > 0
    ? Math.round(originalPrice - (originalPrice * discountPercent) / 100)
    : originalPrice;

  const itemSavings = (originalPrice - discountedPrice) * quantity;
  const itemTotalDiscounted = discountedPrice * quantity;

  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-4 gap-4">
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <img
          src={productImage}
          alt={product.title || product.name}
          className="w-20 h-20 object-cover rounded-xl border border-slate-100 shadow-xs"
        />
        <div>
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base line-clamp-1">
            {product.title || product.name}
          </h3>
          <p className="text-xs text-indigo-600 font-medium mb-1">{product.category}</p>

          {/* 🏷️ OFFER PRICE BREAKDOWN */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Real Selling Price */}
            <span className="text-slate-900 font-bold text-base">
              ₹{discountedPrice}
            </span>

            {/* Original MRP Strikethrough Price */}
            {discountPercent > 0 && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ₹{originalPrice}
              </span>
            )}

            {/* Green Discount Offer Badge */}
            {discountPercent > 0 && (
              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
          <button
            onClick={() => onUpdateQuantity(product._id, Math.max(1, quantity - 1))}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
          >
            -
          </button>
          <span className="px-3 py-1 text-sm font-semibold text-slate-800">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product._id, quantity + 1)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
          >
            +
          </button>
        </div>

        {/* Total Price for Item Quantity */}
        <div className="text-right hidden sm:block w-28">
          <span className="font-bold text-slate-900 block">
            ₹{itemTotalDiscounted}
          </span>
          {itemSavings > 0 && (
            <span className="text-[10px] text-emerald-600 font-semibold block">
              Save ₹{itemSavings}
            </span>
          )}
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onRemove(product._id)}
          className="text-red-500 hover:text-red-700 text-sm font-semibold p-1 cursor-pointer"
          title="Remove Item"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default CartItem;