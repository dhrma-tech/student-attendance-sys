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
    const pwMatch = user.password ? user.password === password : false;
    if (!pwMatch) {
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

router.post('/register', async (req, res) => {
  try {
    const { name, email, prnNumber, password, branch, year, parentPhone } = req.body;
    if (!name || !email || !prnNumber || !password || !branch || year == null || !parentPhone) {
      return res.status(400).json({ error: 'Missing required fields: name, email, prnNumber, password, branch, year, parentPhone.' });
    }
    const existing = await Student.findOne({ $or: [{ email }, { prnNumber }] });
    if (existing) {
      return res.status(400).json({ error: existing.email === email ? 'Email already registered.' : 'PRN number already registered.' });
    }
    const student = await Student.create({ name, email, prnNumber, password, branch, year, parentPhone });
    const token = jwt.sign(
      { id: student._id, role: 'student', name: student.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: student._id, name: student.name, role: 'student' }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email or PRN already exists.' });
    }
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

module.exports = router;