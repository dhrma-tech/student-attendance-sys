const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'admin' },
  
  department: { type: String, default: 'Administration' },
  permissions: [{
    type: String,
    enum: [
      'manage_teachers',
      'manage_students', 
      'view_reports',
      'export_data',
      'reset_devices',
      'manage_classes',
      'system_settings'
    ]
  }]
}, { timestamps: true });

// Indexes for performance
AdminSchema.index({ email: 1 });
AdminSchema.index({ role: 1 });

module.exports = mongoose.model('Admin', AdminSchema);
