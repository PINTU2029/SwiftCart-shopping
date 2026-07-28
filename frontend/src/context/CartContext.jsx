import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { toast } from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cart fetch karna
  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/cart');
      setCartItems(data.cartItems || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cart me add / quantity update karna
  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await API.post('/cart', { productId, quantity });
      setCartItems(data.cartItems || []);
      toast.success('Cart updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  // Item remove karna
  const removeFromCart = async (productId) => {
    try {
      const { data } = await API.delete(`/cart/${productId}`);
      setCartItems(data.cartItems || []);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, loading, fetchCart, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

//   custom hook 
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;