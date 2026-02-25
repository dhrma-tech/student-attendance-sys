const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';

router.post('/login', async (req, res) => {
  try {
    const { role, identifier, password } = req.body; 
    // identifier will be 'email' for teachers, 'prnNumber' for students

    let user;
    if (role === 'teacher') {
      user = await Teacher.findOne({ email: identifier });
    } else if (role === 'student') {
      user = await Student.findOne({ prnNumber: identifier });
    } else {
      return res.status(400).json({ error: 'Invalid role selected.' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // In a production app, you would use bcrypt.compare() here.
    // For this prototype, we are doing a direct string match, but 
    // remember to hash passwords when you launch!
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate the Token
    const token = jwt.sign(
      { id: user._id, role: role, name: user.name },
      JWT_SECRET,
      { expiresIn: '8h' } // Token lasts for a full college day
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, role }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

module.exports = router;