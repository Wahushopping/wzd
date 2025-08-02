const express = require('express');
const router = express.Router();
const Cusual = require('../models/Cusual');

// GET all Cusual products
router.get('/', async (req, res) => {
  try {
    const cusualItems = await Cusual.find()
      .sort({ createdAt: -1 }) // Newest first
      .populate('productId');

    // Return only the populated product details
    res.json(cusualItems.map(item => item.productId));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add product to Cusual
router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const exists = await Cusual.findOne({ productId });
    if (exists) {
      return res.status(400).json({ error: 'Product already in Cusual' });
    }

    const newCusual = new Cusual({ productId });
    await newCusual.save();

    res.json({ message: 'Product added to Cusual' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove product from Cusual
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const deleted = await Cusual.findOneAndDelete({ productId });
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found in Cusual list' });
    }

    res.json({ message: 'Product removed from Cusual' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
