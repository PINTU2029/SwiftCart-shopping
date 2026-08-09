import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from "../services/api";
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';

// Default Fallback Categories
const DEFAULT_CATEGORIES = [
  { name: 'All', image: 'https://cdn-icons-png.flaticon.com/512/5110/5110756.png' },
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=200&auto=format&fit=crop' },
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200&auto=format&fit=crop' },
  { name: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop' },
  { name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=200&auto=format&fit=crop' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=200&auto=format&fit=crop' },
  { name: 'Groceries', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200&auto=format&fit=crop' },
  { name: 'Sports', image: 'https://unsplash.com/photos/sneakers-on-display-stands-under-warm-focused-lighting-DXTT02-ee-8' },
  { name: 'Toys & Kids', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=200&auto=format&fit=crop' }
];

// Default Fallback Banners
const DEFAULT_BANNERS = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400&h=300&auto=format&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&h=300&auto=format&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1400&h=300&auto=format&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?q=80&w=1400&h=300&auto=format&fit=crop&crop=center"
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  
  // Banners & Categories State with Defaults
  const [categoryData, setCategoryData] = useState(DEFAULT_CATEGORIES);
  const [bannerImages, setBannerImages] = useState(DEFAULT_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const search = searchParams.get('search') || '';

  // Fetch Banners & Categories from Backend
  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const [bannersRes, categoriesRes] = await Promise.all([
          API.get('/admin/banners').catch(() => null),
          API.get('/admin/categories').catch(() => null)
        ]);

        if (bannersRes?.data && bannersRes.data.length > 0) {
          setBannerImages(bannersRes.data.map(b => b.imageUrl || b));
        }

        if (categoriesRes?.data && categoriesRes.data.length > 0) {
          setCategoryData([
            { name: 'All', image: 'https://cdn-icons-png.flaticon.com/512/5110/5110756.png' },
            ...categoriesRes.data
          ]);
        }
      } catch (error) {
        console.error('Error fetching banners/categories:', error);
      }
    };

    fetchHomeContent();
  }, []);

  // Auto-slide Timer (1 Second)
  useEffect(() => {
    if (bannerImages.length === 0) return;
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 1000);

    return () => clearInterval(slideInterval);
  }, [bannerImages.length]);

  // Handle Category Click
  const handleCategorySelect = (selectedCat) => {
    const catValue = selectedCat === 'All' ? '' : selectedCat;
    setCategory(catValue);
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
    <div className="w-full py-6 space-y-8">
      
      {/* 1. Circular Categories Bar (90% Width) */}
      <div className="w-[90%] mx-auto py-2">
        <div className="flex items-center justify-start lg:justify-between overflow-x-auto scrollbar-none px-2 py-2 gap-6 sm:gap-4">
          {categoryData.map((cat) => {
            const isSelected = (cat.name === 'All' && !category) || category === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className="flex flex-col items-center group focus:outline-none shrink-0"
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full p-1 border-2 transition-all duration-300 flex items-center justify-center bg-white shadow-xs group-hover:scale-105 ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-md'
                      : 'border-gray-200 group-hover:border-indigo-300'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <span
                  className={`mt-2 text-xs sm:text-sm font-medium transition-colors ${
                    isSelected
                      ? 'text-indigo-600 font-bold'
                      : 'text-gray-700 group-hover:text-indigo-600'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Auto-Sliding Image Banner (90% Width) */}
      <div className="w-[90%] mx-auto relative overflow-hidden rounded-2xl shadow-md bg-gray-100">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {bannerImages.map((imgUrl, index) => (
            <div key={index} className="min-w-full h-60 sm:h-80 md:h-90 relative">
              <img 
                src={imgUrl} 
                alt={`Banner ${index + 1}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Banner Navigation Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-xs">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? "w-5 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 3. Products Section (90% Width) */}
      <div className="w-[90%] mx-auto">
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