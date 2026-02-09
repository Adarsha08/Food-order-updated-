import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/otp.js';
import DeliveryMan from '../models/DeliveryMan.js';

const router = express.Router();
const JWT_SECRET = 'hwloooooooowowojiueq3e3qenq3ueq3';

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

// 4. DELIVERY MAN REGISTRATION
router.post('/register-delivery', async (req, res) => {
  try {
    const { name, email, phone, address, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !phone || !address || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if delivery man already exists
    const existingDeliveryMan = await DeliveryMan.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingDeliveryMan) {
      return res.status(400).json({ error: 'Email or phone number already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new delivery man
    const deliveryMan = await DeliveryMan.create({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role: 'delivery',
      status: 'available'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please login with your credentials.',
      deliveryMan: {
        id: deliveryMan._id,
        name: deliveryMan.name,
        email: deliveryMan.email,
        phone: deliveryMan.phone,
        address: deliveryMan.address
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. DELIVERY MAN LOGIN
router.post('/login-delivery', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const deliveryMan = await DeliveryMan.findOne({ email });

    if (!deliveryMan) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, deliveryMan.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    deliveryMan.status = 'available';
    await deliveryMan.save();

    const token = jwt.sign(
      { userId: deliveryMan._id, role: deliveryMan.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: deliveryMan._id,
        name: deliveryMan.name,
        email: deliveryMan.email,
        phone: deliveryMan.phone,
        address: deliveryMan.address,
        role: deliveryMan.role,
        status: deliveryMan.status,
        totalDeliveries: deliveryMan.totalDeliveries,
        rating: deliveryMan.rating
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. UPDATE DELIVERY MAN STATUS
router.put('/update-delivery-status', async (req, res) => {
  try {
    const { status } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const deliveryMan = await DeliveryMan.findById(decoded.userId);

    if (!deliveryMan) {
      return res.status(404).json({ error: 'Delivery man not found' });
    }

    if (!['available', 'busy', 'offline'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    deliveryMan.status = status;
    await deliveryMan.save();

    res.json({
      success: true,
      message: 'Status updated successfully',
      deliveryMan: {
        id: deliveryMan._id,
        name: deliveryMan.name,
        email: deliveryMan.email,
        phone: deliveryMan.phone,
        address: deliveryMan.address,
        role: deliveryMan.role,
        status: deliveryMan.status,
        totalDeliveries: deliveryMan.totalDeliveries,
        rating: deliveryMan.rating
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;