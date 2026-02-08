# Local Development Setup Guide

## 🚀 Running StudyGenie Locally

This guide shows you how to run both the **Flask Backend** and **Next.js Frontend** locally on your machine.

---

## 📦 Part 1: Flask Backend (StudyGenie AI)

### 1. Navigate to Backend Directory
```bash
cd studygenie-ai
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Create `.env` File
Create `.env` in `studygenie-ai/` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your_secret_key_here
CORS_ORIGINS=http://localhost:3000
GROQ_MODEL=llama-3.3-70b-versatile
```

### 5. Run Backend Server
```bash
python -m app.main
```

Backend will run on: **http://localhost:5000**

### 6. Test Backend
```bash
# Health check
curl http://localhost:5000/health

# Should return: {"status":"healthy","service":"StudyGenie AI Backend"}
```

---

## 🎨 Part 2: Next.js Frontend (Tambo Hackathon)

### 1. Navigate to Frontend Directory
```bash
cd tambo-hackathon
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup MongoDB

#### Option A: Local MongoDB (Docker)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option B: MongoDB Atlas (Cloud)
- Go to https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string

### 4. Create `.env.local` File
Create `.env.local` in `tambo-hackathon/` directory:
```env
# MongoDB
MONGODB_URI="mongodb://localhost:27017/studygenie"
# OR for Atlas:
# MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/studygenie"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
# Generate with: openssl rand -base64 32

# Tambo AI
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here

# StudyGenie Backend (LOCAL - not deployed)
NEXT_PUBLIC_STUDYGENIE_BACKEND_URL=http://localhost:5000
```

**Important:** Set `NEXT_PUBLIC_STUDYGENIE_BACKEND_URL=http://localhost:5000` to use local backend!

### 5. Run Frontend Server
```bash
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 🔄 Running Both Servers

### Terminal 1: Backend
```bash
cd studygenie-ai
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
python -m app.main
```

### Terminal 2: Frontend
```bash
cd tambo-hackathon
npm run dev
```

### Terminal 3: MongoDB (if using local)
```bash
# MongoDB should already be running if you used Docker
# Check with: docker ps
```

---

## ✅ Verify Everything Works

### 1. Check Backend
```bash
curl http://localhost:5000/health
# Should return: {"status":"healthy","service":"StudyGenie AI Backend"}
```

### 2. Check Frontend
- Open browser: http://localhost:3000
- Navigate to: http://localhost:3000/study-genie
- Should see landing page

### 3. Test PDF Upload
- Go to http://localhost:3000/study-genie
- Click "Upload Syllabus"
- Upload a PDF
- Should process using **local backend** (http://localhost:5000)

---

## 🐛 Troubleshooting

### Backend Issues

**Port 5000 already in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill
```

**Module not found:**
```bash
# Make sure you're in studygenie-ai directory
cd studygenie-ai
python -m app.main
```

**GROQ_API_KEY error:**
- Check `.env` file exists in `studygenie-ai/`
- Verify API key is correct

### Frontend Issues

**Port 3000 already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill
```

**MongoDB connection error:**
- Check MongoDB is running: `docker ps` (if using Docker)
- Verify `MONGODB_URI` in `.env.local`
- Try: `mongosh mongodb://localhost:27017/studygenie`

**Backend connection error:**
- Make sure backend is running on port 5000
- Check `NEXT_PUBLIC_STUDYGENIE_BACKEND_URL=http://localhost:5000` in `.env.local`
- Test: `curl http://localhost:5000/health`

### CORS Issues

If you see CORS errors:
1. Check backend `.env` has: `CORS_ORIGINS=http://localhost:3000`
2. Restart backend server

---

## 📝 Quick Reference

### Backend (Flask)
- **Directory:** `studygenie-ai/`
- **Port:** 5000
- **URL:** http://localhost:5000
- **Start:** `python -m app.main`
- **Health:** http://localhost:5000/health

### Frontend (Next.js)
- **Directory:** `tambo-hackathon/`
- **Port:** 3000
- **URL:** http://localhost:3000
- **Start:** `npm run dev`
- **StudyGenie:** http://localhost:3000/study-genie

### MongoDB
- **Port:** 27017
- **Database:** studygenie
- **Connection:** `mongodb://localhost:27017/studygenie`

---

## 🎯 Development Workflow

1. **Start MongoDB** (if local)
   ```bash
   docker start mongodb
   ```

2. **Start Backend** (Terminal 1)
   ```bash
   cd studygenie-ai
   venv\Scripts\activate
   python -m app.main
   ```

3. **Start Frontend** (Terminal 2)
   ```bash
   cd tambo-hackathon
   npm run dev
   ```

4. **Open Browser**
   - Frontend: http://localhost:3000/study-genie
   - Backend API: http://localhost:5000/health

5. **Test Features**
   - Upload PDF
   - Generate quizzes
   - Create flashcards
   - Track progress

---

## 🔧 Environment Variables Summary

### Backend (`.env` in `studygenie-ai/`)
```env
GROQ_API_KEY=your_key
SECRET_KEY=your_secret
CORS_ORIGINS=http://localhost:3000
GROQ_MODEL=llama-3.3-70b-versatile
```

### Frontend (`.env.local` in `tambo-hackathon/`)
```env
MONGODB_URI=mongodb://localhost:27017/studygenie
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
NEXT_PUBLIC_TAMBO_API_KEY=your_key
NEXT_PUBLIC_STUDYGENIE_BACKEND_URL=http://localhost:5000  # ← LOCAL!
```

---

## ✅ Success Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] MongoDB running (local or Atlas)
- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] PDF upload works (uses local backend)
- [ ] No CORS errors in browser console

---

## 🎉 You're Ready!

Everything should now be running locally. The frontend will use your local backend instead of the deployed one.

