const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Should be hashed with bcrypt in production
  role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'teacher' },
  
  department: { type: String, required: true },
  
  // The subjects this professor teaches
  assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
}, { timestamps: true });

// Indexes for performance
TeacherSchema.index({ email: 1 });
TeacherSchema.index({ role: 1 });
TeacherSchema.index({ department: 1 });

module.exports = mongoose.model('Teacher', TeacherSchema);
