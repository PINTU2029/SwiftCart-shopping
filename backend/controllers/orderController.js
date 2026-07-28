const Order = require('../models/orderModel');
const Razorpay = require('razorpay');

// @desc    Create new order
// @route   POST /api/v1/orders
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid,
      paymentResult,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'COD' ? false : (isPaid || false),
      paidAt: isPaid ? Date.now() : null,
      paymentResult: paymentResult || {},
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Razorpay Order ID
// @route   POST /api/v1/orders/razorpay
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    // Initialize Razorpay Instance
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(Number(amount) * 100), // Convert ₹ Rupees to Paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorOrder = await instance.orders.create(options);

    res.status(200).json(razorOrder);
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    res.status(500).json({ message: error.message || 'Failed to create Razorpay order' });
  }
};

// @desc    Get Razorpay Public Key ID
// @route   GET /api/v1/config/razorpay
// @access  Public / Private
const getRazorpayKey = async (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin Only)
// @route   GET /api/v1/orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status & delivery boy details
// @route   PUT /api/v1/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, deliveryBoy } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      // 1. Update Status if provided
      if (orderStatus) {
        order.orderStatus = orderStatus;
      }

      // 2. Save/Update Delivery Boy details (Name & Phone)
      if (deliveryBoy) {
        order.deliveryBoy = {
          name: deliveryBoy.name !== undefined ? deliveryBoy.name : order.deliveryBoy?.name || '',
          phone: deliveryBoy.phone !== undefined ? deliveryBoy.phone : order.deliveryBoy?.phone || '',
        };
      }

      // 3. Handle Delivered status logic
      if (orderStatus === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        if (order.paymentMethod === 'COD') {
          order.isPaid = true;
          order.paidAt = Date.now();
        }
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to delivered / paid (Admin Only)
// @route   PUT /api/v1/orders/:id/deliver
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      
      if (order.paymentMethod === 'COD') {
        order.isPaid = true;
        order.paidAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  createRazorpayOrder, // Exported Razorpay Order Handler
  getRazorpayKey,       // Exported Key Handler
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  updateOrderToDelivered,
};