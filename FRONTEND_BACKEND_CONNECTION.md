# 🔗 Frontend-Backend Connection Troubleshooting

## 🚨 **Issue: 404 Errors on Frontend**

### **Problem Identified**
The frontend is trying to access the backend but getting 404 errors. This happens when:
1. `VITE_API_URL` is not set on Vercel
2. `VITE_API_URL` is pointing to wrong URL
3. Backend URL is not accessible

---

## 🔧 **SOLUTION: Set Environment Variables on Vercel**

### **Step 1: Get Your Render Backend URL**
1. Go to your Render dashboard
2. Find your backend service
3. Copy the URL (e.g., `https://your-backend-name.onrender.com`)

### **Step 2: Set Environment Variables on Vercel**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```bash
VITE_API_URL=https://your-backend-name.onrender.com
VITE_SOCKET_URL=https://your-backend-name.onrender.com
```

### **Step 3: Redeploy**
1. Go to **Deployments** tab
2. Click **Redeploy** or push a new commit
3. Wait for deployment to complete

---

## 🧪 **Testing the Connection**

### **Test Backend Health Check**
```bash
curl https://your-backend-name.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-03-14T12:13:00.000Z",
  "uptime": 123.45
}
```

### **Test Frontend API Call**
Open browser console and run:
```javascript
fetch('https://your-backend-name.onrender.com/api/health')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

## 📋 **Environment Variables Reference**

### **Required for Vercel (Frontend)**
```bash
VITE_API_URL=https://your-backend-name.onrender.com
VITE_SOCKET_URL=https://your-backend-name.onrender.com
```

### **Required for Render (Backend)**
```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
FRONTEND_URL=https://your-vercel-app-url.vercel.app
APP_SECRET=your_app_secret_for_qr_codes_here
```

---

## 🔍 **Debugging Steps**

### **1. Check Browser Console**
- Open DevTools (F12)
- Go to Console tab
- Look for 404 errors
- Check Network tab for failed requests

### **2. Verify Environment Variables**
In frontend, add this to check:
```javascript
console.log('API_URL:', import.meta.env.VITE_API_URL);
console.log('SOCKET_URL:', import.meta.env.VITE_SOCKET_URL);
```

### **3. Test Backend Directly**
```bash
# Test health endpoint
curl https://your-backend-name.onrender.com/api/health

# Test with curl -v for detailed info
curl -v https://your-backend-name.onrender.com/api/health
```

---

## 🚀 **Common Issues & Solutions**

### **Issue 1: CORS Errors**
**Solution**: Ensure `FRONTEND_URL` is set correctly on Render
```bash
FRONTEND_URL=https://your-vercel-app-url.vercel.app
```

### **Issue 2: 404 Errors**
**Solution**: Check if `VITE_API_URL` is set and correct on Vercel

### **Issue 3: Connection Timeouts**
**Solution**: Check if backend is running and accessible

### **Issue 4: Environment Variables Not Working**
**Solution**: Redeploy Vercel after setting environment variables

---

## 🎯 **Quick Fix Checklist**

- [ ] Backend is deployed and running on Render
- [ ] Backend health check works: `/api/health`
- [ ] `VITE_API_URL` is set on Vercel
- [ ] `VITE_SOCKET_URL` is set on Vercel
- [ ] Frontend is redeployed on Vercel
- [ ] No 404 errors in browser console
- [ ] API calls are working

---

## 🎉 **Success Indicators**

When everything is working:
1. ✅ Backend health check returns `{"status": "OK"}`
2. ✅ Frontend loads without 404 errors
3. ✅ Login page loads correctly
4. ✅ API calls succeed in Network tab
5. ✅ Real-time features work (Socket.io)

---

## 📞 **Need More Help?**

If you're still having issues:
1. Check the exact error messages in browser console
2. Verify your backend URL is correct
3. Ensure environment variables are set correctly
4. Check if both deployments are live and accessible

**Your Smart Attendance System should be fully functional once the frontend can connect to the backend!** 🚀
