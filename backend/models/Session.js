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
    deviceId: { type: String, required: true }, // Captured from FingerprintJS to stop multi-logins
    location: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  }]
}, { timestamps: true });

// Compound index to prevent duplicate attendance
SessionSchema.index({ classId: 1, startTime: -1 });
SessionSchema.index({ teacherId: 1 });
SessionSchema.index({ 'attendees.studentId': 1, 'attendees.timestamp': -1 });

module.exports = mongoose.model('Session', SessionSchema);
