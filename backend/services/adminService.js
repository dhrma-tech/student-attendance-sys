const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Session = require('../models/Session');
const Class = require('../models/Class');
const { hashPassword } = require('./authService');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');
const CSVGenerator = require('../utils/csvGenerator');

const createTeacher = async (teacherData) => {
  const { name, email, password, department } = teacherData;

  const existingTeacher = await Teacher.findOne({ email });
  if (existingTeacher) {
    throw new AppError('Teacher with this email already exists.', 409);
  }

  const hashedPassword = await hashPassword(password);

  const teacher = new Teacher({
    name,
    email,
    password: hashedPassword,
    department
  });

  await teacher.save();
  logger.info(`New teacher created: ${email}`);

  return {
    message: 'Teacher created successfully',
    teacher: {
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      department: teacher.department
    }
  };
};

const getStudents = async (page = 1, limit = 10, branch, year) => {
  const filter = {};
  if (branch) filter.branch = branch;
  if (year) filter.year = parseInt(year);

  const students = await Student.find(filter)
    .select('-password')
    .populate('enrolledClasses', 'courseCode courseName')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Student.countDocuments(filter);

  return {
    students,
    pagination: {
      current: page,
      pages: Math.ceil(total / limit),
      total
    }
  };
};

const resetStudentDevice = async (studentId) => {
  const student = await Student.findById(studentId);
  if (!student) {
    throw new AppError('Student not found.', 404);
  }

  student.registeredDeviceId = undefined;
  await student.save();

  logger.info(`Device reset for student: ${studentId}`);

  return {
    message: 'Student device registration reset successfully',
    student: {
      id: student._id,
      name: student.name,
      prnNumber: student.prnNumber
    }
  };
};

const getAttendanceReports = async (startDate, endDate, classId) => {
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.startTime = {};
    if (startDate) dateFilter.startTime.$gte = new Date(startDate);
    if (endDate) dateFilter.startTime.$lte = new Date(endDate);
  }

  if (classId) {
    dateFilter.classId = classId;
  }

  const sessions = await Session.find(dateFilter)
    .populate('classId', 'courseCode courseName branch semester')
    .populate('teacherId', 'name department')
    .populate('attendees.studentId', 'name prnNumber email')
    .sort({ startTime: -1 });

  const report = sessions.map(session => ({
    sessionId: session._id,
    class: session.classId,
    teacher: session.teacherId,
    date: session.startTime,
    totalStudents: session.classId?.students?.length || 0,
    attendeesCount: session.attendees.length,
    attendancePercentage: session.classId?.students?.length > 0 
      ? Math.round((session.attendees.length / session.classId.students.length) * 100)
      : 0,
    attendees: session.attendees
  }));

  return { report };
};

const getLowAttendanceStudents = async (threshold = 75) => {
  const classes = await Class.find({}).populate('students');
  
  const lowAttendanceStudents = [];

  for (const classItem of classes) {
    const sessions = await Session.find({ 
      classId: classItem._id,
      startTime: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    });

    for (const student of classItem.students) {
      const attendedSessions = await Session.countDocuments({
        classId: classItem._id,
        'attendees.studentId': student._id,
        startTime: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      });

      const attendancePercentage = sessions.length > 0 ? (attendedSessions / sessions.length) * 100 : 0;

      if (attendancePercentage < threshold) {
        lowAttendanceStudents.push({
          student,
          class: classItem,
          attendancePercentage: Math.round(attendancePercentage),
          attendedSessions,
          totalSessions: sessions.length
        });
      }
    }
  }

  return { students: lowAttendanceStudents, threshold };
};

const exportAttendanceCSV = async (startDate, endDate, classId) => {
  const { report } = await getAttendanceReports(startDate, endDate, classId);
  
  const csvData = CSVGenerator.generateAttendanceCSV(report);
  
  logger.info(`Attendance CSV exported for date range: ${startDate} to ${endDate}`);
  
  return csvData;
};

module.exports = {
  createTeacher,
  getStudents,
  resetStudentDevice,
  getAttendanceReports,
  getLowAttendanceStudents,
  exportAttendanceCSV
};
