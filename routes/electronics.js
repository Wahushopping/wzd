const express = require('express');
const router = express.Router();
const Electronics = require('../models/Electronics');

// Get all electronics products
router.get('/', async (req, res) => {
  try {
    const electronics = await Electronics.find()
      .populate('productId')
      .sort({ createdAt: -1 });

    res.json(electronics.map(item => item.productId));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add product to electronics
router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'Product ID required' });

    const exists = await Electronics.findOne({ productId });
    if (exists) return res.status(400).json({ error: 'Product already in Electronics category' });

    const newElectronics = new Electronics({ productId });
    await newElectronics.save();

    res.json({ message: 'Product added to Electronics category' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product from electronics
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const deleted = await Electronics.findOneAndDelete({ productId });
    if (!deleted) return res.status(404).json({ error: 'Product not found in Electronics category' });

    res.json({ message: 'Removed from Electronics category' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
