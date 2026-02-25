const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Should be hashed with bcrypt in production
  
  department: { type: String, required: true },
  
  // The subjects this professor teaches
  assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }]
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);
