import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from "../services/api";
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-100 shadow-lg">
      <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition">
          Sign In
        </button>
      </form>
      <p className="text-xs text-center text-slate-500 mt-4">
        Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Register</Link>
      </p>
    </div>
  );
};

export default LoginPage;