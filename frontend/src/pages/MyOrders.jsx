import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Loader from '../components/common/Loader';
import { toast } from 'react-hot-toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      const { data } = await API.get('/orders/myorders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // Cancel Order Handler (Before Shipping/Delivery)
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Kya aap sach me ye order cancel karna chahte hain?')) {
      try {
        await API.put(`/orders/${orderId}/status`, { orderStatus: 'Cancelled' });
        toast.success('Order Cancelled successfully!');
        fetchMyOrders();
      } catch (error) {
        toast.error('Failed to cancel order');
      }
    }
  };

  // Helper function to calculate Expected Delivery Date (Order Date + 4 Days)
  const getExpectedDate = (dateString) => {
    const orderDate = new Date(dateString);
    orderDate.setDate(orderDate.getDate() + 4);
    return orderDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const statuses = ['Processing', 'Shipped', 'Delivered'];

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-[70vh]">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-500">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStatus = order.orderStatus || 'Processing';
            const isCancelled = currentStatus === 'Cancelled';
            const currentStepIndex = statuses.indexOf(currentStatus);

            return (
              <div
                key={order._id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
              >
                {/* Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase">Order ID</span>
                    <span className="font-mono text-sm font-bold text-indigo-600">#{order._id}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase">Order Date</span>
                    <span className="text-sm font-medium text-slate-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase">Expected Delivery</span>
                    <span className="text-sm font-bold text-emerald-600">
                      {isCancelled ? 'N/A (Cancelled)' : getExpectedDate(order.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase">Total Price</span>
                    <span className="text-sm font-bold text-slate-900">₹{order.totalPrice}</span>
                  </div>
                </div>

                {/* Status Stepper Tracker */}
                {!isCancelled ? (
                  <div className="py-2">
                    <div className="relative flex items-center justify-between max-w-xl mx-auto">
                      {/* Background Connecting Bar */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0" />

                      {/* Active Progress Bar */}
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 z-0 transition-all duration-500"
                        style={{
                          width: `${(Math.max(0, currentStepIndex) / (statuses.length - 1)) * 100}%`,
                        }}
                      />

                      {statuses.map((step, idx) => {
                        const isCompleted = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                                isCompleted
                                  ? 'bg-indigo-600 text-white shadow-md ring-4 ring-indigo-100'
                                  : 'bg-slate-200 text-slate-500'
                              }`}
                            >
                              {idx + 1}
                            </div>
                            <span
                              className={`text-xs mt-2 font-medium ${
                                isCurrent
                                  ? 'text-indigo-600 font-bold'
                                  : isCompleted
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-200 text-center">
                    This order has been Cancelled.
                  </div>
                )}

                {/* Delivery Boy Details Banner (Visible when assigned & order not cancelled) */}
                {order.deliveryBoy?.name && !isCancelled && (
                  <div className="bg-linear-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow">
                        🛵
                      </div>
                      <div>
                        <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider">
                          Delivery Partner Assigned
                        </p>
                        <p className="text-sm font-bold text-slate-900">{order.deliveryBoy.name}</p>
                      </div>
                    </div>

                    {order.deliveryBoy.phone && (
                      <a
                        href={`tel:${order.deliveryBoy.phone}`}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow transition"
                      >
                        <span>📞</span> Call Agent ({order.deliveryBoy.phone})
                      </a>
                    )}
                  </div>
                )}

                {/* Items List */}
                <div className="divide-y divide-slate-100">
                  {order.orderItems?.map((item, index) => (
                    <div key={index} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image || item.images?.[0] || 'https://via.placeholder.com/80'}
                          alt={item.name || item.title}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-100"
                        />
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">{item.name || item.title}</h4>
                          <p className="text-xs text-slate-500">Qty: {item.qty || item.quantity || 1}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">
                        ₹{(item.price || 0) * (item.qty || item.quantity || 1)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Address & Cancel Action Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-slate-500">
                    <strong>Address:</strong> {order.shippingAddress?.street || order.shippingAddress?.address}, {order.shippingAddress?.city}
                  </div>

                  {/* Cancel Button: Show only if Status is Processing */}
                  {currentStatus === 'Processing' && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-lg border border-red-200 transition"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;