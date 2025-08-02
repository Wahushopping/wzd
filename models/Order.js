const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      id: String,
      name: String,
      price: Number,
      qty: Number,
      size: String,
      image: String,
      title: String,

      returnRequested: { type: Boolean, default: false },
      returnReason: { type: String, default: "" },
      returnDate: { type: Date },
      returnStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
      }
    }
  ],

  address: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    fullAddress: { type: String, required: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true }
  },

  total: { type: Number, required: true },
  discount: { type: Number, default: 0 },               // ✅ NEW
  finalAmount: { type: Number, required: true },        // ✅ NEW
  paymentMethod: { type: String, required: true },      // ✅ NEW

  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  deliveryDate: { type: Date },

  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },

  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  deliveryDate: { type: Date }

});

module.exports = mongoose.model("Order", orderSchema);
