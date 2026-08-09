import React from 'react';

const CartSummary = ({ mrpSubtotal, totalDiscount, subtotal, onCheckout }) => {
  // MRP Subtotal / Discount Fallback Handling
  const originalMRP = mrpSubtotal || subtotal;
  const discount = totalDiscount || 0;

  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18); // 18% GST on discounted price
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
      <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">
        Order Summary
      </h2>

      <div className="space-y-2.5 text-sm text-slate-600">
        {/* 1. Original MRP Subtotal */}
        <div className="flex justify-between">
          <span>Subtotal (MRP)</span>
          <span className="font-semibold text-slate-400 line-through">
            ₹{originalMRP}
          </span>
        </div>

        {/* 2. Offer Discount Row (Green Highlight) */}
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            <span>Offer Discount</span>
            <span>- ₹{discount}</span>
          </div>
        )}

        {/* 3. Discounted Subtotal */}
        <div className="flex justify-between">
          <span>Price After Offer</span>
          <span className="font-bold text-slate-800">₹{subtotal}</span>
        </div>

        {/* 4. Estimated Shipping */}
        <div className="flex justify-between">
          <span>Estimated Shipping</span>
          <span className="font-semibold text-slate-800">
            {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shipping}`}
          </span>
        </div>

        {/* 5. Estimated GST */}
        <div className="flex justify-between">
          <span>Estimated GST (18%)</span>
          <span className="font-semibold text-slate-800">₹{tax}</span>
        </div>

        {/* Total Price */}
        <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-base font-bold text-slate-900">
          <span>Total Amount</span>
          <span className="text-xl font-extrabold text-indigo-600">₹{total}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={subtotal === 0}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md mt-2 cursor-pointer"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;