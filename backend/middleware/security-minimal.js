const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const compression = require('compression');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const loginLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many login attempts, please try again later.'
);

const attendanceLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10, // 10 scans per minute
  'Too many attendance attempts, please try again later.'
);

const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per 15 minutes
  'Too many requests from this IP, please try again later.'
);

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim()) 
  : ['http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

// Minimal security middleware for Express 5 compatibility
const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
  cors(corsOptions),
  compression(),
  cookieParser(),
  express.json({ limit: '10kb' }),
  mongoSanitize(),
  hpp({
    whitelist: ['sort', 'fields', 'page', 'limit']
  })
];

module.exports = {
  loginLimiter,
  attendanceLimiter,
  generalLimiter,
  securityMiddleware
};
