// routes/wishlist.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Wishlist = require("../models/Wishlist");

// Toggle Wishlist Item
router.post("/toggle", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { id, name, image, price } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      await Wishlist.create({ userId, items: [{ id, name, image, price }] });
      return res.json({ message: "💖 Added to Wishlist" });
    }

    const existing = wishlist.items.find(item => item.id === id);
    if (existing) {
      wishlist.items = wishlist.items.filter(item => item.id !== id);
      await wishlist.save();
      return res.json({ message: "💔 Removed from Wishlist" });
    } else {
      wishlist.items.push({ id, name, image, price });
      await wishlist.save();
      return res.json({ message: "💖 Added to Wishlist" });
    }
  } catch (err) {
    console.error("Wishlist toggle error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.userId });
    res.json({ items: wishlist?.items || [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
});

// DELETE /api/wishlist/remove/:id
router.delete("/remove/:id", authMiddleware, async (req, res) => {
  try {
    await Wishlist.updateOne(
      { userId: req.userId },
      { $pull: { items: { id: req.params.id } } }
    );
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
});


module.exports = router;
