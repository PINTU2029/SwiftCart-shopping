import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Footer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-[#232f3e] text-slate-300 font-sans text-xs">
      {/* 1. Personalized Recommendation / Sign-in Banner (Only when NOT logged in) */}
      {!user && (
        <div className="bg-white text-slate-900 py-8 px-4 text-center border-t border-slate-200">
          <p className="font-semibold text-sm mb-2">See personalized recommendations</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-16 py-1.5 rounded-lg shadow-sm text-xs mb-1 transition"
          >
            Sign in
          </button>
          <p className="text-[11px] text-slate-600">
            New customer?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-indigo-600 hover:underline font-semibold"
            >
              Start here.
            </button>
          </p>
        </div>
      )}

      {/* 2. Back to top Bar */}
      <button
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-white py-3.5 text-center font-bold text-xs tracking-wide transition cursor-pointer"
      >
        Back to top
      </button>

      {/* 3. Main Multi-Column Links Section */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Get to Know Us */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-white text-sm">Get to Know Us</h3>
          <ul className="space-y-1.5 text-slate-300 font-normal">
            <li><Link to="/" className="hover:underline">About SwiftCart</Link></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Press Releases</a></li>
            <li><a href="#" className="hover:underline">SwiftCart Science</a></li>
          </ul>
        </div>

        {/* Connect with Us */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-white text-sm">Connect with Us</h3>
          <ul className="space-y-1.5 text-slate-300 font-normal">
            <li><a href="#" className="hover:underline">Youtube</a></li>
            <li><a href="#" className="hover:underline">whatsapp</a></li>
            <li><a href="#" className="hover:underline">Instagram</a></li>
          </ul>
        </div>

        {/* Make Money with Us */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-white text-sm">Make Money with Us</h3>
          <ul className="space-y-1.5 text-slate-300 font-normal">
            <li><a href="#" className="hover:underline">Sell on SwiftCart</a></li>
            <li><a href="#" className="hover:underline">Protect & Build Your Brand</a></li>
            <li><a href="#" className="hover:underline">Become an Affiliate</a></li>
            <li><a href="#" className="hover:underline">Fulfilment by SwiftCart</a></li>
            <li><a href="#" className="hover:underline">Advertise Your Products</a></li>
          </ul>
        </div>

        {/* Let Us Help You */}
        <div className="space-y-2.5">
          <h3 className="font-bold text-white text-sm">Let Us Help You</h3>
          <ul className="space-y-1.5 text-slate-300 font-normal">
            <li><Link to="/my-orders" className="hover:underline">Your Account</Link></li>
            <li><a href="#" className="hover:underline">Returns Centre</a></li>
            <li><a href="#" className="hover:underline">100% Purchase Protection</a></li>
            <li><a href="#" className="hover:underline">SwiftCart App Download</a></li>
            <li><a href="#" className="hover:underline">Help & Support</a></li>
          </ul>
        </div>
      </div>

      {/* 4. Brand Center Line (Logo, Country & Language Selector) */}
      <div className="border-t border-[#3a4553] py-6 bg-[#232f3e]">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6">
          {/* Circular Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <span className="text-base font-extrabold text-white tracking-wide">
              Swift<span className="text-indigo-400">Cart</span>
            </span>
          </Link>

          {/* Badges */}
          <div className="flex gap-2">
            <div className="border border-slate-500 rounded px-3 py-1 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer hover:border-slate-300">
              🌐 English
            </div>
            <div className="border border-slate-500 rounded px-3 py-1 text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer hover:border-slate-300">
              🇮🇳 India
            </div>
          </div>
        </div>
      </div>

      {/* 5. Sub-Footer Services Grid */}
      <div className="bg-[#131a22] py-8 text-slate-400 border-t border-[#232f3e]">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-[11px]">
          <div>
            <h4 className="font-bold text-slate-200">Swift Express</h4>
            <p className="text-slate-500">Fast & Guaranteed Delivery</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-200">Swift Web Services</h4>
            <p className="text-slate-500">Scalable E-Commerce API</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-200">Swift Business</h4>
            <p className="text-slate-500">Bulk Buying For Business</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-200">Swift Care</h4>
            <p className="text-slate-500">24/7 Dedicated Support</p>
          </div>
        </div>

        {/* 6. Legal & Copyright Bar */}
        <div className="text-center pt-8 text-[11px] text-slate-500 space-y-1">
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:underline">Conditions of Use & Sale</a>
            <a href="#" className="hover:underline">Privacy Notice</a>
            <a href="#" className="hover:underline">Interest-Based Ads</a>
          </div>
          <p>© 1996-{new Date().getFullYear()}, SwiftCart.com, Inc. or its affiliates</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;