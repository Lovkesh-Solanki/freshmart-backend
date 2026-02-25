const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/user');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Mock Categories
const categories = [
  {
    name: 'Vegetables & Fruits',
    description: 'Fresh vegetables and fruits',
    image: 'https://cdn-icons-png.flaticon.com/512/1625/1625048.png'
  },
  {
    name: 'Dairy & Breakfast',
    description: 'Milk, bread, eggs and more',
    image: 'https://cdn-icons-png.flaticon.com/512/3050/3050158.png'
  },
  {
    name: 'Munchies',
    description: 'Chips, namkeen, biscuits',
    image: 'https://cdn-icons-png.flaticon.com/512/3480/3480822.png'
  },
  {
    name: 'Cold Drinks & Juices',
    description: 'Soft drinks and juices',
    image: 'https://cdn-icons-png.flaticon.com/512/2738/2738060.png'
  },
  {
    name: 'Instant & Frozen Food',
    description: 'Ready to cook items',
    image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png'
  },
  {
    name: 'Tea, Coffee & Health Drinks',
    description: 'Beverages and health drinks',
    image: 'https://cdn-icons-png.flaticon.com/512/924/924514.png'
  },
  {
    name: 'Bakery & Biscuits',
    description: 'Cakes, cookies and breads',
    image: 'https://cdn-icons-png.flaticon.com/512/3081/3081924.png'
  },
  {
    name: 'Sweet Tooth',
    description: 'Chocolates, candies, desserts',
    image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png'
  }
];

