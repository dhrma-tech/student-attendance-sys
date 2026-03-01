const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/', async (req, res) => {
  try {
    const students = await Student.find().lean();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) return res.status(404).json({ error: 'Student not found.' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch student.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, prnNumber, branch, year, parentPhone, password } = req.body;
    if (!name || !email || !prnNumber || !branch || year == null || !parentPhone) {
      return res.status(400).json({ error: 'Missing required fields: name, email, prnNumber, branch, year, parentPhone.' });
    }
    const student = await Student.create({ name, email, prnNumber, branch, year, parentPhone, password: password || undefined });
    res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email or PRN already exists.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create student.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, email, prnNumber, branch, year, parentPhone } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, prnNumber, branch, year, parentPhone },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found.' });
    res.json(student);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email or PRN already exists.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to update student.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found.' });
    res.json({ message: 'Student deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete student.' });
  }
});

module.exports = router;
