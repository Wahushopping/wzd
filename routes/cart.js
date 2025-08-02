const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/authMiddleware");

// 🔄 GET /api/cart - Fetch user's cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId || req.user?._id;
    const cart = await Cart.findOne({ userId });

    res.json({ items: cart?.items || [] });
  } catch (err) {
    console.error("Cart fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// ➕ POST /api/cart - Add items to cart
router.post("/", authMiddleware, async (req, res) => {
  const userId = req.userId || req.user?._id;
  let items = req.body.items;

// If a single item is sent instead of array
if (!items && req.body.id) {
  items = [req.body]; // Support single product object
}

if (!items || !Array.isArray(items)) {
  return res.status(400).json({ message: "Invalid items" });
}


  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // 🆕 Create a new cart
      cart = new Cart({ userId, items });
    } else {
      // 🔄 Merge or push items
      for (let newItem of items) {
  const existingIndex = cart.items.findIndex(
    item => item.id === newItem.id && item.size === newItem.size
  );

  if (existingIndex !== -1) {
    // Replace qty instead of adding
    cart.items[existingIndex].qty = newItem.qty;
  } else {
    // Add new item
    cart.items.push(newItem);
  }
}

    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Cart post error:", error.message);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

// ❌ DELETE /api/cart - Remove a specific item
router.delete("/", authMiddleware, async (req, res) => {
  const userId = req.userId || req.user?._id;
  const { id, size } = req.body;

  if (!id || !size) {
    return res.status(400).json({ message: "Missing id or size" });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => !(item.id === id && item.size === size));

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();
    res.json({ message: "Item removed from cart", cart });
  } catch (err) {
    console.error("Cart delete error:", err.message);
    res.status(500).json({ message: "Failed to remove item" });
  }
});

module.exports = router;
