# 🚨 Deployment Troubleshooting Guide

## Current Status: ✅ ALL ISSUES FIXED

**Commit**: `40ad545` - Complete resolution of all deployment issues

---

## 🔍 **If You're Still Having Issues**

### **Render (Backend) Issues**

#### **Issue: Server Won't Start**
```bash
# Check Render logs for specific error
# Look for these common problems:

1. Missing Environment Variables
   - MONGODB_URI: Your MongoDB connection string
   - JWT_SECRET: Your JWT secret key
   - JWT_REFRESH_SECRET: Your refresh token secret
   - APP_SECRET: Your QR code generation secret
   - FRONTEND_URL: Your Vercel app URL

2. Database Connection Error
   - Verify MongoDB URI format: mongodb+srv://...
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

3. Port Issues
   - Render uses port 10000 (configured in render.yaml)
   - Server listens to process.env.PORT
```

#### **Solution: Check Environment Variables**
In Render Dashboard → Your Service → Environment:
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
FRONTEND_URL=https://your-app.vercel.app
APP_SECRET=your_app_secret_for_qr_codes_here
```

---

### **Vercel (Frontend) Issues**

#### **Issue: Build Fails**
```bash
# Check Vercel build logs
# Common problems:

1. Missing Build Script ✅ FIXED
   - Root package.json now has "build" script
   - vercel.json points to frontend/package.json

2. Environment Variables Missing
   - VITE_API_URL: Your Render backend URL
   - VITE_SOCKET_URL: Your Render backend URL

3. Dependencies Not Found
   - All dependencies are in frontend/package.json
   - Vite configuration is correct
```

#### **Solution: Set Vercel Environment Variables**
In Vercel Dashboard → Your Project → Settings → Environment Variables:
```bash
VITE_API_URL=https://your-app.onrender.com
VITE_SOCKET_URL=https://your-app.onrender.com
```

---

## 🛠️ **Step-by-Step Deployment**

### **1. Deploy to Render**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Connect your GitHub repository
3. Use `backend/render.yaml` configuration
4. Set all environment variables
5. Deploy from `main` branch

### **2. Deploy to Vercel**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Connect your GitHub repository
3. Set environment variables
4. Deploy from `main` branch

### **3. Test Deployment**
```bash
# Test Backend Health
curl https://your-app.onrender.com/api/health

# Expected Response:
{"status":"OK","timestamp":"2026-03-05T...","uptime":123.45}

# Test Frontend
# Visit https://your-app.vercel.app
# Should load the login page
```

---

## 🔧 **Common Error Solutions**

### **Error: "Cannot find module 'express'"**
```bash
# Solution: Dependencies not installed
# Render automatically runs 'npm install'
# Ensure backend/package.json has all dependencies
```

### **Error: "npm error Missing script: build"**
```bash
# ✅ FIXED: Root package.json now has build script
# Vercel will find it automatically
```

### **Error: "CORS policy blocked"**
```bash
# Solution: FRONTEND_URL environment variable
# Must match your Vercel app URL exactly
# Example: https://your-app.vercel.app
```

### **Error: "Database connection failed"**
```bash
# Solution: Check MONGODB_URI format
# Must be: mongodb+srv://user:pass@cluster.mongodb.net/dbname
# Check MongoDB Atlas IP whitelist (0.0.0.0/0 for all)
```

---

## 📋 **Pre-Deployment Checklist**

### **Backend (Render)**
- [ ] All environment variables set in Render dashboard
- [ ] MongoDB Atlas IP whitelist includes 0.0.0.0/0
- [ ] Database user has read/write permissions
- [ ] FRONTEND_URL matches Vercel app URL

### **Frontend (Vercel)**
- [ ] VITE_API_URL points to Render backend
- [ ] VITE_SOCKET_URL points to Render backend
- [ ] Environment variables are marked as "production"
- [ ] Build command is set to "npm run build"

---

## 🆘 **Still Having Issues?**

### **Debug Steps:**
1. **Check Logs**: Both Render and Vercel have detailed logs
2. **Test Locally**: Use production URLs locally first
3. **Verify Environment**: Double-check all environment variables
4. **Check Dependencies**: Ensure all packages are installed

### **Get Help:**
- **Render Logs**: Dashboard → Your Service → Logs
- **Vercel Logs**: Dashboard → Your Project → Logs
- **GitHub**: Check Actions tab for deployment status

---

## 🎯 **What Was Fixed**

### **Critical Issues Resolved:**
1. ✅ **Duplicate server.js code** - Clean rewrite
2. ✅ **Missing imports** - All dependencies imported
3. ✅ **Build script error** - Added to root package.json
4. ✅ **Express route syntax** - Fixed for v5 compatibility
5. ✅ **Vercel configuration** - Points to frontend correctly
6. ✅ **Render configuration** - Proper health check and commands

### **Current Status:**
- **Render**: ✅ Ready for deployment
- **Vercel**: ✅ Ready for deployment
- **All Issues**: ✅ **RESOLVED**

**Your Smart Attendance System is now deployment-ready!** 🚀
