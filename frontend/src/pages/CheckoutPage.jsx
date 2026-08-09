import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../services/api";
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, fetchCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  // 🔴 ProductCard Matching Exact Logic for Checkout Totals
  let mrpSubtotal = 0;
  let finalItemsPrice = 0;

  cartItems.forEach((item) => {
    if (item.product) {
      const p = item.product;
      const originalPrice = Number(p.price) || 0;
      const discountPercent = Number(p.discount) || 20;

      const discountedPrice = discountPercent > 0
        ? Math.round(originalPrice - (originalPrice * discountPercent) / 100)
        : originalPrice;

      mrpSubtotal += originalPrice * (item.quantity || 1);
      finalItemsPrice += discountedPrice * (item.quantity || 1);
    }
  });

  const totalDiscount = mrpSubtotal - finalItemsPrice;
  const shippingPrice = finalItemsPrice > 500 || finalItemsPrice === 0 ? 0 : 50;
  const taxPrice = Math.round(finalItemsPrice * 0.18);
  const totalPrice = finalItemsPrice + shippingPrice + taxPrice;

  // Razorpay Checkout JS Script Loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        orderItems: cartItems.map((item) => {
          const originalPrice = Number(item.product.price) || 0;
          const discountPercent = Number(item.product.discount) || 20;
          const discountedPrice = discountPercent > 0
            ? Math.round(originalPrice - (originalPrice * discountPercent) / 100)
            : originalPrice;

          return {
            title: item.product.title || item.product.name,
            quantity: item.quantity,
            image: item.product.images?.[0] || item.product.image || '',
            price: discountedPrice,
            product: item.product._id,
          };
        }),
        shippingAddress: address,
        paymentMethod,
        itemsPrice: finalItemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      // 1. CASH ON DELIVERY (COD) LOGIC
      if (paymentMethod === 'COD') {
        const { data } = await API.post('/orders', orderData);
        toast.success('Order placed successfully!');
        fetchCart();
        navigate(`/order-success/${data._id}`);
      } 
      // 2. ONLINE PAYMENT (RAZORPAY) LOGIC
      else if (paymentMethod === 'Razorpay') {
        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded) {
          setLoading(false);
          return toast.error('Razorpay SDK failed to load. Check internet connection.');
        }

        // Fetch Razorpay Key ID from backend
        const { data: keyData } = await API.get('/orders/config/razorpay');

        // Create Order on Razorpay Server
        const { data: razorOrder } = await API.post('/orders/razorpay', {
          amount: totalPrice,
        });

        // Open Razorpay Modal
        const options = {
          key: keyData.keyId,
          amount: razorOrder.amount,
          currency: 'INR',
          name: 'ShopPro E-Commerce',
          description: 'Online Order Payment',
          order_id: razorOrder.id,
          handler: async function (response) {
            try {
              // Send verified payment details with order
              const finalOrderData = {
                ...orderData,
                isPaid: true,
                paymentResult: {
                  id: response.razorpay_payment_id,
                  status: 'Paid',
                  update_time: new Date().toISOString(),
                },
              };

              const { data } = await API.post('/orders', finalOrderData);
              toast.success('Payment Successful! Order placed 🎉');
              fetchCart();
              navigate(`/order-success/${data._id}`);
            } catch (err) {
              toast.error('Failed to save order after payment.');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: address.phone || '',
          },
          theme: {
            color: '#4F46E5', // Indigo color matching theme
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Shipping Details</h2>
          
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Street Address</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">State</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pincode</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={address.phone}
                onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Payment & Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Payment Option</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="font-semibold text-slate-800 text-sm">Cash on Delivery (COD)</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                <input
                  type="radio"
                  name="payment"
                  value="Razorpay"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="font-semibold text-slate-800 text-sm">Online Payment (UPI / Cards / NetBanking)</span>
              </label>
            </div>
          </div>

          {/* 🏷️ Payment Summary Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3 shadow-lg">
            <h3 className="font-bold text-lg border-b border-slate-800 pb-2 text-slate-100">Payment Summary</h3>
            
            {/* 1. MRP Subtotal */}
            <div className="flex justify-between text-sm text-slate-300">
              <span>Items Subtotal (MRP)</span>
              <span className="line-through text-slate-400 font-medium">₹{mrpSubtotal}</span>
            </div>

            {/* 2. Offer Discount Row */}
            {totalDiscount > 0 && (
              <div className="flex justify-between text-sm text-emerald-400 font-bold bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                <span>Offer Discount</span>
                <span>- ₹{totalDiscount}</span>
              </div>
            )}

            {/* 3. Price After Offer */}
            <div className="flex justify-between text-sm text-slate-300">
              <span>Price After Offer</span>
              <span className="font-bold text-slate-100">₹{finalItemsPrice}</span>
            </div>

            {/* 4. GST */}
            <div className="flex justify-between text-sm text-slate-300">
              <span>GST (18%)</span>
              <span>₹{taxPrice}</span>
            </div>

            {/* 5. Shipping */}
            <div className="flex justify-between text-sm text-slate-300">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${shippingPrice}`}</span>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
              <span>Total Amount</span>
              <span className="text-indigo-400 text-xl font-extrabold">₹{totalPrice}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-500 transition shadow-lg disabled:bg-indigo-400 cursor-pointer"
            >
              {loading ? 'Processing...' : 'Confirm & Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;