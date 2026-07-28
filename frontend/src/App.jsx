import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
            {/* Toast Notifications */}
            <Toaster position="top-right" reverseOrder={false} />

            {/* Global Navbar */}
            <Navbar />

            {/* Main Application Routes */}
            <main className="grow">
              <AppRoutes />
            </main>

            {/* Global Footer */}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;