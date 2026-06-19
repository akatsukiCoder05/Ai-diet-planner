# 🥗 AI Diet Planner - Organic Wellness

> Your personalized wellness journey powered by AI and beautiful design

[![React](https://img.shields.io/badge/React-19.2.6-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-green.svg)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-8.0.12-purple.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

- 🤖 **AI-Powered Diet Generation** - Using Groq's Llama 3.3 70B model
- 📄 **PDF Export** - Download beautifully formatted diet plans
- 💾 **Save & History** - Keep track of your wellness journey
- 🎨 **Organic Wellness UI** - Elegant serif typography and soft animations
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Dark Theme** - Easy on the eyes, beautiful aesthetic

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
# 1. Clone or navigate to project directory
cd Ditepalnner

# 2. Install dependencies
npm install

# 3. Start both frontend and backend
npm run dev:all
```

Open http://localhost:5173 in your browser!

## 📦 Project Structure

```
Ditepalnner/
├── src/
│   ├── App.jsx              # Main React component
│   ├── App.css              # Organic wellness styles
│   └── main.jsx             # React entry point
├── server.js                # Express backend server
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── docs/                    # Documentation
    ├── QUICKSTART.md        # Quick start guide
    ├── BACKEND_SETUP.md     # Backend documentation
    └── ORGANIC_WELLNESS_UI.md # UI design guide
```

## 🎯 Usage

### 1. Generate Your Diet Plan

1. Fill in your personal details:
   - Current Age
   - Gender Identity
   - Daily Activity Level
   - Weight (kg)

2. Click **"Craft My Journey"**

3. Wait for AI to generate your personalized plan

### 2. Download PDF

Click the **"Download PDF"** button to save your diet plan as a beautifully formatted PDF document.

### 3. Save Your Plan

Click **"Save Plan"** to save your diet plan to the server history for future reference.

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend development server (Vite) |
| `npm run server` | Start backend API server (Express) |
| `npm run dev:all` | Start both frontend and backend together |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/generate-pdf` | Generate PDF from diet plan |
| `POST` | `/api/save-plan` | Save diet plan to history |
| `GET` | `/api/history` | Get all saved plans |
| `GET` | `/api/history/:id` | Get specific plan by ID |
| `DELETE` | `/api/history/:id` | Delete plan by ID |

## 🎨 Design System

### Typography
- **Headings**: DM Serif Display - Elegant and wellness-focused
- **Body**: Inter - Clean and modern
- **Code**: JetBrains Mono - Technical details

### Color Palette
- **Primary Cyan**: `#4cd7f6` - Energy and vitality
- **Background**: `#0b1326` - Calm and focus
- **Surface**: `#121a2e` - Depth and layers
- **On Surface**: `#dae2fd` - Clear text
- **Secondary**: `#adc6ff` - Soft accents
- **Tertiary**: `#d0bcff` - Gentle highlights

### Components
- Organic Cards with gradient glassmorphism
- Floating navigation with backdrop blur
- Staggered fade-in animations
- Warm hover effects
- Soft glow shadows

## 🔧 Technology Stack

### Frontend
- **React** 19.2.6 - UI framework
- **Vite** 8.0.12 - Build tool
- **Tailwind CSS** - Utility-first styling
- **Groq SDK** - AI diet generation

### Backend
- **Express** 4.18.2 - Web server framework
- **pdf-lib** 1.17.1 - PDF generation
- **CORS** 2.8.5 - Cross-origin support

### Dev Tools
- **ESLint** - Code linting
- **Concurrently** - Run multiple commands

## 📖 Documentation

- [Quick Start Guide](./QUICKSTART.md) - Get started in 3 steps
- [Backend Setup](./BACKEND_SETUP.md) - Comprehensive backend guide
- [Backend Complete](./BACKEND_COMPLETE.md) - Feature overview
- [Organic Wellness UI](./ORGANIC_WELLNESS_UI.md) - Design system guide
- [Start Here](./START_HERE.txt) - Quick reference card

## 🧪 Testing

### Test Backend Server

```bash
# Start backend
npm run server

# In another terminal, test with curl
curl http://localhost:5000/api/health

# Or use the test script
node test-server.js
```

### Test PDF Generation

```bash
curl -X POST http://localhost:5000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"dietPlan":"Test Plan","userInfo":{"age":"28"}}' \
  --output test.pdf
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Dependencies Missing
```bash
npm install express cors pdf-lib
```

### PDF Download Fails
1. Ensure backend is running: `npm run server`
2. Check server console for errors
3. Verify CORS is enabled (it is by default)

## 🔐 Security

⚠️ **Important**: Current setup is for **development only**

Before deploying to production:
- [ ] Move Groq API key to backend environment variables
- [ ] Add user authentication (JWT, OAuth)
- [ ] Connect to database (MongoDB, PostgreSQL)
- [ ] Enable rate limiting
- [ ] Configure HTTPS
- [ ] Restrict CORS to production domain
- [ ] Add input validation and sanitization

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel deploy --prod
```

### Backend (Railway)
```bash
railway up
```

### Full Stack (Vercel)
Add `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" },
    { "src": "package.json", "use": "@vercel/static-build" }
  ]
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Groq** - AI inference platform
- **Tailwind CSS** - Styling framework
- **pdf-lib** - PDF generation library
- **DM Serif Display** - Beautiful serif font
- **Material Symbols** - Icon library

## 📞 Support

Need help? Check out:
- [Quick Start Guide](./QUICKSTART.md)
- [Backend Documentation](./BACKEND_SETUP.md)
- [Start Here Card](./START_HERE.txt)

## 🎉 Status

✅ AI Diet Generation  
✅ PDF Export  
✅ Organic Wellness UI  
✅ Backend API  
✅ Save/History  
✅ Responsive Design  
✅ Dark Theme  
✅ Documentation Complete  

---

**Built with ❤️ for your wellness journey**

Start your path to wellness today! 🌿✨
