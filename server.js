const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const app = express();
const PORT = process.env.PORT || 5000;




// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log('✅ Connected to MongoDB'))
   .catch(err => console.error('❌ MongoDB connection error:', err));


// Sample route
app.get('/', (req, res) => {
  res.send('MiniShop Backend API is running!');
});

// Routes placeholder
app.use('/api/homeAppliance', require('./routes/homeAppliance'));
app.use('/api/bags', require('./routes/bags'));
app.use('/api/sport', require('./routes/sport'));
app.use('/api/mobile', require('./routes/mobile'));
app.use('/api/watch', require('./routes/watch'));
app.use('/api/kid', require('./routes/kid'));
app.use('/api/bottomwear', require('./routes/bottomwear'));
app.use('/api/formal', require('./routes/formal'));
app.use('/api/electronics', require('./routes/electronics'));
app.use('/api/beauty', require('./routes/beauty'));
app.use('/api/shoes', require('./routes/shoes'));
app.use('/api/cusual', require('./routes/cusual'));
app.use('/api/dress', require('./routes/dress'));
app.use('/api/sarees', require('./routes/sarees'));
app.use('/api/kurta', require('./routes/kurta'));
app.use('/api/topwear', require('./routes/topwear'));
app.use('/api/trending', require('./routes/trending'));
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/user')); 
app.use('/api/cart', require('./routes/cart')); // ✅ Add this line
app.use("/api/wishlist", require("./routes/wishlist"));






app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
