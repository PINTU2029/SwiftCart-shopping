import React from 'react';

const ProductFilter = ({ selectedCategory, setCategory, categories }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
      <h3 className="font-bold text-slate-800 text-base">Filter Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategory('')}
          className={`px-3 py-1.5 text-xs rounded-full font-medium transition ${
            selectedCategory === ''
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 text-xs rounded-full font-medium transition ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;