import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from "../services/api";
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import Rating from '../components/product/Rating';
import Loader from '../components/common/Loader';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Edit Review States
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Normal Add to Cart (Navigates to Cart)
  const handleAddToCart = async () => {
    await addToCart(product._id, qty);
    toast.success('Added to Cart!');
    navigate('/cart');
  };

  // Direct Buy Now (Navigates directly to Checkout)
  const handleBuyNow = async () => {
    await addToCart(product._id, qty);
    navigate('/checkout');
  };

  // Submit New Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      return toast.error('Please enter a comment for your review.');
    }

    try {
      setSubmittingReview(true);
      await API.post(`/products/${id}/reviews`, {
        rating: Number(rating),
        comment,
      });

      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Delete Review Handler
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Kya aap is review ko delete karna chahte hain?')) {
      try {
        await API.delete(`/products/${id}/reviews/${reviewId}`);
        toast.success('Review deleted successfully!');
        fetchProduct();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  // Start Edit Review
  const handleStartEdit = (rev) => {
    setEditingReviewId(rev._id);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
  };

  // Update Review Handler
  const handleUpdateReview = async (reviewId) => {
    if (!editComment.trim()) {
      return toast.error('Comment cannot be empty.');
    }

    try {
      await API.put(`/products/${id}/reviews/${reviewId}`, {
        rating: Number(editRating),
        comment: editComment,
      });

      toast.success('Review updated successfully!');
      setEditingReviewId(null);
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update review');
    }
  };

  if (loading) return <Loader />;
  if (!product) return <div className="text-center py-12">Product not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Product Image & Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-100">
        {/* Product Image */}
        <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-200">
          <img
            src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/500'}
            alt={product.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{product.title}</h1>
            <Rating
              value={product.rating || product.ratings || 0}
              text={`${product.numReviews || product.numOfReviews || 0} customer reviews`}
            />
            <p className="text-3xl font-extrabold text-slate-900">₹{product.price}</p>
            <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1 font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add To Cart + Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
              >
                Add To Cart 🛒
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-100"
              >
                Buy Now ⚡
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- CUSTOMER REVIEWS SECTION --- */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-100 shadow-sm space-y-8">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
          Customer Reviews & Ratings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Write a Review Box */}
          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl h-fit space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Write a Customer Review</h3>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Select Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full text-sm p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ - 5 Stars (Excellent)</option>
                    <option value="4">⭐⭐⭐⭐ - 4 Stars (Good)</option>
                    <option value="3">⭐⭐⭐ - 3 Stars (Average)</option>
                    <option value="2">⭐⭐ - 2 Stars (Poor)</option>
                    <option value="1">⭐ - 1 Star (Terrible)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Your Experience
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Write your detailed review about this product..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full text-sm p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 placeholder-slate-400"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-lg transition shadow disabled:bg-indigo-400"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3.5 rounded-xl">
                Please{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="font-bold underline text-indigo-600"
                >
                  Login
                </button>{' '}
                to write a review for this product.
              </div>
            )}
          </div>

          {/* Reviews List Display */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-base mb-2">
              Reviews ({product.reviews?.length || 0})
            </h3>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-3 max-h-450px overflow-y-auto pr-1">
                {product.reviews.map((rev) => {
                  const isOwner = user && (user._id === rev.user || user._id === rev.user?._id);
                  const isAdmin = user?.role === 'admin' || user?.isAdmin;

                  return (
                    <div
                      key={rev._id}
                      className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2"
                    >
                      {editingReviewId === rev._id ? (
                        <div className="space-y-3 bg-white p-3 rounded-lg border border-indigo-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-600">Editing Review</span>
                            <select
                              value={editRating}
                              onChange={(e) => setEditRating(e.target.value)}
                              className="text-xs p-1 border border-slate-300 rounded focus:outline-none"
                            >
                              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                              <option value="4">⭐⭐⭐⭐ (4)</option>
                              <option value="3">⭐⭐⭐ (3)</option>
                              <option value="2">⭐⭐ (2)</option>
                              <option value="1">⭐ (1)</option>
                            </select>
                          </div>
                          <textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            className="w-full text-xs p-2 border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
                            rows="2"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleUpdateReview(rev._id)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3 py-1 rounded transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingReviewId(null)}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold px-3 py-1 rounded transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-900">{rev.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-amber-500 text-xs font-bold">
                                {'★'.repeat(rev.rating)}
                                <span className="text-slate-300">{'★'.repeat(5 - rev.rating)}</span>
                              </span>

                              {(isOwner || isAdmin) && (
                                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                                  {isOwner && (
                                    <button
                                      onClick={() => handleStartEdit(rev)}
                                      className="text-xs text-indigo-600 font-bold hover:underline"
                                      title="Edit Review"
                                    >
                                      ✏️ Edit
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteReview(rev._id)}
                                    className="text-xs text-red-600 font-bold hover:underline"
                                    title="Delete Review"
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                          <span className="text-[10px] text-slate-400 block pt-1">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-400 text-xs">
                No reviews yet. Be the first to share your thoughts on this product!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;