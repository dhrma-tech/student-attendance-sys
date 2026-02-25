const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true }, // e.g., 'MT101'
  courseName: { type: String, required: true }, // e.g., 'Engineering Graphics' or 'Fluid Mechanics'
  
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  
  // The professor in charge
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  
  // All students meant to be in this room
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

module.exports = mongoose.model('Class', ClassSchema);
