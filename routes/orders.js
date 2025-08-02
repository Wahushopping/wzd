const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const User = require("../models/User");
const authMiddleware = require('../middleware/authMiddleware');

const sendOrderEmail = require("../utils/sendOrderEmail");
const sendAdminOrderEmail = require("../utils/sendAdminOrderEmail");

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Middleware to verify token (for normal users)
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Place Order (requires user login)
router.post("/", authMiddleware, async (req, res) => {
  console.log("📦 Incoming Order Body:", req.body);

  try {
    const { items, address, total, discount, finalAmount, paymentMethod } = req.body;

    // ✅ Construct full address
    const fullAddress = `${address.street}, ${address.place}, ${address.road}, ${address.city}, ${address.state} - ${address.pincode}`;

    const newOrder = new Order({
      user: req.userId || req.user._id,
      items,
      address: {
        ...address,
        fullAddress, // ✅ Add the full address field
      },
      total,
      discount,
      finalAmount,
      paymentMethod,
    });

    await newOrder.save();

    res.json({ orderId: newOrder._id });
  } catch (err) {
    console.error("❌ Order Save Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});




// ✅ Return item from an order
router.post("/:orderId/return", auth, async (req, res) => {
  const { itemId, reason } = req.body;
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Check if the order belongs to the user
    if (String(order.user) !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized access to order" });
    }

    const item = order.items.find(i => String(i._id) === itemId);
    if (!item) return res.status(404).json({ message: "Item not found in order" });

    // Mark item as return requested
    item.returnRequested = true;
    item.returnReason = reason;
    item.returnDate = new Date();

    await order.save();

    res.status(200).json({ message: "Return request submitted successfully" });
  } catch (err) {
    console.error("Return request error:", err);
    res.status(500).json({ message: "Failed to request return" });
  }
});


// ✅ Get orders of logged-in user
router.get("/my", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// ✅ Get all orders — NO admin check
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// ✅ Update status — NO admin check
// Example: Order update route
// ✅ Update status & delivery date
router.put("/:id/status", async (req, res) => {
  try {
    const { status, deliveryDate } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status, ...(deliveryDate && { deliveryDate }) },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    console.error("Order update failed:", err);
    res.status(500).json({ message: "Error updating order" });
  }
});


// ✅ Admin: Get all return requests
router.get("/returns", async (req, res) => {
  try {
    const ordersWithReturns = await Order.find({
      "items.returnRequested": true
    })
    .populate("user", "name email")
    .sort({ createdAt: -1 });

    res.json(ordersWithReturns);
  } catch (err) {
    console.error("Error fetching returns:", err);
    res.status(500).json({ message: "Error fetching returns" });
  }
});



// ✅ Admin: Approve or reject a return
router.put("/:orderId/return/:itemId", async (req, res) => {
  const { approved } = req.body;

  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const item = order.items.find(i => String(i._id) === req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found in order" });

    item.returnStatus = approved ? "Approved" : "Rejected";

    await order.save();

    res.status(200).json({ message: "Return status updated successfully" });
  } catch (err) {
    console.error("Error updating return status:", err);
    res.status(500).json({ message: "Failed to update return status" });
  }
});


module.exports = router;
