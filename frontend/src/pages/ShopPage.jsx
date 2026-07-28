import React, { useState, useEffect } from 'react';
import API from "../services/api";
import ProductCard from '../components/product/ProductCard';
import ProductFilter from '../components/product/ProductFilter';
import Loader from '../components/common/Loader';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');

  const categories = ['Electronics', 'Fashion', 'Footwear', 'Home & Kitchen', 'Accessories'];

  useEffect(() => {
    const fetchShopProducts = async () => {
      try {
        setLoading(true);
        let url = '/products';
        const params = [];
        if (category) params.push(`category=${category}`);
        if (sort) params.push(`sort=${sort}`);
        if (params.length > 0) url += `?${params.join('&')}`;

        const { data } = await API.get(url);
        setProducts(data);
      } catch (error) {
        console.error('Error loading shop products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopProducts();
  }, [category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Explore All Products</h1>
          <p className="text-xs text-slate-500">Browse through our complete catalog</p>
        </div>

        {/* Sorting Dropdown */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
        >
          <option value="">Sort By: Default</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>
      </div>

      <ProductFilter selectedCategory={category} setCategory={setCategory} categories={categories} />

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-slate-500 font-medium">No products found in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;