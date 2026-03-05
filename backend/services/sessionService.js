const Session = require('../models/Session');
const Class = require('../models/Class');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

const createSession = async (classId, teacherId) => {
  // Verify class exists and teacher is authorized
  const classData = await Class.findById(classId);
  if (!classData) {
    throw new AppError('Class not found.', 404);
  }

  if (classData.teacherId.toString() !== teacherId) {
    throw new AppError('You are not authorized to create sessions for this class.', 403);
  }

  // Check if there's already an active session for this class
  const existingSession = await Session.findOne({
    classId,
    isActive: true,
    endTime: null
  });

  if (existingSession) {
    throw new AppError('There is already an active session for this class.', 400);
  }

  // Create new session
  const session = new Session({
    classId,
    teacherId,
    startTime: new Date(),
    isActive: true
  });

  await session.save();
  await session.populate('classId', 'courseCode courseName students');
  
  logger.info(`Session created: ${session._id} for class ${classId}`);

  return session;
};

const endSession = async (sessionId, teacherId) => {
  const session = await Session.findById(sessionId);
  
  if (!session) {
    throw new AppError('Session not found.', 404);
  }

  if (session.teacherId.toString() !== teacherId) {
    throw new AppError('You are not authorized to end this session.', 403);
  }

  if (!session.isActive) {
    throw new AppError('Session is already ended.', 400);
  }

  session.endTime = new Date();
  session.isActive = false;
  await session.save();

  logger.info(`Session ended: ${sessionId}`);

  return session;
};

const getActiveSessions = async (teacherId) => {
  const sessions = await Session.find({
    teacherId,
    isActive: true
  }).populate('classId', 'courseCode courseName');

  return sessions;
};

const getSessionStats = async (sessionId) => {
  const session = await Session.findById(sessionId)
    .populate('classId', 'courseCode courseName students')
    .populate('attendees.studentId', 'name prnNumber');

  if (!session) {
    throw new AppError('Session not found.', 404);
  }

  const totalStudents = session.classId.students.length;
  const attendedStudents = session.attendees.length;
  const attendancePercentage = totalStudents > 0 ? Math.round((attendedStudents / totalStudents) * 100) : 0;

  return {
    sessionId: session._id,
    class: session.classId,
    startTime: session.startTime,
    endTime: session.endTime,
    isActive: session.isActive,
    totalStudents,
    attendedStudents,
    attendancePercentage,
    recentAttendees: session.attendees.slice(-10).reverse() // Last 10 attendees
  };
};

module.exports = {
  createSession,
  endSession,
  getActiveSessions,
  getSessionStats
};
