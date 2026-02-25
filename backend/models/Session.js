const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  isActive: { type: Boolean, default: true },
  
  // The actual attendance log for this specific lecture
  attendees: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    timestamp: { type: Date, default: Date.now },
    deviceId: { type: String, required: true } // Captured from FingerprintJS to stop multi-logins
  }]
});

module.exports = mongoose.model('Session', SessionSchema);
