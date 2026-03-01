const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Session = require('../models/Session');
const Class = require('../models/Class');

router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalClasses = await Class.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const todaySessions = await Session.find({
      startTime: { $gte: todayStart, $lte: todayEnd },
    }).lean();
    const presentTodaySet = new Set();
    todaySessions.forEach((s) => {
      (s.attendees || []).forEach((a) => presentTodaySet.add(a.studentId?.toString()));
    });
    const presentToday = presentTodaySet.size;
    const absentToday = Math.max(0, totalStudents - presentToday);

    // Last 7 days trend (simple)
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      const sessions = await Session.find({
        startTime: { $gte: d, $lte: end },
      }).lean();
      const set = new Set();
      sessions.forEach((s) => {
        (s.attendees || []).forEach((a) => set.add(a.studentId?.toString()));
      });
      trend.push({
        date: d.toISOString().slice(0, 10),
        present: set.size,
      });
    }

    res.json({
      totalStudents,
      presentToday,
      absentToday,
      totalClasses,
      attendanceTrend: trend,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats.' });
  }
});

module.exports = router;
