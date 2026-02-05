import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/otp.js';

const router = express.Router();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 1. SEND OTP (For Users)
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = generateOTP();
    
    await OTP.deleteMany({ phone });
    await OTP.create({ phone, otp });
    
    console.log(`OTP for ${phone}: ${otp}`);
    
    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      otp
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. VERIFY OTP & LOGIN (For Users)
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp, name } = req.body;
    
    const otpRecord = await OTP.findOne({ phone, otp });
    
    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = await User.create({ phone, name, role: 'user' });
    }
    
    await OTP.deleteOne({ phone, otp });
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. PASSWORD LOGIN (For Delivery Persons)
router.post('/login-password', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    const user = await User.findOne({ phone, role: 'delivery' });
    
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    
    user.status = 'available';
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;