const express = require('express');
const router = express.Router();
const Trending = require('../models/Trending');

// ✅ Get all trending products
router.get('/', async (req, res) => {
  try {
    const trending = await Trending.find()
      .sort({ createdAt: -1 }) // Show newest first
      .populate('productId');

    res.json(trending.map(item => item.productId));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add product to trending
router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'Product ID required' });
    }

    const exists = await Trending.findOne({ productId });
    if (exists) {
      return res.status(400).json({ error: 'Product already in trending list' });
    }

    const newTrend = new Trending({ productId });
    await newTrend.save();

    res.json({ message: 'Added to trending list' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete product from trending
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const deleted = await Trending.findOneAndDelete({ productId });
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found in trending list' });
    }

    res.json({ message: 'Removed from trending list' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
