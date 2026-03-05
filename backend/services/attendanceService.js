const Session = require('../models/Session');
const Student = require('../models/Student');
const Class = require('../models/Class');
const { validateScan } = require('../utils/totp');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

const scanAttendance = async (studentId, sessionId, classId, scannedHash, deviceId, latitude, longitude, io) => {
  // Validate QR hash
  const isValid = validateScan(classId, sessionId, scannedHash);
  if (!isValid) {
    logger.warn(`Invalid QR scan attempt: student ${studentId}, session ${sessionId}`);
    throw new AppError('QR Code expired. Please scan the current code directly from the projector.', 400);
  }

  // Verify session is active
  const session = await Session.findById(sessionId).populate('classId');
  if (!session || !session.isActive) {
    throw new AppError('This lecture session is closed or does not exist.', 400);
  }

  // Verify student exists
  const student = await Student.findById(studentId);
  if (!student) {
    throw new AppError('Student profile not found.', 404);
  }

  // Check if student is enrolled in the class
  if (!session.classId.students.includes(student._id)) {
    logger.warn(`Unauthorized attendance attempt: student ${studentId} not in class ${classId}`);
    throw new AppError('You are not enrolled in this class.', 403);
  }

  // Device locking
  if (!student.registeredDeviceId) {
    student.registeredDeviceId = deviceId;
    await student.save();
    logger.info(`Device registered for student ${studentId}: ${deviceId}`);
  } else if (student.registeredDeviceId !== deviceId) {
    logger.warn(`Device mismatch for student ${studentId}: expected ${student.registeredDeviceId}, got ${deviceId}`);
    throw new AppError('Device mismatch! You can only mark attendance from your primary registered phone.', 403);
  }

  // Geolocation verification (if coordinates provided)
  if (latitude && longitude && session.classId.location) {
    const distance = calculateDistance(
      latitude, longitude,
      session.classId.location.latitude, 
      session.classId.location.longitude
    );
    
    if (distance > 50) { // 50 meter radius
      logger.warn(`Geolocation violation: student ${studentId} is ${distance}m from class location`);
      throw new AppError(`You are too far from the classroom (${Math.round(distance)}m). Maximum allowed distance is 50m.`, 403);
    }
  }

  // Prevent duplicate attendance
  const alreadyMarked = session.attendees.find(
    (attendee) => attendee.studentId.toString() === studentId
  );
  if (alreadyMarked) {
    throw new AppError('Your attendance is already recorded for this lecture.', 400);
  }

  // Save attendance
  session.attendees.push({ 
    studentId, 
    deviceId,
    timestamp: new Date(),
    location: latitude && longitude ? { latitude, longitude } : undefined
  });
  await session.save();

  // Real-time update
  if (io) {
    io.to(sessionId).emit('student_scanned', {
      studentId: student._id,
      name: student.name,
      prnNumber: student.prnNumber,
      timestamp: new Date()
    });

    io.to(sessionId).emit('attendanceUpdate', {
      totalAttendees: session.attendees.length,
      totalStudents: session.classId.students.length,
      percentage: Math.round((session.attendees.length / session.classId.students.length) * 100)
    });
  }

  logger.info(`Attendance marked: student ${studentId} in session ${sessionId}`);

  return { success: 'Attendance successfully verified and marked!' };
};

const getSessionAttendance = async (sessionId) => {
  const session = await Session.findById(sessionId)
    .populate('attendees.studentId', 'name prnNumber email')
    .populate('classId', 'courseCode courseName');

  if (!session) {
    throw new AppError('Session not found.', 404);
  }

  return {
    session: {
      id: session._id,
      class: session.classId,
      startTime: session.startTime,
      endTime: session.endTime,
      isActive: session.isActive,
      attendees: session.attendees
    }
  };
};

const getStudentAttendance = async (studentId, startDate, endDate) => {
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.startTime = {};
    if (startDate) dateFilter.startTime.$gte = new Date(startDate);
    if (endDate) dateFilter.startTime.$lte = new Date(endDate);
  }

  const sessions = await Session.find(dateFilter)
    .populate('classId', 'courseCode courseName')
    .populate('teacherId', 'name')
    .where('attendees.studentId').equals(studentId);

  const totalSessions = await Session.countDocuments(dateFilter)
    .where('classId.students').equals(studentId);

  const attendancePercentage = totalSessions > 0 ? (sessions.length / totalSessions) * 100 : 0;

  return {
    studentId,
    totalSessions,
    attendedSessions: sessions.length,
    attendancePercentage: Math.round(attendancePercentage),
    sessions
  };
};

module.exports = {
  scanAttendance,
  getSessionAttendance,
  getStudentAttendance
};
