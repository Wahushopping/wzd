const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// POST /api/razorpay/order
router.post("/order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Amount in paisa (₹1 = 100)
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`
  };

  try {
    const order = await instance.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Creation Failed:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

module.exports = router;
