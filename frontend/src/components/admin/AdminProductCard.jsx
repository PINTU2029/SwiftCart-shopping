import React from 'react';
import { Link } from 'react-router-dom';

const AdminProductCard = ({ product, onDelete }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/80'}
          alt={product.title}
          className="w-16 h-16 object-cover rounded-lg border border-slate-100"
        />
        <div>
          <h4 className="font-bold text-slate-800 line-clamp-1">{product.title}</h4>
          <p className="text-xs text-indigo-600 font-medium">{product.category}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span>Price: <strong className="text-slate-900">₹{product.price}</strong></span>
            <span>Stock: <strong className="text-slate-900">{product.stock}</strong></span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Edit Button */}
        <Link
          to={`/admin/products/edit/${product._id}`}
          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold transition"
        >
          Edit
        </Link>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(product._id)}
          className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AdminProductCard;