import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import OrderTable from '../../components/admin/OrderTable';
import API from '../../services/api';
import Loader from '../../components/common/Loader';
import { toast } from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: status });
      toast.success('Order status updated!');
      fetchAllOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Orders</h1>

        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 text-slate-500">
            No orders placed yet.
          </div>
        ) : (
          <OrderTable orders={orders} onUpdateStatus={handleUpdateStatus} />
        )}
      </main>
    </div>
  );
};

export default AdminOrders;