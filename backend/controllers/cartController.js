const Cart = require('../models/cartModel');

// @desc    Get user cart
// @route   GET /api/v1/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, cartItems: [] });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart / Update quantity
// @route   POST /api/v1/cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, cartItems: [] });
    }

    const itemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.cartItems[itemIndex].quantity = quantity;
    } else {
      cart.cartItems.push({ product: productId, quantity });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('cartItems.product');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:productId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.cartItems = cart.cartItems.filter(
        (item) => item.product.toString() !== req.params.productId
      );
      await cart.save();
      const updatedCart = await Cart.findById(cart._id).populate('cartItems.product');
      res.json(updatedCart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart };