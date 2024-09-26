const { validationResult } = require('express-validator');  
const { registerUser, loginUser } = require('./auth/user.auth');
const User = require('../models/user.model');

// Controller for registering a new user
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: 'Validation failed', errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    const token = await registerUser(name, email, password, role);
    res.status(201).json({ token, msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: err.message });
  }
};

// Controller for logging in a user
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: 'Validation failed', errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const token = await loginUser(email, password);
    const user = await User.findOne({ email }).select('-password');

    res.json({ 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, 
      },
      msg: 'Login successful',
    });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: err.message });
  }
};

module.exports = {
  register,
  login,
};
