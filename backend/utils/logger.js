const winston = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');

// Custom format for structured logging
const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
  winston.format.json()
);

// Create different loggers for different purposes
const createLogger = (label, filename) => {
  return winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: customFormat,
    defaultMeta: { 
      service: 'attendance-system',
      label: label,
      pid: process.pid
    },
    transports: [
      new winston.transports.File({ 
        filename: path.join(logDir, filename),
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ]
  });
};

// Main application logger
const logger = createLogger('app', 'combined.log');

// Error-specific logger
const errorLogger = createLogger('error', 'error.log');
errorLogger.level = 'error';

// Security logger for authentication and authorization events
const securityLogger = createLogger('security', 'security.log');

// Attendance logger for attendance-specific events
const attendanceLogger = createLogger('attendance', 'attendance.log');

// Console logging for development
if (process.env.NODE_ENV !== 'production') {
  const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, label, metadata }) => {
      let msg = `${timestamp} [${label}] ${level}: ${message}`;
      if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
      }
      return msg;
    })
  );

  logger.add(new winston.transports.Console({ format: consoleFormat }));
  errorLogger.add(new winston.transports.Console({ format: consoleFormat }));
}

// Helper functions for structured logging
const logAuth = {
  loginAttempt: (identifier, role, ip, success = false, error = null) => {
    securityLogger.info('Login attempt', {
      event: 'login_attempt',
      identifier,
      role,
      ip,
      success,
      timestamp: new Date().toISOString(),
      ...(error && { error: error.message })
    });
  },
  
  loginSuccess: (user, ip) => {
    securityLogger.info('Login successful', {
      event: 'login_success',
      userId: user.id,
      role: user.role,
      name: user.name,
      ip,
      timestamp: new Date().toISOString()
    });
  },
  
  logout: (userId, role) => {
    securityLogger.info('Logout', {
      event: 'logout',
      userId,
      role,
      timestamp: new Date().toISOString()
    });
  },
  
  unauthorizedAccess: (userId, role, route, ip) => {
    securityLogger.warn('Unauthorized access attempt', {
      event: 'unauthorized_access',
      userId,
      role,
      route,
      ip,
      timestamp: new Date().toISOString()
    });
  }
};

const logAttendance = {
  scanAttempt: (studentId, sessionId, success = false, error = null) => {
    attendanceLogger.info('Attendance scan attempt', {
      event: 'attendance_scan',
      studentId,
      sessionId,
      success,
      timestamp: new Date().toISOString(),
      ...(error && { error: error.message })
    });
  },
  
  scanSuccess: (studentId, sessionId, deviceId, location) => {
    attendanceLogger.info('Attendance marked', {
      event: 'attendance_marked',
      studentId,
      sessionId,
      deviceId,
      location,
      timestamp: new Date().toISOString()
    });
  },
  
  deviceMismatch: (studentId, expectedDevice, actualDevice) => {
    securityLogger.warn('Device mismatch detected', {
      event: 'device_mismatch',
      studentId,
      expectedDevice,
      actualDevice,
      timestamp: new Date().toISOString()
    });
  },
  
  geolocationViolation: (studentId, sessionId, distance, actualLocation, expectedLocation) => {
    securityLogger.warn('Geolocation violation', {
      event: 'geolocation_violation',
      studentId,
      sessionId,
      distance,
      actualLocation,
      expectedLocation,
      timestamp: new Date().toISOString()
    });
  }
};

const logSystem = {
  serverStart: (port) => {
    logger.info('Server started', {
      event: 'server_start',
      port,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  },
  
  databaseConnect: (host) => {
    logger.info('Database connected', {
      event: 'database_connect',
      host,
      timestamp: new Date().toISOString()
    });
  },
  
  gracefulShutdown: (signal) => {
    logger.info('Graceful shutdown initiated', {
      event: 'graceful_shutdown',
      signal,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  logger,
  errorLogger,
  securityLogger,
  attendanceLogger,
  logAuth,
  logAttendance,
  logSystem
};
