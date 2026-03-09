const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Create order from cart
exports.createOrder = async (req, res) => {
  try {
    console.log('📦 Order request:', req.body);
    console.log('👤 User:', req.user._id);

    const { shippingAddress, phone, paymentMethod } = req.body;

    // Validate
    if (!shippingAddress) {
      return res.status(400).json({ 
        message: 'Shipping address is required' 
      });
    }

    const { addressLine1, city, state, pincode } = shippingAddress;
    
    if (!addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({ 
        message: 'Please provide complete shipping address' 
      });
    }

    if (!phone) {
      return res.status(400).json({ 
        message: 'Phone number is required' 
      });
    }

    // Get cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `${item.product.name} is out of stock` 
        });
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      phone,
      paymentMethod: paymentMethod || 'cod',
      totalAmount: cart.totalAmount,
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    });

    // Update stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    console.log('✅ Order created:', order._id);
    res.status(201).json(order);

  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({ 
      message: error.message || 'Failed to create order' 
    });
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

    // Allow admin to view any order, regular users only their own
    if (req.user.role === 'admin' || order.user._id.toString() === req.user._id.toString()) {
      res.json(order);
    } else {
      res.status(403).json({ message: 'Not authorized to view this order' });
    }

  } catch (error) {
    console.error('❌ Get order error:', error);
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
