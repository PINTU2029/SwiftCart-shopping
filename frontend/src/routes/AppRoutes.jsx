import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Public & User Pages
import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MyOrders from '../pages/MyOrders'; // <--- 1. Import MyOrders page

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminOrders from '../pages/admin/AdminOrders';
import AddEditProduct from '../pages/admin/AddEditProduct';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success/:id" element={<OrderSuccessPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/my-orders" element={<MyOrders />} /> {/* <--- 2. Added My Orders Route */}
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute adminOnly={true} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/add" element={<AddEditProduct />} />
        <Route path="/admin/products/edit/:id" element={<AddEditProduct />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;