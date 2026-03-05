const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key';
const ACCESS_TOKEN_EXPIRY = '30m';
const REFRESH_TOKEN_EXPIRY = '7d';

const login = async (role, identifier, password) => {
  let user;
  
  if (role === 'admin') {
    user = await Admin.findOne({ email: identifier });
  } else if (role === 'teacher') {
    user = await Teacher.findOne({ email: identifier });
  } else if (role === 'student') {
    user = await Student.findOne({ prnNumber: identifier });
  } else {
    throw new AppError('Invalid role selected.', 400);
  }

  if (!user) {
    logger.warn(`Login attempt with non-existent ${role}: ${identifier}`);
    throw new AppError('User not found.', 404);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    logger.warn(`Invalid password attempt for ${role}: ${identifier}`);
    throw new AppError('Invalid credentials.', 401);
  }

  const accessToken = jwt.sign(
    { id: user._id, role: role, name: user.name },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: role },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  logger.info(`Successful login: ${role} ${identifier}`);

  return {
    message: 'Login successful',
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, role }
  };
};

const refreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('No refresh token provided.', 401);
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return { accessToken };
  } catch (error) {
    throw new AppError('Invalid refresh token.', 401);
  }
};

const logout = async (refreshToken) => {
  // In a production environment, you might want to blacklist the token
  // For now, we'll just log the logout
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      logger.info(`Logout: user ${decoded.id}`);
    } catch (error) {
      // Token was invalid, but that's okay for logout
    }
  }
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

module.exports = {
  login,
  refreshToken,
  logout,
  hashPassword
};
