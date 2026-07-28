import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from "../services/api";
import ProductCard from '../components/product/ProductCard';
import ProductFilter from '../components/product/ProductFilter';
import Loader from '../components/common/Loader';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const search = searchParams.get('search') || '';

  const categories = ['Electronics', 'Fashion', 'Footwear', 'Home & Kitchen', 'Accessories'];

  // Handle Category Select Function
  const handleCategorySelect = (selectedCat) => {
    setCategory(selectedCat);
    // Agar search active hai toh category filter dabaate hi search query reset karo
    if (search) {
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = '/products';
        const params = [];
        
        if (search) params.push(`keyword=${encodeURIComponent(search)}`);
        if (category) params.push(`category=${encodeURIComponent(category)}`);
        
        if (params.length > 0) url += `?${params.join('&')}`;

        const { data } = await API.get(url);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="bg-linear-to-r from-indigo-900 via-slate-900 to-purple-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <span className="text-amber-400 text-xs sm:text-sm uppercase font-bold tracking-wider mb-2 block">
          EXCLUSIVE SUMMER OFFER
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Upgrade Your Shopping Experience.
        </h1>
        <p className="text-slate-300 max-w-lg mb-6 text-sm sm:text-base">
          Discover top quality products at unmatched prices with superfast delivery.
        </p>
      </div>

      {/* Categories Filter (Pass custom handler) */}
      <ProductFilter 
        selectedCategory={category} 
        setCategory={handleCategorySelect} 
        categories={categories} 
      />

      {/* Products Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {search 
            ? `Search Results for "${search}"` 
            : category 
            ? `${category} Products` 
            : 'Trending Products'}
        </h2>

        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-medium">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;