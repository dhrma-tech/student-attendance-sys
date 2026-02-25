const express = require('express');
const router = express.Router();

// Import the Models and Security Engine
const Session = require('../models/Session');
const Student = require('../models/Student');
const { validateScan } = require('../utils/totp');

router.post('/scan', async (req, res) => {
  try {
    const { studentId, sessionId, classId, scannedHash, deviceId } = req.body;

    // STEP 1: Validate the Rotating QR Hash (The 10-Second Rule)
    const isValid = validateScan(classId, sessionId, scannedHash);
    if (!isValid) {
      return res.status(400).json({ error: 'QR Code expired or invalid. Please scan the current code on the projector.' });
    }

    // STEP 2: Verify the Session is Active
    const session = await Session.findById(sessionId);
    if (!session || !session.isActive) {
      return res.status(400).json({ error: 'This lecture session is closed or does not exist.' });
    }

    // STEP 3: Verify Student and Device Fingerprint (The Anti-Proxy Net)
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    if (!student.registeredDeviceId) {
      // If this is the student's very first time using the app, bind this phone to them.
      student.registeredDeviceId = deviceId;
      await student.save();
    } else if (student.registeredDeviceId !== deviceId) {
      // If they try to log in on a friend's phone to scan for them, block it immediately.
      return res.status(403).json({ error: 'Device mismatch! You can only mark attendance from your registered primary phone.' });
    }

    // STEP 4: Prevent Double-Scanning
    const alreadyMarked = session.attendees.find(
      (attendee) => attendee.studentId.toString() === studentId
    );
    if (alreadyMarked) {
      return res.status(400).json({ message: 'Your attendance is already recorded for this lecture.' });
    }

    // STEP 5: Save the Attendance to Database
    session.attendees.push({ studentId, deviceId });
    await session.save();

    // STEP 6: Real-Time Projector Update (The "Kahoot" Effect)
    // We use the 'req.io' object that we will attach in server.js
    if (req.io) {
      req.io.to(sessionId).emit('student_scanned', {
        studentId: student._id,
        name: student.name,
        prnNumber: student.prnNumber 
      });
    }

    return res.status(200).json({ success: 'Attendance successfully verified and marked!' });

  } catch (error) {
    console.error('Attendance Scan Error:', error);
    return res.status(500).json({ error: 'Internal server error during scan verification.' });
  }
});

module.exports = router;