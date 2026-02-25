const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
// const mongoose = require('mongoose'); // Uncomment this when you add your MongoDB URI
require('dotenv').config();

const { generateRotatingQR } = require('./utils/totp');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Initialize WebSockets for the live projector dashboard
const io = new Server(server, {
  cors: {
    origin: "*", // Change this to your frontend URL in production
    methods: ["GET", "POST"]
  }
});

// Middleware: Attach the Socket.io instance to the request object
// This allows our API routes to trigger projector updates
app.use((req, res, next) => {
  req.io = io;
  next();
});

// WebSocket Connection Logic
io.on('connection', (socket) => {
  console.log('New dashboard connected:', socket.id);

  socket.on('start_session', ({ classId, sessionId }) => {
    socket.join(sessionId); // Group this specific lecture
    console.log(`Session ${sessionId} started for Class ${classId}`);

    // Push the first QR code immediately
    socket.emit('qr_update', generateRotatingQR(classId, sessionId));

    // Rotate and push a new QR code every 10 seconds
    const qrInterval = setInterval(() => {
      io.to(sessionId).emit('qr_update', generateRotatingQR(classId, sessionId));
    }, 10000);

    socket.on('disconnect', () => {
      clearInterval(qrInterval);
      console.log('Dashboard disconnected, stopped QR generation for', sessionId);
    });
  });
});

// --- API Routes ---
app.use('/api/attendance', require('./routes/attendance'));

// Health check route
app.get('/api/status', (req, res) => {
  res.json({ status: 'Attendance Server is running securely.' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});