const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Import our security engine
const { generateRotatingQR } = require('./utils/totp');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Initialize WebSockets
const io = new Server(server, {
  cors: {
    origin: "*", // In production, change this to your React app's URL
    methods: ["GET", "POST"]
  }
});

// WebSocket Connection Logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // When a teacher clicks "Start Lecture" on the frontend
  socket.on('start_session', ({ classId, sessionId }) => {
    // Group this specific lecture into a "room"
    socket.join(sessionId);
    console.log(`Session ${sessionId} started for Class ${classId}`);

    // Immediately generate and send the first QR code payload
    socket.emit('qr_update', generateRotatingQR(classId, sessionId));

    // Set up the interval to generate and push a new QR code every 10 seconds
    const qrInterval = setInterval(() => {
      // Push ONLY to the specific session room
      io.to(sessionId).emit('qr_update', generateRotatingQR(classId, sessionId));
    }, 10000);

    // Clean up the interval if the teacher closes the dashboard
    socket.on('disconnect', () => {
      clearInterval(qrInterval);
      console.log('Client disconnected, stopped QR generation for', sessionId);
    });
  });
});

// A basic test route
app.get('/api/status', (req, res) => {
  res.json({ status: 'Attendance Server is running securely.' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
