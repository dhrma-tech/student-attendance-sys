const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();

// Global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const connectDB = require('./config/database');
const { validateEnv } = require('./config/envValidation');
const { securityMiddleware, generalLimiter } = require('./middleware/security');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { logSystem, logger } = require('./utils/logger');
const { generateRotatingQR } = require('./utils/totp');

// Validate environment variables
validateEnv();

const app = express();

// Connect database
connectDB();

// Security middleware
app.use(securityMiddleware);
app.use(generalLimiter);

// JSON parser
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Attach socket to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});


// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});


// API ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/sessions', require('./routes/session'));
app.use('/api/classes', require('./routes/class'));
app.use('/api/admin', require('./routes/admin'));


// SERVE FRONTEND (production)
const frontendPath = path.join(__dirname, '../frontend/dist');

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});


// SOCKET LOGIC
io.on('connection', (socket) => {
  logger.info(`New dashboard connected: ${socket.id}`);

  socket.on('join_session', ({ sessionId, userRole, userId }) => {

    socket.join(sessionId);
    socket.sessionId = sessionId;
    socket.userRole = userRole;
    socket.userId = userId;

    logger.info(`User ${userId} (${userRole}) joined session ${sessionId}`);

    socket.to(sessionId).emit('user_joined', {
      userId,
      userRole,
      timestamp: new Date()
    });

  });

  socket.on('start_session', ({ classId, sessionId }) => {

    socket.join(sessionId);

    logger.info(`Session ${sessionId} started for Class ${classId}`);

    socket.emit('qr_update', generateRotatingQR(classId, sessionId));

    const qrInterval = setInterval(() => {
      io.to(sessionId).emit(
        'qr_update',
        generateRotatingQR(classId, sessionId)
      );
    }, 10000);

    socket.on('disconnect', () => {
      clearInterval(qrInterval);
      logger.info(`Dashboard disconnected for ${sessionId}`);
    });

  });

  socket.on('leave_session', ({ sessionId }) => {

    socket.leave(sessionId);

    socket.to(sessionId).emit('user_left', {
      userId: socket.userId,
      userRole: socket.userRole,
      timestamp: new Date()
    });

  });

  socket.on('disconnect', () => {

    if (socket.sessionId) {

      socket.to(socket.sessionId).emit('user_left', {
        userId: socket.userId,
        userRole: socket.userRole,
        timestamp: new Date()
      });

    }

    logger.info(`User disconnected: ${socket.id}`);

  });

});


// ERROR HANDLERS
app.use(notFoundHandler);
app.use(errorHandler);


// GRACEFUL SHUTDOWN
process.on('SIGTERM', () => {

  logSystem.gracefulShutdown('SIGTERM');

  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });

});


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

  logSystem.serverStart(PORT);
  logger.info(`Server listening on port ${PORT}`);

});