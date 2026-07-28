import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import API from "../services/api";
import Loader from '../components/common/Loader';

const ProfilePage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching user orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Profile Info Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
          {user?.role || 'Customer'}
        </span>
      </div>

      {/* Order History */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">My Orders History</h2>

        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-2xl border border-slate-100 text-slate-500">
            You have not placed any orders yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap justify-between items-center gap-2 border-b pb-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-500">Order ID: </span>
                    <span className="font-mono font-bold text-indigo-600">{order._id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Date: </span>
                    <span className="font-semibold text-slate-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      order.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.orderStatus || 'Processing'}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="py-2 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || 'https://via.placeholder.com/50'}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-lg border"
                        />
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 flex justify-between items-center font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">₹{order.totalPrice}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;