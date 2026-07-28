import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import API from '../../services/api';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const [productsRes, ordersRes] = await Promise.all([
          API.get('/products'),
          API.get('/orders').catch(() => ({ data: [] })), // Graceful fallback
        ]);

        const productsList = productsRes.data || [];
        const ordersList = ordersRes.data || [];

        const totalRev = ordersList.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

        setStats({
          products: productsList.length,
          orders: ordersList.length,
          revenue: totalRev,
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-500 text-xs font-semibold uppercase">Total Products</span>
              <p className="text-3xl font-extrabold text-slate-900">{stats.products}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-500 text-xs font-semibold uppercase">Total Orders</span>
              <p className="text-3xl font-extrabold text-indigo-600">{stats.orders}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-slate-500 text-xs font-semibold uppercase">Total Revenue</span>
              <p className="text-3xl font-extrabold text-emerald-600">₹{stats.revenue}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;