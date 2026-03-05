const sessionService = require('../services/sessionService');

const createSession = async (req, res, next) => {
  try {
    const { classId } = req.body;
    const teacherId = req.user.id;
    const session = await sessionService.createSession(classId, teacherId);
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('sessionCreated', {
        sessionId: session._id,
        classId: session.classId._id,
        message: 'New session started'
      });
    }
    
    res.json({
      message: 'Session created successfully',
      session
    });
  } catch (error) {
    next(error);
  }
};

const endSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const teacherId = req.user.id;
    const session = await sessionService.endSession(sessionId, teacherId);
    
    // Emit real-time update
    if (req.io) {
      req.io.to(sessionId).emit('sessionEnded', {
        sessionId,
        message: 'Session has ended'
      });
    }
    
    res.json({
      message: 'Session ended successfully',
      session
    });
  } catch (error) {
    next(error);
  }
};

const getActiveSessions = async (req, res, next) => {
  try {
    const teacherId = req.user.id;
    const sessions = await sessionService.getActiveSessions(teacherId);
    res.json({ sessions });
  } catch (error) {
    next(error);
  }
};

const getSessionStats = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const stats = await sessionService.getSessionStats(sessionId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSession,
  endSession,
  getActiveSessions,
  getSessionStats
};