// Mock Products
const products = [
  // Vegetables & Fruits
  {
    name: 'Fresh Tomatoes',
    description: 'Farm fresh red tomatoes, rich in vitamins',
    price: 40,
    unit: '500g',
    stock: 100,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'
  },
  {
    name: 'Green Capsicum',
    description: 'Fresh green bell peppers',
    price: 60,
    unit: '500g',
    stock: 80,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400'
  },
  {
    name: 'Bananas',
    description: 'Fresh yellow bananas, rich in potassium',
    price: 50,
    unit: '1 dozen',
    stock: 150,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'
  },
  {
    name: 'Red Onions',
    description: 'Premium quality red onions',
    price: 35,
    unit: '1kg',
    stock: 200,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400'
  },
  {
    name: 'Fresh Apples',
    description: 'Crisp and sweet apples',
    price: 180,
    unit: '1kg',
    stock: 75,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400'
  },

  // Dairy & Breakfast
  {
    name: 'Amul Taaza Milk',
    description: 'Fresh toned milk',
    price: 28,
    unit: '500ml',
    stock: 200,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'
  },
  {
    name: 'Mother Dairy Curd',
    description: 'Fresh creamy curd',
    price: 30,
    unit: '400g',
    stock: 100,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400'
  },
  {
    name: 'Brown Bread',
    description: 'Whole wheat brown bread',
    price: 45,
    unit: '400g',
    stock: 120,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'
  },
  {
    name: 'Farm Fresh Eggs',
    description: 'White eggs, protein rich',
    price: 75,
    unit: '12 pieces',
    stock: 90,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'
  },
  {
    name: 'Amul Butter',
    description: 'Salted fresh butter',
    price: 55,
    unit: '100g',
    stock: 150,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400'
  },

  // Munchies
  {
    name: 'Lays Chips',
    description: 'Classic salted potato chips',
    price: 20,
    unit: '52g',
    stock: 300,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'
  },
  {
    name: 'Kurkure Masala Munch',
    description: 'Spicy crunchy snack',
    price: 20,
    unit: '82g',
    stock: 250,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400'
  },
  {
    name: 'Parle-G Biscuits',
    description: 'Classic glucose biscuits',
    price: 10,
    unit: '100g',
    stock: 400,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'
  },
  {
    name: 'Haldirams Bhujia',
    description: 'Spicy gram flour noodles',
    price: 40,
    unit: '200g',
    stock: 180,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400'
  },

  // Cold Drinks & Juices
  {
    name: 'Coca Cola',
    description: 'Refreshing cola drink',
    price: 40,
    unit: '750ml',
    stock: 200,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400'
  },
  {
    name: 'Tropicana Orange Juice',
    description: '100% orange juice',
    price: 120,
    unit: '1L',
    stock: 100,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400'
  },
  {
    name: 'Sprite',
    description: 'Lemon lime soda',
    price: 40,
    unit: '750ml',
    stock: 180,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400'
  },
  {
    name: 'Real Fruit Juice Mixed',
    description: 'Mixed fruit juice',
    price: 100,
    unit: '1L',
    stock: 120,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400'
  },

  // Instant & Frozen Food
  {
    name: 'Maggi Noodles',
    description: '2-minute instant noodles',
    price: 14,
    unit: '70g',
    stock: 500,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'
  },
  {
    name: 'McCain French Fries',
    description: 'Ready to fry potato fries',
    price: 150,
    unit: '420g',
    stock: 80,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400'
  },
  {
    name: 'Yippee Noodles',
    description: 'Magic masala instant noodles',
    price: 12,
    unit: '60g',
    stock: 300,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400'
  },

  // Tea, Coffee & Health Drinks
  {
    name: 'Tata Tea Gold',
    description: 'Premium black tea',
    price: 260,
    unit: '500g',
    stock: 100,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1597318130878-ecd273f0bef0?w=400'
  },
  {
    name: 'Nescafe Classic Coffee',
    description: 'Pure instant coffee',
    price: 280,
    unit: '200g',
    stock: 90,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400'
  },
  {
    name: 'Bournvita Health Drink',
    description: 'Chocolate health drink',
    price: 340,
    unit: '500g',
    stock: 110,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1623428454614-abaf00244e52?w=400'
  },
  {
    name: 'Red Label Tea',
    description: 'Natural care tea',
    price: 240,
    unit: '500g',
    stock: 130,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400'
  },

  // Bakery & Biscuits
  {
    name: 'Britannia Good Day',
    description: 'Butter cookies',
    price: 35,
    unit: '150g',
    stock: 200,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1568471173238-85f1a9c0a25a?w=400'
  },
  {
    name: 'Sunfeast Dark Fantasy',
    description: 'Choco filled biscuits',
    price: 40,
    unit: '150g',
    stock: 180,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1590080876876-6a39f6c5e83e?w=400'
  },
  {
    name: 'Milk Bikis',
    description: 'Milk biscuits',
    price: 20,
    unit: '100g',
    stock: 250,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1621939517424-5fc7439c8e85?w=400'
  },

  // Sweet Tooth
  {
    name: 'Dairy Milk Chocolate',
    description: 'Smooth milk chocolate',
    price: 45,
    unit: '55g',
    stock: 300,
    discount: 5,
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400'
  },
  {
    name: 'KitKat',
    description: 'Crispy wafer chocolate',
    price: 40,
    unit: '37.3g',
    stock: 280,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4ba652cc?w=400'
  },
  {
    name: '5 Star Chocolate',
    description: 'Caramel chocolate bar',
    price: 10,
    unit: '22g',
    stock: 400,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1575318635194-7dcb0a52c331?w=400'
  },
  {
    name: 'Munch Chocolate',
    description: 'Crunchy chocolate bar',
    price: 10,
    unit: '11g',
    stock: 350,
    discount: 0,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400'
  }
];

// Admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@blinkit.com',
  password: 'admin123',
  phone: '9999999999',
  role: 'admin'
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({ email: adminUser.email });

    // Create admin user
    console.log('👤 Creating admin user...');
    await User.create(adminUser);
    console.log('✅ Admin user created: admin@blinkit.com / admin123');

    // Insert categories
    console.log('📁 Inserting categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ ${createdCategories.length} categories inserted`);

    // Map products to categories
    const productsWithCategories = products.map((product, index) => {
      let categoryIndex;
      if (index < 5) categoryIndex = 0; // Vegetables & Fruits
      else if (index < 10) categoryIndex = 1; // Dairy & Breakfast
      else if (index < 14) categoryIndex = 2; // Munchies
      else if (index < 18) categoryIndex = 3; // Cold Drinks & Juices
      else if (index < 21) categoryIndex = 4; // Instant & Frozen Food
      else if (index < 25) categoryIndex = 5; // Tea, Coffee & Health Drinks
      else if (index < 28) categoryIndex = 6; // Bakery & Biscuits
      else categoryIndex = 7; // Sweet Tooth

      return {
        ...product,
        category: createdCategories[categoryIndex]._id
      };
    });

    // Insert products
    console.log('🛒 Inserting products...');
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ ${createdProducts.length} products inserted`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Products: ${createdProducts.length}`);
    console.log(`   - Admin User: admin@blinkit.com / admin123`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();