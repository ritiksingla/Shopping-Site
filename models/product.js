const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
