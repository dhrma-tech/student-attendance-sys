const express = require('express');
const router = express.Router();
const Class = require('../models/Class');

router.get('/', async (req, res) => {
  try {
    const classes = await Class.find().populate('teacherId', 'name').lean();
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch classes.' });
  }
});

module.exports = router;
