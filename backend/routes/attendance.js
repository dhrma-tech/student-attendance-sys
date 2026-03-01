const express = require('express');
const router = express.Router();

const Session = require('../models/Session');
const Student = require('../models/Student');
const { validateScan } = require('../utils/totp');

router.get('/recent', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const sessions = await Session.find()
      .sort({ startTime: -1 })
      .limit(10)
      .populate('attendees.studentId', 'name prnNumber')
      .lean();
    const recent = [];
    sessions.forEach((s) => {
      (s.attendees || []).forEach((a) => {
        if (a.studentId) {
          recent.push({
            _id: a.studentId._id,
            studentName: a.studentId.name,
            prnNumber: a.studentId.prnNumber,
            sessionId: s._id,
          });
        }
      });
    });
    res.json(recent.slice(0, limit));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch recent attendance.' });
  }
});

router.post('/scan', async (req, res) => {
  try {
    const { studentId, sessionId, classId, scannedHash, deviceId } = req.body;

    // STEP 1: Validate the Rotating QR Hash (The 10-Second Window)
    // This blocks students from using photos sent to WhatsApp groups
    const isValid = validateScan(classId, sessionId, scannedHash);
    if (!isValid) {
      return res.status(400).json({ error: 'QR Code expired. Please scan the current code directly from the projector.' });
    }

    // STEP 2: Verify the Lecture Session is Active
    const session = await Session.findById(sessionId);
    if (!session || !session.isActive) {
      return res.status(400).json({ error: 'This lecture session is closed or does not exist.' });
    }

    // STEP 3: Verify Student & Anti-Proxy Device Check
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    // Bind the phone to the student on their first scan, or check against existing binding
    if (!student.registeredDeviceId) {
      student.registeredDeviceId = deviceId;
      await student.save();
    } else if (student.registeredDeviceId !== deviceId) {
      return res.status(403).json({ error: 'Device mismatch! You can only mark attendance from your primary registered phone.' });
    }

    // STEP 4: Prevent Double-Scanning in the Same Lecture
    const alreadyMarked = session.attendees.find(
      (attendee) => attendee.studentId.toString() === studentId
    );
    if (alreadyMarked) {
      return res.status(400).json({ message: 'Your attendance is already recorded for this lecture.' });
    }

    // STEP 5: Save Attendance to Database
    session.attendees.push({ studentId, deviceId });
    await session.save();

    // STEP 6: Real-Time Projector Update
    // req.io is attached in server.js to allow route files to emit WebSocket events
    if (req.io) {
      req.io.to(sessionId).emit('student_scanned', {
        studentId: student._id,
        name: student.name,
        prnNumber: student.prnNumber // Useful for verifying against university records
      });
    }

    return res.status(200).json({ success: 'Attendance successfully verified and marked!' });

  } catch (error) {
    console.error('Attendance Scan Error:', error);
    return res.status(500).json({ error: 'Internal server error during scan verification.' });
  }
});

module.exports = router;