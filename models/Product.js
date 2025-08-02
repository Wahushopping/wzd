const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  title: String,
  price: Number,
  originalprice: { type: Number, required: true, default: 0 },
  image: String, // Main image URL
  description: String,
  sizes: [String],
 


  moreImages: {
  type: [String],
  default: []
},
video: {
  type: String,
  default: null
},
 option: String, // ✅ New field
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
