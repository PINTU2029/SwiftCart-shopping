import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import API from "../services/api";
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP States
  const [step, setStep] = useState(1); // 1 = Registration Details, 2 = OTP Input
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // 1. Generate & Send OTP via EmailJS
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error('Please fill in all fields.');
    }

    try {
      setLoading(true);

      // Random 6-digit OTP Generate
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otp);

      // EmailJS Template Object
      const templateParams = {
       to_name: name,
       to_email: email, 
       email: email,    
       otp: otp,
       };

      // EmailJS Send Request
       await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

      toast.success(`OTP sent to ${email}`);
      setStep(2); // Step 2 Par Switch Karein
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast.error('Failed to send OTP. Check EmailJS keys in .env file!');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP & Call Registration API
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();

    if (userOtp.trim() !== generatedOtp) {
      return toast.error('Invalid OTP! Please enter correct code.');
    }

    try {
      setLoading(true);
      // Main Registration Request
      const { data } = await API.post('/auth/register', { name, email, password });
      
      login(data);
      toast.success('Account verified & created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-100 shadow-lg">
      <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">
        {step === 1 ? 'Create an Account' : 'Verify Email OTP'}
      </h2>

      {/* STEP 1: Registration Input Form */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition disabled:bg-indigo-400"
          >
            {loading ? 'Sending OTP...' : 'Get OTP & Register'}
          </button>
        </form>
      )}

      {/* STEP 2: OTP Verification Box */}
      {step === 2 && (
        <form onSubmit={handleVerifyAndRegister} className="space-y-4">
          <p className="text-xs text-center text-slate-600">
            We sent a 6-digit OTP code to <br />
            <span className="font-bold text-slate-900">{email}</span>
          </p>

          <div>
            <input
              type="text"
              maxLength="6"
              required
              placeholder="Enter 6-Digit OTP"
              className="w-full text-center tracking-widest text-lg font-bold px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={userOtp}
              onChange={(e) => setUserOtp(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition disabled:bg-emerald-400 shadow-md"
          >
            {loading ? 'Verifying...' : 'Verify OTP & Complete Setup'}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-xs text-indigo-600 font-semibold hover:underline text-center block pt-2"
          >
            ← Change Email / Back
          </button>
        </form>
      )}

      <p className="text-xs text-center text-slate-500 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 font-bold hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;