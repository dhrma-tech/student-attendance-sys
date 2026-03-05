const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token required.', 401);
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (jwtError) {
      throw new AppError('Invalid or expired access token.', 401);
    }
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt: ${req.user.role} trying to access protected route`);
      return next(new AppError('Insufficient permissions.', 403));
    }

    next();
  };
};

const roleAuth = (minimumRole) => {
  const roleHierarchy = {
    'student': 1,
    'teacher': 2,
    'admin': 3
  };

  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401));
    }

    const userRoleLevel = roleHierarchy[req.user.role];
    const requiredRoleLevel = roleHierarchy[minimumRole];

    if (userRoleLevel < requiredRoleLevel) {
      logger.warn(`Role hierarchy violation: ${req.user.role} attempting ${minimumRole} level access`);
      return next(new AppError(`Access denied. Minimum role required: ${minimumRole}`, 403));
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  roleAuth
};
