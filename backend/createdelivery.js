import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('✅ MongoDB connected');
    
    // Check if delivery person already exists
    const existingUser = await User.findOne({ phone: '8888888888' });
    if (existingUser) {
      console.log('⚠️ Delivery person already exists!');
      process.exit();
    }
    
    const hashedPassword = await bcrypt.hash('delivery123', 10);
    
    await User.create({
      phone: '8888888888',
      name: 'Ravi Kumar',
      role: 'delivery',
      password: hashedPassword,
      status: 'available'
    });
    
    console.log('✅ Delivery person created!');
    console.log('Phone: 8888888888');
    console.log('Password: delivery123');
    process.exit();
  })
  .catch(err => {
    console.log('❌ Error:', err);
    process.exit();
  });