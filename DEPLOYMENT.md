# Deployment Guide - Render + Vercel

This guide will help you fix deployment issues for your Smart Attendance System.

## 🚀 Prerequisites

1. **Backend (Render)**
   - MongoDB Atlas connection string
   - Environment variables configured
   - Health check endpoint working

2. **Frontend (Vercel)**
   - Environment variables for API URLs
   - Build configuration for Vercel
   - SPA routing setup

## 🔧 Environment Variables Setup

### Backend (Render)
Add these environment variables in your Render dashboard:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
FRONTEND_URL=https://your-app.vercel.app
APP_SECRET=your-app-secret-for-qr-codes
```

### Frontend (Vercel)
Add these environment variables in your Vercel dashboard:

```bash
VITE_API_URL=https://your-backend-app.onrender.com
VITE_SOCKET_URL=https://your-backend-app.onrender.com
```

## 🛠️ Fixed Configuration Files

### 1. Backend Configuration (`render.yaml`)
✅ **Already Created**
- Health check path: `/api/health`
- Proper build commands
- Environment variable mapping
- Auto-deploy from main branch

### 2. Frontend Configuration (`vercel.json`)
✅ **Already Created**
- SPA routing support
- Environment variable mapping
- Build configuration for Vite

### 3. Vite Configuration (`vite.config.js`)
✅ **Already Updated**
- Environment variable support
- Build optimization
- Proper output directory

## 🔍 Common Deployment Issues & Fixes

### Issue 1: CORS Errors
**Problem**: Frontend can't connect to backend
**Fix**: 
- Ensure `FRONTEND_URL` in backend matches your Vercel URL
- Check CORS configuration in `backend/middleware/security.js`

### Issue 2: Environment Variables Not Loading
**Problem**: API calls going to localhost
**Fix**:
- Vercel variables must be prefixed with `VITE_`
- Restart deployment after adding variables

### Issue 3: Build Failures
**Problem**: Vercel build fails
**Fix**:
- Check `package.json` has correct build script
- Ensure all imports are correct
- Verify no console errors

### Issue 4: Socket.io Connection Issues
**Problem**: Real-time features not working
**Fix**:
- Ensure `VITE_SOCKET_URL` matches backend URL
- Check backend Socket.io CORS settings
- Verify WebSocket connections allowed

## 🚀 Deployment Steps

### Step 1: Deploy Backend (Render)
1. Connect your GitHub repository to Render
2. Use `backend/render.yaml` configuration
3. Set environment variables in Render dashboard
4. Deploy from main branch

### Step 2: Deploy Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Use `frontend/vercel.json` configuration
3. Set environment variables in Vercel dashboard
4. Deploy from main branch

### Step 3: Verify Deployment
1. Check backend health: `https://your-app.onrender.com/api/health`
2. Test frontend loads: `https://your-app.vercel.app`
3. Test login functionality
4. Verify real-time features work

## 🔧 Local Testing with Production URLs

To test locally before deploying:

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with production values
npm start
```

### Frontend
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with production URLs
npm run dev
```

## 📋 Deployment Checklist

- [ ] Backend environment variables set in Render
- [ ] Frontend environment variables set in Vercel
- [ ] MongoDB connection working
- [ ] Health check endpoint accessible
- [ ] CORS properly configured
- [ ] Socket.io connections working
- [ ] Login flow working end-to-end
- [ ] Real-time QR code generation working
- [ ] Attendance scanning functional

## 🆘 Troubleshooting

### Backend Not Starting
```bash
# Check logs in Render dashboard
# Verify environment variables
# Test health endpoint locally
```

### Frontend Build Errors
```bash
# Check Vercel deployment logs
# Verify all imports are correct
# Test build locally: npm run build
```

### API Connection Issues
```bash
# Check network tab in browser
# Verify CORS headers
# Test API endpoints directly
```

## 📞 Support

If you're still having issues:

1. **Check Render Logs**: Dashboard → Services → Your Service → Logs
2. **Check Vercel Logs**: Dashboard → Your Project → Logs
3. **Verify Environment Variables**: Both platforms
4. **Test Locally**: Use production URLs locally first

## 🔄 Continuous Deployment

Both platforms are configured for automatic deployment:
- **Render**: Auto-deploys on push to main branch
- **Vercel**: Auto-deploys on push to main branch

Make sure to push to the main branch to trigger deployments!
