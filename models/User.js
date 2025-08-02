const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "customer"
  },
  address: {
    name: String,
    phone: String,
    email: String,
    street: String,
    road: String,
    place: String,
    pincode: String,
    state: String,
    city: String
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
