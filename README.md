# Smart Attendance System - Production Ready

A comprehensive, secure attendance management system for educational institutions with real-time QR code-based attendance tracking, role-based access control, and anti-cheating mechanisms.

## 🏗️ Architecture Overview

### Backend (Node.js + Express)
- **Layered Architecture**: Controllers → Services → Models
- **Security**: JWT with refresh tokens, rate limiting, CORS, helmet
- **Authentication**: Role-based (Admin > Teacher > Student)
- **Anti-Cheating**: Device locking, geolocation verification, duplicate prevention
- **Real-time**: Socket.io for live attendance updates
- **Logging**: Structured Winston logging with multiple log levels

### Frontend (React + Vite)
- **Authentication Context**: Centralized auth state management
- **Role Protection**: Route guards and permission checks
- **Responsive UI**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live attendance dashboard

### Database (MongoDB)
- **Optimized Indexes**: Performance-tuned queries
- **Relationships**: Proper foreign key references
- **Data Integrity**: Validation and constraints

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 5.0+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd student-attendance-sys
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run setup:production  # Creates production config
npm run db:indexes      # Creates database indexes
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/attendance

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here

# Frontend URL
FRONTEND_URL=https://your-domain.com

# App Secret for QR Code Generation
APP_SECRET=your_app_secret_for_qr_codes_here
```

## 📱 Features

### 🔐 Security Features
- **JWT Authentication**: Access tokens (30min) + Refresh tokens (7 days)
- **Role-Based Access**: Admin, Teacher, Student hierarchy
- **Rate Limiting**: Prevents brute force attacks
- **Device Locking**: Students can only use registered devices
- **Geolocation Verification**: 50-meter radius validation
- **Duplicate Prevention**: One attendance per session

### 📊 Attendance Features
- **Real-time QR Codes**: Rotating every 10 seconds
- **Live Dashboard**: Real-time attendance statistics
- **Session Management**: Create/end attendance sessions
- **Attendance Reports**: Export CSV, view statistics
- **Low Attendance Alerts**: Identify students below 75%

### 🎛️ Admin Features
- **User Management**: Create teachers, manage students
- **Class Management**: Create/update classes and enrollments
- **Device Management**: Reset student device registrations
- **Report Generation**: Attendance analytics and exports
- **System Monitoring**: Health checks and logging

## 🏛️ Deployment

### Production Deployment

1. **Setup Production Environment**
```bash
cd backend
npm run setup:production
```

2. **Install PM2** (Process Manager)
```bash
npm install -g pm2
```

3. **Start with PM2**
```bash
pm2 start ecosystem.config.js --env production
```

4. **Configure Nginx** (Reverse Proxy)
```bash
# Copy nginx.conf to your nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/attendance
sudo ln -s /etc/nginx/sites-available/attendance /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Attendance
- `POST /api/attendance/scan` - Mark attendance
- `GET /api/attendance/session/:id` - Get session attendance
- `GET /api/attendance/student/:id` - Get student attendance

### Sessions
- `POST /api/sessions` - Create session
- `PUT /api/sessions/:id/end` - End session
- `GET /api/sessions/active` - Get active sessions
- `GET /api/sessions/:id/stats` - Get session statistics

### Classes
- `POST /api/classes` - Create class (Admin)
- `GET /api/classes` - List classes (Admin)
- `PUT /api/classes/:id` - Update class (Admin)
- `DELETE /api/classes/:id` - Delete class (Admin)

### Admin
- `POST /api/admin/teachers` - Create teacher
- `GET /api/admin/students` - List students
- `PUT /api/admin/students/:id/reset-device` - Reset device
- `GET /api/admin/reports/attendance` - Attendance reports
- `GET /api/admin/export/attendance` - Export CSV

## 🔍 Monitoring & Logging

### Log Files
- `logs/combined.log` - General application logs
- `logs/error.log` - Error-specific logs
- `logs/security.log` - Authentication and security events
- `logs/attendance.log` - Attendance-specific events

### Health Check
- `GET /api/health` - Server health status

## 🛡️ Security Considerations

### Implemented Security Measures
1. **Input Validation**: All inputs sanitized and validated
2. **SQL Injection Prevention**: Using Mongoose ODM
3. **XSS Protection**: Input sanitization and CSP headers
4. **CSRF Protection**: SameSite cookies and CORS configuration
5. **Rate Limiting**: Multiple tiers for different endpoints
6. **Secure Headers**: Helmet.js for security headers
7. **Password Security**: Bcrypt with 12 salt rounds
8. **Token Security**: HTTP-only cookies, secure transmission

### Recommended Additional Security
1. **SSL/TLS**: Always use HTTPS in production
2. **Firewall**: Configure proper firewall rules
3. **Regular Updates**: Keep dependencies updated
4. **Backup Strategy**: Regular database backups
5. **Monitoring**: Set up alerting for security events

## 📈 Performance Optimizations

### Database Indexes
- Optimized queries for all collections
- Compound indexes for complex queries
- Background index creation

### Caching Strategy
- JWT tokens stored in HTTP-only cookies
- Static asset caching via nginx
- Database connection pooling

### Monitoring
- Response time tracking
- Error rate monitoring
- Resource usage alerts

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test Coverage
- Authentication flows
- Attendance scanning
- Role-based access
- API endpoints
- Error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and support:
1. Check the logs in `logs/` directory
2. Review the health check endpoint
3. Check environment configuration
4. Review this README for common issues

## 🔄 Version History

- **v2.0.0** - Complete refactor with production-ready features
- **v1.0.0** - Initial prototype version

---

**Built with ❤️ for educational institutions**
