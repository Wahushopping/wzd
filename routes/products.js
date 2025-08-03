const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// 🟢 GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// 🟢 GET single product by ID
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: "Error fetching product" });
  }
});

// 🟢 POST a new product
router.post('/add', upload.fields([
  { name: 'moreImages', maxCount: 5 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
   const { name, price, title, image, description, option, sizes} = req.body;
   const originalprice = req.body.originalprice || req.body.originalPrice || 0;
let parsedSizes = [];
try {
  parsedSizes = sizes ? JSON.parse(sizes) : [];
} catch (err) {
  return res.status(400).json({ message: 'Invalid sizes format' });
}



    const moreImages = req.files['moreImages']?.map(file => file.filename) || [];
    const video = req.files['video']?.[0]?.filename || null;

    const newProduct = new Product({
      name,
      title,
      price,
      originalprice,
      image,
      description,
      sizes: parsedSizes,
      moreImages,
      video,
      option,
     
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added', product: newProduct });

  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: 'Error adding product' });
  }
});

// 🟢 PUT update product
router.put('/:id', upload.fields([
  { name: 'moreImages', maxCount: 5 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, price, title, image, description,  option, sizes } = req.body;
    const originalprice = req.body.originalprice || req.body.originalPrice || 0;

    // ✅ Parse sizes safely
    let parsedSizes = [];
    try {
      parsedSizes = sizes ? JSON.parse(sizes) : [];
    } catch (err) {
      return res.status(400).json({ message: 'Invalid sizes format' });
    }

     // --- Fix for moreImages ---
    let moreImages = product.moreImages || [];
    if (req.files['moreImages']) {
      const newImages = req.files['moreImages'].map(file => file.filename);
      moreImages = [...moreImages, ...newImages]; // Merge old + new
    }

    

    // ✅ Handle video safely
    let video = product.video;
    if (req.files['video']) {
      if (product.video) {
        const videoPath = path.join(__dirname, '../uploads', product.video);
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      }
      video = req.files['video'][0].filename;
    }

    // ✅ Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          title,
          price,
          image,
          description,
          sizes: parsedSizes,
          moreImages,
          video,
          originalprice,
          option
        }
      },
      { new: true } // return the updated product
    );

    res.json({ message: 'Product updated', product: updatedProduct });

  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Error updating product' });
  }
});



// 🟢 DELETE product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.moreImages && Array.isArray(product.moreImages)) {
  product.moreImages.forEach(filename => {
    const filePath = path.join(__dirname, '../uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
}


    if (product.video) {
      const videoPath = path.join(__dirname, '../uploads', product.video);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product and files deleted' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Error deleting product' });
  }
});





module.exports = router;
