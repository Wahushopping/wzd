const express = require('express');
const router = express.Router();
const Bag = require('../models/Bag');

// Get all bag products
router.get('/', async (req, res) => {
  try {
    const items = await Bag.find()
      .populate('productId')
      .sort({ createdAt: -1 });

    res.json(items.map(item => item.productId));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add product to bags
router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'Product ID required' });

    const exists = await Bag.findOne({ productId });
    if (exists) return res.status(400).json({ error: 'Product already in Bag category' });

    const newItem = new Bag({ productId });
    await newItem.save();

    res.json({ message: 'Product added to Bag category' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product from bags
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const deleted = await Bag.findOneAndDelete({ productId });
    if (!deleted) return res.status(404).json({ error: 'Product not found in Bag category' });

    res.json({ message: 'Removed from Bag category' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
