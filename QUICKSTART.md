# ⚡ Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

Wait for all packages to install (express, cors, pdf-lib, etc.)

### Step 2: Start Both Frontend & Backend
```bash
npm run dev:all
```

This will start:
- ✅ Frontend on http://localhost:5173
- ✅ Backend on http://localhost:5000

### Step 3: Use the App
1. Open http://localhost:5173 in your browser
2. Fill in your personal details (age, gender, weight, activity level)
3. Click "Craft My Journey" 
4. Wait for AI to generate your diet plan
5. Click "Download PDF" to save your plan

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend only (Vite dev server) |
| `npm run server` | Start backend only (Express server) |
| `npm run dev:all` | Start both frontend + backend |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🎯 Features You Can Test

### 1. Generate Diet Plan
- Fill the form with your details
- Click "Craft My Journey"
- See beautiful organic wellness dashboard

### 2. Download PDF
- After generating plan, click "Download PDF"
- PDF will download with your diet plan
- Opens in any PDF viewer

### 3. Save Plan
- Click "Save Plan" to save to history
- Access via API: http://localhost:5000/api/history

## 🔧 Port Configuration

Default ports:
- Frontend: **5173** (Vite)
- Backend: **5000** (Express)

To change backend port, edit `server.js`:
```javascript
const PORT = process.env.PORT || 5001; // Changed to 5001
```

## ⚠️ Common Issues

### Issue: "Cannot find module 'express'"
**Solution:**
```bash
npm install
```

### Issue: "Port 5000 already in use"
**Solution:** Kill the process using port 5000
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: "Failed to download PDF"
**Solution:** Make sure backend is running
```bash
# Check if server is running
curl http://localhost:5000/api/health

# Should return: {"status":"ok","message":"Server is running"}
```

### Issue: CORS Error
**Solution:** Backend already has CORS enabled. Make sure:
1. Backend is running on port 5000
2. Frontend is accessing http://localhost:5000 (not https)

## 📖 API Testing

Test if backend is working:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test PDF generation
curl -X POST http://localhost:5000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"dietPlan":"Test Plan","userInfo":{"age":"28"}}' \
  --output test.pdf
```

## 🎨 Project Structure

```
Ditepalnner/
├── src/
│   ├── App.jsx          # Main React component
│   ├── App.css          # Organic wellness styles
│   └── main.jsx         # React entry point
├── server.js            # Express backend server
├── index.html           # HTML template
├── package.json         # Dependencies & scripts
└── vite.config.js       # Vite configuration
```

## 🌟 Next Steps

1. ✅ Customize the organic wellness theme in `App.css`
2. ✅ Add more endpoints to `server.js` (e.g., user authentication)
3. ✅ Connect to a database (MongoDB, PostgreSQL)
4. ✅ Deploy to production (Vercel, Heroku, Railway)
5. ✅ Add meal images and recipes

## 📚 Documentation

- [Backend Setup Guide](./BACKEND_SETUP.md) - Detailed backend documentation
- [Organic Wellness UI](./ORGANIC_WELLNESS_UI.md) - UI design guide
- [Upgrade Notes](./UPGRADE_NOTES.md) - Previous version changes

## 💡 Pro Tips

1. **Keep both servers running** - Use `npm run dev:all` for best experience
2. **Check console logs** - Server console shows all API requests
3. **Test endpoints** - Use curl or Postman before using UI
4. **Save plans** - Use "Save Plan" to build history
5. **Customize PDF** - Edit `server.js` to change PDF styling

---

**You're all set!** 🎉 Start building your wellness journey!
