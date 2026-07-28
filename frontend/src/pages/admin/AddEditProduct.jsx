import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import API from '../../services/api';
import { toast } from 'react-hot-toast';

const AddEditProduct = () => {
  const { id } = useParams(); // ID check for Edit vs Add mode
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    stock: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchProductDetails = async () => {
        try {
          const { data } = await API.get(`/products/${id}`);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            price: data.price || '',
            category: data.category || 'Electronics',
            stock: data.stock || '',
          });
          if (data.images && data.images.length > 0) {
            setImagePreview(data.images[0]);
          }
        } catch (error) {
          toast.error('Failed to load product details');
        }
      };
      fetchProductDetails();
    }
  }, [id, isEdit]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Direct preview from device
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // FormData for direct file upload
    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('description', formData.description);
    dataToSend.append('price', formData.price);
    dataToSend.append('stock', formData.stock);
    dataToSend.append('category', formData.category);

    if (imageFile) {
      dataToSend.append('image', imageFile); // Direct device image attachment
    }

    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      if (isEdit) {
        await API.put(`/products/${id}`, dataToSend, config);
        toast.success('Product updated successfully!');
      } else {
        await API.post('/products', dataToSend, config);
        toast.success('Product created successfully!');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows="4"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹)</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Footwear">Footwear</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* Direct File Picker Section */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Product Image (From Device)
            </label>
            <div className="flex items-center gap-4 mt-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-xs file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100 cursor-pointer border border-slate-200 rounded-lg"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-14 h-14 object-cover rounded-lg border border-slate-300"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-md disabled:opacity-50 mt-4"
          >
            {loading ? 'Uploading & Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddEditProduct;