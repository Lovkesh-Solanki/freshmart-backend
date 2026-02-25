const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create order from cart
exports.createOrder = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode) {
      return res.status(400).json({ message: 'Please provide complete delivery address' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock availability
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Not enough stock for ${product.name}. Available: ${product.stock}` 
        });
      }
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price
    }));

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      deliveryAddress,
      totalAmount: cart.totalAmount,
      orderDate: new Date(),
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('❌ Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ✅ FIX: Allow admin to view any order, regular users only their own
    if (req.user.role === 'admin' || order.user._id.toString() === req.user._id.toString()) {
      res.status(200).json(order);
    } else {
      res.status(403).json({ message: 'Not authorized to view this order' });
    }

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};
// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated',
      order
    });
  } catch (error) {
    console.error('❌ Update order status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('❌ Get all orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};