const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI).catch((err) => console.error('MongoDB connect error:', err));
}

const { generateRotatingQR } = require('./utils/totp');

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://student-attendance-sys.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://student-attendance-sys.vercel.app'],
    methods: ['GET', 'POST']
  }
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('New dashboard connected:', socket.id);

  socket.on('start_session', ({ classId, sessionId }) => {
    socket.join(sessionId);
    console.log(`Session ${sessionId} started for Class ${classId}`);

    socket.emit('qr_update', generateRotatingQR(classId, sessionId));

    const qrInterval = setInterval(() => {
      io.to(sessionId).emit('qr_update', generateRotatingQR(classId, sessionId));
    }, 10000);

    socket.on('disconnect', () => {
      clearInterval(qrInterval);
      console.log('Dashboard disconnected, stopped QR generation for', sessionId);
    });
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/students', require('./routes/students'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/api/status', (req, res) => {
  res.json({ status: 'Attendance Server is running securely.' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server running on port', PORT));
