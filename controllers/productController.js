const Product = require('../models/Product');

// Get all products with filters
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    let query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort
    let sortOption = {};
    if (sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price_desc') sortOption.price = -1;
    else if (sort === 'name') sortOption.name = 1;
    else sortOption.createdAt = -1; // Default: newest first

    const products = await Product.find(query)
      .populate('category', 'name')
      .sort(sortOption);

    res.json(products);
  } catch (error) {
    console.error('❌ Get products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name description');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('❌ Get product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, price, unit, stock, image, discount } = req.body;

    const product = await Product.create({
      name,
      description,
      category,
      price,
      unit,
      stock,
      image,
      discount
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, price, unit, stock, image, discount, isActive } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price !== undefined ? price : product.price;
    product.unit = unit || product.unit;
    product.stock = stock !== undefined ? stock : product.stock;
    product.image = image || product.image;
    product.discount = discount !== undefined ? discount : product.discount;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('❌ Update product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Delete product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};