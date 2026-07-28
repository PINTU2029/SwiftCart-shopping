const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderToDelivered,
  updateOrderStatus,
  createRazorpayOrder, // <--- 1. Import Razorpay Order Handler
  getRazorpayKey,       // <--- 2. Import Razorpay Key Handler
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Base Routes (Create order for Users / Get all orders for Admin)
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

// Razorpay Payment Routes
router.route('/razorpay').post(protect, createRazorpayOrder); // <--- Razorpay Order ID Generation Route
router.route('/config/razorpay').get(getRazorpayKey);           // <--- Razorpay Public Key Route

router.route('/myorders').get(protect, getMyOrders);

// Status Update Route
router.route('/:id/status').put(protect, updateOrderStatus);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;