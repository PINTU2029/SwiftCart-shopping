import React, { useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-hot-toast';

const OrderTable = ({ orders, onUpdateStatus, onRefresh }) => {
  const [deliveryInputs, setDeliveryInputs] = useState({});
  const [editingOrders, setEditingOrders] = useState({});

  // Save Agent Details Handler
  const handleSaveDeliveryBoy = async (orderId) => {
    try {
      const boyData = deliveryInputs[orderId];
      if (!boyData || (!boyData.name && !boyData.phone)) {
        return toast.error('Please enter name or phone number');
      }

      await API.put(`/orders/${orderId}/status`, {
        deliveryBoy: boyData,
      });

      toast.success('Delivery Partner Details Saved!');
      
      // Exit Edit mode for this order
      setEditingOrders((prev) => ({ ...prev, [orderId]: false }));

      // Refresh parent orders list if callback exists
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save delivery partner');
    }
  };

  // Enable Edit mode for a specific order
  const handleEditClick = (order) => {
    setDeliveryInputs((prev) => ({
      ...prev,
      [order._id]: {
        name: order.deliveryBoy?.name || '',
        phone: order.deliveryBoy?.phone || '',
      },
    }));
    setEditingOrders((prev) => ({ ...prev, [order._id]: true }));
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-800 uppercase text-xs font-semibold border-b border-slate-200">
          <tr>
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Address & Location</th>
            <th className="px-4 py-3">Delivery Partner</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => {
            const addr = order.shippingAddress || {};
            const fullAddress = `${addr.street || addr.address || ''}, ${addr.city || ''} ${addr.pincode || addr.postalCode || ''}`.replace(/^,\s*|,\s*$/g, '');
            const phone = addr.phone || addr.phoneNumber || order.user?.phone || 'N/A';
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

            const isSaved = Boolean(order.deliveryBoy?.name || order.deliveryBoy?.phone);
            const isEditing = Boolean(editingOrders[order._id]);

            return (
              <tr key={order._id} className="hover:bg-slate-50/80 transition">
                {/* Order ID */}
                <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-bold">
                  #{order._id.substring(0, 8)}...
                </td>

                {/* Customer Info */}
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{order.user?.name || 'Guest'}</div>
                  <div className="text-xs text-slate-500">{phone}</div>
                </td>

                {/* Address + Google Maps */}
                <td className="px-4 py-3 max-w-xs">
                  <div className="text-xs text-slate-800 font-medium truncate" title={fullAddress}>
                    {fullAddress || 'Address not provided'}
                  </div>
                  {fullAddress && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-600 font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
                    >
                      📍 Open Google Maps
                    </a>
                  )}
                </td>

                {/* Delivery Partner (Saved Banner + Edit Mode Options) */}
                <td className="px-4 py-3">
                  {isSaved && !isEditing ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2 min-w-150px space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          ✓ Saved
                        </span>
                        <button
                          onClick={() => handleEditClick(order)}
                          className="text-[11px] text-indigo-600 font-bold hover:underline"
                        >
                          ✏️ Edit
                        </button>
                      </div>
                      <div className="text-xs font-semibold text-slate-800">
                        {order.deliveryBoy.name || 'No Name'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        📞 {order.deliveryBoy.phone || 'No Phone'}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 min-w-140px">
                      <input
                        type="text"
                        placeholder="Agent Name"
                        value={
                          deliveryInputs[order._id]?.name !== undefined
                            ? deliveryInputs[order._id].name
                            : order.deliveryBoy?.name || ''
                        }
                        onChange={(e) =>
                          setDeliveryInputs({
                            ...deliveryInputs,
                            [order._id]: {
                              ...deliveryInputs[order._id],
                              name: e.target.value,
                            },
                          })
                        }
                        className="text-xs px-2 py-1 border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Agent Phone"
                        value={
                          deliveryInputs[order._id]?.phone !== undefined
                            ? deliveryInputs[order._id].phone
                            : order.deliveryBoy?.phone || ''
                        }
                        onChange={(e) =>
                          setDeliveryInputs({
                            ...deliveryInputs,
                            [order._id]: {
                              ...deliveryInputs[order._id],
                              phone: e.target.value,
                            },
                          })
                        }
                        className="text-xs px-2 py-1 border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSaveDeliveryBoy(order._id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold py-1 px-2 rounded transition flex-1"
                        >
                          Save Agent
                        </button>
                        {isEditing && (
                          <button
                            onClick={() =>
                              setEditingOrders((prev) => ({ ...prev, [order._id]: false }))
                            }
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold py-1 px-2 rounded transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>

                {/* Total */}
                <td className="px-4 py-3 font-bold text-slate-900">₹{order.totalPrice}</td>

                {/* Payment Status */}
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                      order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {order.isPaid ? 'Paid' : `Pending (${order.paymentMethod || 'COD'})`}
                  </span>
                </td>

                {/* Status Dropdown */}
                <td className="px-4 py-3">
                  <select
                    value={order.orderStatus || 'Processing'}
                    onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                    className="text-xs bg-slate-100 border border-slate-300 rounded px-2 py-1 font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;