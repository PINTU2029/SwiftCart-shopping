import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Loader from '../components/common/Loader';

const CartPage = () => {
  const { cartItems, loading, fetchCart, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔴 ProductCard matching calculation logic for totals
  let mrpSubtotal = 0;
  let finalSubtotal = 0;

  cartItems.forEach((item) => {
    if (item.product) {
      const p = item.product;
      const originalPrice = Number(p.price) || 0;
      const discountPercent = Number(p.discount) || 20;

      const discountedPrice = discountPercent > 0
        ? Math.round(originalPrice - (originalPrice * discountPercent) / 100)
        : originalPrice;

      mrpSubtotal += originalPrice * item.quantity;
      finalSubtotal += discountedPrice * item.quantity;
    }
  });

  const totalDiscount = mrpSubtotal - finalSubtotal;

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl text-center space-y-4 border border-slate-100 shadow-sm">
          <p className="text-slate-500 font-medium">Your cart is currently empty.</p>
          <Link to="/" className="inline-block bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
            {cartItems.map((item) => (
              <CartItem
                key={item.product?._id || item._id}
                item={item}
                onUpdateQuantity={(id, q) => addToCart(id, q)}
                onRemove={(id) => removeFromCart(id)}
              />
            ))}
          </div>
          <div>
            <CartSummary 
              mrpSubtotal={mrpSubtotal}
              totalDiscount={totalDiscount}
              subtotal={finalSubtotal} 
              onCheckout={() => navigate('/checkout')} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;