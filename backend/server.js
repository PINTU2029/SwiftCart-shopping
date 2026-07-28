const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// 1. Environment Variables Load Karna
dotenv.config();

// 2. MongoDB Database Connect Karna
connectDB();

const app = express();

// 3. Essential Middlewares
app.use(express.json()); // Request body parse (JSON) karne ke liye
app.use(cors());         // Cross-Origin Requests allow karne ke liye

// 4. Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// 5. API Endpoints Setup
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payment', paymentRoutes);

// 6. Root/Test Route
app.get('/', (req, res) => {
  res.send('E-Commerce API is running successfully...');
});

// 7. Custom Error Handling Middlewares 
app.use(notFound);
app.use(errorHandler);

// 8. Server Listen
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});