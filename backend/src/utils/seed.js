const bcrypt = require('bcryptjs');
const { initializeDatabase, sequelize } = require('../config/db');
const { User, Store, Rating } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await initializeDatabase();
    
    // Force sync to reset database tables
    console.log('Resetting tables...');
    await sequelize.sync({ force: true });
    console.log('Tables reset successfully.');

    // Common password hash for test data: "Password123!"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    console.log('Seeding users...');
    
    // Seed Admin
    const admin = await User.create({
      name: 'System Administrator Admin',
      email: 'admin@storerating.com',
      password: hashedPassword,
      address: '100 Admin Plaza, Suite 400, Chicago, IL 60601',
      role: 'admin'
    });

    // Seed Store Owners
    const owner1 = await User.create({
      name: 'Store Owner Alpha Manager',
      email: 'owner.alpha@storerating.com',
      password: hashedPassword,
      address: '77 Owner Avenue, Building B, Los Angeles, CA 90001',
      role: 'store_owner'
    });

    const owner2 = await User.create({
      name: 'Store Owner Beta Director',
      email: 'owner.beta@storerating.com',
      password: hashedPassword,
      address: '88 Retail Boulevard, Suite C, San Francisco, CA 94101',
      role: 'store_owner'
    });

    const owner3 = await User.create({
      name: 'Store Owner Gamma Supervisor',
      email: 'owner.gamma@storerating.com',
      password: hashedPassword,
      address: '99 Franchise Court, Unit D, Seattle, WA 98101',
      role: 'store_owner'
    });

    // Seed Normal Users
    const user1 = await User.create({
      name: 'Normal User Alexander Jones',
      email: 'alex.jones@storerating.com',
      password: hashedPassword,
      address: '123 Elm Street, Apt 4B, New York, NY 10001',
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Normal User Jessica Taylor',
      email: 'jessica.t@storerating.com',
      password: hashedPassword,
      address: '456 Oak Lane, Dallas, TX 75201',
      role: 'user'
    });

    const user3 = await User.create({
      name: 'Normal User Christopher Davis',
      email: 'chris.davis@storerating.com',
      password: hashedPassword,
      address: '789 Pine Road, Suite 12, Miami, FL 33101',
      role: 'user'
    });

    const user4 = await User.create({
      name: 'Normal User Elizabeth Thomas',
      email: 'elizabeth.t@storerating.com',
      password: hashedPassword,
      address: '321 Maple Drive, Denver, CO 80201',
      role: 'user'
    });

    const user5 = await User.create({
      name: 'Normal User Jonathan Martin',
      email: 'jonathan.m@storerating.com',
      password: hashedPassword,
      address: '654 Birch Way, Boston, MA 02101',
      role: 'user'
    });

    console.log('Seeding stores...');
    
    // Seed Stores
    const store1 = await Store.create({
      name: 'The Super Store Alpha Express',
      email: 'contact.alpha@superstore.com',
      address: '101 Highway Route 66, Los Angeles, CA 90001',
      ownerId: owner1.id
    });

    const store2 = await Store.create({
      name: 'The Mega Store Beta Express',
      email: 'info.beta@megastore.com',
      address: '202 Shopping Boulevard, San Francisco, CA 94101',
      ownerId: owner2.id
    });

    const store3 = await Store.create({
      name: 'The Ultimate Store Gamma Outlet',
      email: 'hello.gamma@ultimatestore.com',
      address: '303 Commercial Plaza, Seattle, WA 98101',
      ownerId: owner3.id
    });

    console.log('Seeding ratings...');

    // Seed Ratings (User 1-5 rating Stores 1-3)
    await Rating.create({ userId: user1.id, storeId: store1.id, rating: 5 });
    await Rating.create({ userId: user1.id, storeId: store2.id, rating: 4 });
    await Rating.create({ userId: user1.id, storeId: store3.id, rating: 3 });

    await Rating.create({ userId: user2.id, storeId: store1.id, rating: 4 });
    await Rating.create({ userId: user2.id, storeId: store2.id, rating: 5 });

    await Rating.create({ userId: user3.id, storeId: store1.id, rating: 3 });
    await Rating.create({ userId: user3.id, storeId: store3.id, rating: 5 });

    await Rating.create({ userId: user4.id, storeId: store2.id, rating: 4 });
    await Rating.create({ userId: user4.id, storeId: store3.id, rating: 4 });

    await Rating.create({ userId: user5.id, storeId: store1.id, rating: 5 });
    await Rating.create({ userId: user5.id, storeId: store2.id, rating: 3 });
    await Rating.create({ userId: user5.id, storeId: store3.id, rating: 4 });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
