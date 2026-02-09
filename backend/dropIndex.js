import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/foodorder';

async function dropIndex() {
  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    await db.collection('users').dropIndex('email_1');
    console.log('✓ Successfully dropped email_1 index');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

dropIndex();
