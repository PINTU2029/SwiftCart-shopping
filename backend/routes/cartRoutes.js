const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Cart ke sabhi routes protected hain

router.route('/')
  .get(getCart)
  .post(addToCart);

router.delete('/:productId', removeFromCart);

module.exports = router;