const express = require('express');
const router = express.Router();
const Session = require('../models/Session');

router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const filter = {};
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.startTime = { $gte: start, $lte: end };
    }
    const sessions = await Session.find(filter).populate('classId', 'courseName courseCode').lean();
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sessions.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { classId, teacherId } = req.body;
    if (!classId || !teacherId) {
      return res.status(400).json({ error: 'classId and teacherId required.' });
    }
    const session = await Session.create({ classId, teacherId });
    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create session.' });
  }
});

module.exports = router;
