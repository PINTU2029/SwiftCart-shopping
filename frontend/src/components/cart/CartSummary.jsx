import React from 'react';

const CartSummary = ({ subtotal, onCheckout }) => {
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18); // 18% GST example
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
      <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-800">₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated Shipping</span>
          <span className="font-semibold text-slate-800">
            {shipping === 0 ? <span className="text-emerald-600">FREE</span> : `₹${shipping}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Estimated GST (18%)</span>
          <span className="font-semibold text-slate-800">₹{tax}</span>
        </div>
        <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold text-slate-900">
          <span>Total</span>
          <span className="text-indigo-600">₹{total}</span>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={subtotal === 0}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;