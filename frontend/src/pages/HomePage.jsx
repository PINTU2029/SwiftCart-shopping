import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
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
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=200&auto=format&fit=crop' },
  { name: 'Toys & Kids', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=200&auto=format&fit=crop' }
];

// Default Fallback Banners
const DEFAULT_BANNERS = [
  "https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=1500&h=350&fit=crop",
  "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1500&h=350&fit=crop",
  "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1500&h=350&fit=crop",
  "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1500&h=350&fit=crop"
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [carouselProducts, setCarouselProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  
  // Banners & Categories State
  const [categoryData, setCategoryData] = useState(DEFAULT_CATEGORIES);
  const [bannerImages, setBannerImages] = useState(DEFAULT_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const search = searchParams.get('search') || '';

  // Slider Ref
  const sliderRef = useRef(null);

  const handleScroll = (scrollOffset) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  // Fetch Banners & Categories
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

  // Auto-slide Timer
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

  // Fetch Products & Prepare Carousel
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

        if (data && data.length > 0) {
          const differentProducts = [...data].reverse();
          setCarouselProducts(differentProducts);
        }
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

        {/* Navigation Dots */}
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

      {/* 3. Main Products Grid Section (90% Width) */}
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

      {/* 4. CIRCLE SLIDER (Guaranteed Exact Same Price as ProductCard) */}
      {!loading && carouselProducts.length > 0 && (
        <div className="w-[90%] mx-auto py-6 relative group">
          
          {/* Left Arrow Button */}
          <button 
            onClick={() => handleScroll(-400)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-slate-900 w-11 h-11 rounded-full shadow-lg flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-slate-200 cursor-pointer"
          >
            ❮
          </button>

          {/* Scrollable Container */}
          <div 
            ref={sliderRef}
            className="flex items-center justify-between gap-6 sm:gap-8 overflow-x-auto scroll-smooth py-4 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {carouselProducts.map((item) => {
              const title = item.title || item.name;
              const image = item.image || (item.images && item.images[0]);
              
              // 🔴 EXACT MATCH LOGIC FOR PRODUCT CARD PRICE & MRP:
              // Checking discountPrice / price / sellingPrice vs originalPrice / mrp
              const sellingPrice = item.discountPrice || item.price || item.sellingPrice;
              const mrp = item.originalPrice || item.mrp;
              
              // Only calculate savings if valid MRP exists and is higher than Selling Price
              const savings = (mrp && Number(mrp) > Number(sellingPrice)) ? (Number(mrp) - Number(sellingPrice)) : 0;

              return (
                <Link 
                  key={item._id} 
                  to={`/product/${item._id}`} 
                  className="flex flex-col items-center shrink-0 group/circle cursor-pointer relative"
                >
                  {/* PERFECT CIRCULAR IMAGE */}
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-56 lg:h-56 aspect-square rounded-full overflow-hidden shadow-md group-hover/circle:scale-105 transition duration-300 bg-slate-50 border border-slate-100">
                    <img 
                      src={image} 
                      alt={title} 
                      className="w-full h-full object-cover rounded-full"
                    />

                    {/* 🏷️ Save ₹X Offer Badge (ProductCard wala same badge) */}
                    {savings > 0 && (
                      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] sm:text-xs font-bold px-3 py-0.5 rounded-full shadow-md border border-white whitespace-nowrap z-10">
                        Save ₹{savings}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <p className="mt-3 text-xs sm:text-sm font-semibold text-slate-800 truncate max-w-43 text-center group-hover/circle:text-indigo-600 transition">
                    {title}
                  </p>
                  
                  {/* Price & Strikethrough MRP (ProductCard ke saath 100% matched) */}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                      ₹{sellingPrice}
                    </span>
                    {savings > 0 && (
                      <span className="text-[11px] text-slate-400 line-through font-medium">
                        ₹{mrp}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button 
            onClick={() => handleScroll(400)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/95 hover:bg-white text-slate-900 w-11 h-11 rounded-full shadow-lg flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-slate-200 cursor-pointer"
          >
            ❯
          </button>
        </div>
      )}

    </div>
  );
};

export default HomePage;