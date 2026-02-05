// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'delivery'], 
    default: 'user' 
  },
  password: String, // Only for delivery persons
  status: { 
    type: String, 
    enum: ['available', 'busy', 'offline'], 
    default: 'offline' 
  }, // Only relevant for delivery
  addresses: [{
    street: String,
    city: String,
    pincode: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);