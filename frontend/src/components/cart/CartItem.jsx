import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;

  if (!product) return null;

  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-4 gap-4">
      <div className="flex items-center gap-4">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/100'}
          alt={product.title}
          className="w-20 h-20 object-cover rounded-lg border border-slate-100"
        />
        <div>
          <h3 className="font-semibold text-slate-800 text-sm sm:text-base line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-indigo-600 font-medium">{product.category}</p>
          <p className="text-slate-900 font-bold mt-1">₹{product.price}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
          <button
            onClick={() => onUpdateQuantity(product._id, Math.max(1, quantity - 1))}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
          >
            -
          </button>
          <span className="px-3 py-1 text-sm font-semibold text-slate-800">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product._id, quantity + 1)}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <span className="font-bold text-slate-900 w-20 text-right hidden sm:block">
          ₹{product.price * quantity}
        </span>

        {/* Delete Button */}
        <button
          onClick={() => onRemove(product._id)}
          className="text-red-500 hover:text-red-700 text-sm font-semibold p-1"
          title="Remove Item"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default CartItem;