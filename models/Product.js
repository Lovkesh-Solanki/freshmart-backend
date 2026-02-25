const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide product category']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0
  },
  unit: {
  type: String,
  required: [true, 'Please provide unit']
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  image: {
    type: String,
    default: ''
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for final price after discount
productSchema.virtual('finalPrice').get(function() {
  return this.price - (this.price * this.discount / 100);
});

module.exports = mongoose.model('Product', productSchema);