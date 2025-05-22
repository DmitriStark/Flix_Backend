const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateRegister } = require('../middleware/validation');
const auth = require('../middleware/auth');

router.post('/register', validateRegister, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const immediateTest = await bcrypt.compare(password, hashedPassword);

    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    console.log('User object before save:', {
      username: user.username,
      email: user.email,
      password: user.password
    });

    await user.save();
    
    console.log('User saved. Retrieving from database...');
    
    const savedUser = await User.findOne({ username });
    console.log('Retrieved user from database:', {
      username: savedUser.username,
      password: savedUser.password
    });

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'menora_flix_super_secure_secret_key_2024', { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('=== LOGIN DEBUG ===');
    console.log('Login attempt for username:', username);

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    }).select('+password'); 

    console.log('Database query result:', user ? 'User found' : 'User not found');
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      
      if (!user.password) {
        console.log('ERROR: No password field in user document!');
      }
      
      const newHash = await bcrypt.hash(password, 10);
      const newTest = await bcrypt.compare(password, newHash);
      
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const payload = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'menora_flix_super_secure_secret_key_2024', { expiresIn: '24h' });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

router.get('/debug/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    res.json({
      found: !!user,
      user: user ? {
        id: user._id,
        username: user.username,
        email: user.email,
        hasPassword: !!user.password,
        passwordHash: user.password,
        createdAt: user.createdAt
      } : null
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;