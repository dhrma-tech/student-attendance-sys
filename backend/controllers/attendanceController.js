const attendanceService = require('../services/attendanceService');

const scanAttendance = async (req, res, next) => {
  try {
    const { studentId, sessionId, classId, scannedHash, deviceId, latitude, longitude } = req.body;
    const result = await attendanceService.scanAttendance(
      studentId, 
      sessionId, 
      classId, 
      scannedHash, 
      deviceId, 
      latitude, 
      longitude,
      req.io
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getSessionAttendance = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const result = await attendanceService.getSessionAttendance(sessionId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getStudentAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;
    const result = await attendanceService.getStudentAttendance(studentId, startDate, endDate);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scanAttendance,
  getSessionAttendance,
  getStudentAttendance
};
