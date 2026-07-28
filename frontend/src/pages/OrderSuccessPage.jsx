import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  const { id } = useParams();

  return (
    <div className="max-w-md mx-auto my-16 px-4 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto font-bold shadow-sm animate-bounce">
        ✓
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900">Order Placed Successfully!</h1>
      <p className="text-slate-600 text-sm leading-relaxed">
        Thank you for shopping with us! Your order has been placed and is being processed.
      </p>
      <div className="bg-slate-100 p-4 rounded-xl font-mono text-xs text-slate-700">
        Order ID: <span className="font-bold text-indigo-600">{id}</span>
      </div>
      <div className="pt-2 flex justify-center gap-4">
        <Link
          to="/"
          className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition"
        >
          Continue Shopping
        </Link>
        <Link
          to="/profile"
          className="bg-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-xl hover:bg-slate-300 transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;