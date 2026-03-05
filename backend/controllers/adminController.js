const adminService = require('../services/adminService');

const createTeacher = async (req, res, next) => {
  try {
    const teacherData = req.body;
    const result = await adminService.createTeacher(teacherData);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, branch, year } = req.query;
    const result = await adminService.getStudents(page, limit, branch, year);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const resetStudentDevice = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const result = await adminService.resetStudentDevice(studentId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getAttendanceReports = async (req, res, next) => {
  try {
    const { startDate, endDate, classId } = req.query;
    const result = await adminService.getAttendanceReports(startDate, endDate, classId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getLowAttendanceStudents = async (req, res, next) => {
  try {
    const { threshold = 75 } = req.query;
    const result = await adminService.getLowAttendanceStudents(threshold);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const exportAttendanceCSV = async (req, res, next) => {
  try {
    const { startDate, endDate, classId } = req.query;
    const csvData = await adminService.exportAttendanceCSV(startDate, endDate, classId);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance.csv');
    res.send(csvData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeacher,
  getStudents,
  resetStudentDevice,
  getAttendanceReports,
  getLowAttendanceStudents,
  exportAttendanceCSV
};
