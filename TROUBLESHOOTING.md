# 🔧 Troubleshooting Guide

## ❌ "Failed to download PDF. Please make sure the server is running."

### Solution Steps:

#### Step 1: Check if Server is Running
Open a **NEW terminal** and run:
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"status":"ok","message":"Server is running"}
```

If you get an error, the server is NOT running. Continue to Step 2.

---

#### Step 2: Start the Server

**Option A: Use Batch File (Easiest)**
Double-click: `start-server.bat`

**Option B: Use npm Command**
```bash
npm run server
```

**Option C: Use node directly**
```bash
node server.js
```

---

#### Step 3: Verify Server Started

You should see:
```
🚀 Server is running on http://localhost:5000
📄 PDF Generation endpoint: http://localhost:5000/api/generate-pdf
💾 Save plan endpoint: http://localhost:5000/api/save-plan
📋 History endpoint: http://localhost:5000/api/history
```

---

#### Step 4: Check Server Status in UI

Look at the top of your app (mobile header):
- 🟢 **Green dot** = Server Online ✅
- 🔴 **Red dot** = Server Offline ❌
- 🟡 **Yellow dot** = Checking...

---

#### Step 5: Try Download Again

1. Generate a diet plan first (if you haven't)
2. Scroll down to results
3. Click "Download PDF"
4. PDF should download!

---

## ⚠️ Common Issues

### Issue 1: Port 5000 Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace <PID> with actual number)
taskkill /PID <PID> /F

# Start server again
npm run server
```

---

### Issue 2: Dependencies Not Installed

**Error Message:**
```
Cannot find module 'express'
```

**Solution:**
```bash
npm install
```

---

### Issue 3: Server Starts But Can't Connect

**Symptoms:**
- Server console shows it's running
- Browser shows "Server Offline"
- Red dot in UI

**Solution:**

1. Check if firewall is blocking port 5000
2. Try accessing directly: http://localhost:5000/api/health
3. Check browser console for CORS errors
4. Restart both frontend and backend:
   ```bash
   # Terminal 1
   npm run server
   
   # Terminal 2  
   npm run dev
   ```

---

### Issue 4: "Network Error" or "Failed to Fetch"

**Symptoms:**
- Browser console shows network error
- Cannot connect to http://localhost:5000

**Solution:**

1. Verify server is actually running (see Step 1)
2. Check if URL is correct (http NOT https)
3. Try restarting the server
4. Clear browser cache and reload page

---

### Issue 5: PDF Download Button Disabled

**Symptoms:**
- Button shows "Server Offline"
- Button is grayed out
- Can't click download

**Solution:**

1. Server is NOT running - start it!
2. Check server status indicator (top of page)
3. Run: `npm run server` in a new terminal
4. Wait for green dot to appear
5. Button should become clickable

---

## 🎯 Quick Checklist

Before trying to download PDF:

- [ ] Server is running (`npm run server`)
- [ ] Server shows green dot in UI
- [ ] Diet plan is generated (click "Craft My Journey")
- [ ] Results section is visible
- [ ] Download PDF button is NOT grayed out

---

## 🚀 Best Practice: Run Both Together

Instead of running separately, use:

```bash
npm run dev:all
```

Or double-click: `start-all.bat`

This starts BOTH frontend and backend in one command!

---

## 🧪 Test Server Manually

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

### Test 2: Generate Test PDF
```bash
curl -X POST http://localhost:5000/api/generate-pdf ^
  -H "Content-Type: application/json" ^
  -d "{\"dietPlan\":\"Test Plan\",\"userInfo\":{\"age\":\"28\"}}" ^
  --output test.pdf
```

### Test 3: Save Plan
```bash
curl -X POST http://localhost:5000/api/save-plan ^
  -H "Content-Type: application/json" ^
  -d "{\"dietPlan\":\"Test\",\"userInfo\":{},\"parsedData\":{}}"
```

---

## 📞 Still Having Issues?

1. **Check browser console** (F12) for errors
2. **Check server console** for error messages
3. **Restart everything:**
   ```bash
   # Close all terminals
   # Run fresh:
   npm run dev:all
   ```

4. **Verify installation:**
   ```bash
   npm install
   npm list express cors pdf-lib
   ```

5. **Check ports:**
   ```bash
   netstat -ano | findstr :5000
   netstat -ano | findstr :5173
   ```

---

## ✅ Success Indicators

You know everything is working when:

1. ✅ Server console shows "Server is running"
2. ✅ UI shows green dot (server online)
3. ✅ Health check returns 200 OK
4. ✅ Download PDF button is clickable
5. ✅ PDF downloads successfully

---

## 💡 Pro Tips

1. **Always keep server running** while using the app
2. **Use `npm run dev:all`** to start everything at once
3. **Check server status indicator** before clicking buttons
4. **Generate plan first** before trying to download
5. **Open browser dev tools** (F12) to see errors

---

**Need more help?** Check the other documentation files:
- `QUICKSTART.md` - Quick start guide
- `BACKEND_SETUP.md` - Full backend documentation  
- `START_HERE.txt` - Quick reference

---

Good luck! 🎉
