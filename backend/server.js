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

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Apply security middleware
app.use(securityMiddleware);
app.use(generalLimiter);

// JSON parser
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io for real-time features
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware: Attach the Socket.io instance to the request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/sessions', require('./routes/session'));
app.use('/api/classes', require('./routes/class'));
app.use('/api/admin', require('./routes/admin'));

// Serve frontend static files (production)
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// SPA fallback for frontend routing (Express 5 compatible)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// WebSocket Connection Logic
io.on('connection', (socket) => {
  logger.info(`New dashboard connected: ${socket.id}`);

  socket.on('join_session', ({ sessionId, userRole, userId }) => {
    socket.join(sessionId);
    socket.sessionId = sessionId;
    socket.userRole = userRole;
    socket.userId = userId;
    
    logger.info(`User ${userId} (${userRole}) joined session ${sessionId}`);
    
    // Notify others in session
    socket.to(sessionId).emit('user_joined', {
      userId,
      userRole,
      timestamp: new Date()
    });
  });

  socket.on('start_session', ({ classId, sessionId }) => {
    socket.join(sessionId);
    logger.info(`Session ${sessionId} started for Class ${classId}`);

    // Push first QR code immediately
    socket.emit('qr_update', generateRotatingQR(classId, sessionId));

    // Rotate and push a new QR code every 10 seconds
    const qrInterval = setInterval(() => {
      io.to(sessionId).emit('qr_update', generateRotatingQR(classId, sessionId));
    }, 10000);

    socket.on('disconnect', () => {
      clearInterval(qrInterval);
      logger.info(`Dashboard disconnected, stopped QR generation for ${sessionId}`);
    });
  });

  socket.on('leave_session', ({ sessionId }) => {
    socket.leave(sessionId);
    socket.to(sessionId).emit('user_left', {
      userId: socket.userId,
      userRole: socket.userRole,
      timestamp: new Date()
    });
    logger.info(`User ${socket.userId} left session ${sessionId}`);
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

// Graceful shutdown
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
