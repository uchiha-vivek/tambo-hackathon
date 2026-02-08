# Backend Setup Guide

## Quick Start

The StudyGenie frontend requires the Flask backend to be running for PDF upload and AI features.

### Option 1: Local Backend (Recommended for Development)

1. **Navigate to the backend directory:**
   ```powershell
   cd "D:\UI_strikes back\studygenie-ai"
   ```

2. **Create a virtual environment (if not already created):**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   - Create a `.env` file in `studygenie-ai` folder
   - Add your `GROQ_API_KEY`:
     ```
     GROQ_API_KEY=your_groq_api_key_here
     FLASK_DEBUG=True
     PORT=5000
     ```

5. **Start the Flask backend:**
   ```powershell
   python -m app.main
   ```

   You should see:
   ```
   * Running on http://127.0.0.1:5000
   ```

6. **Configure frontend to use local backend:**
   - In `tambo-hackathon/.env.local`, ensure:
     ```
     NEXT_PUBLIC_STUDYGENIE_BACKEND_URL=http://localhost:5000
     ```

### Option 2: Use Deployed Backend (Render)

1. **Set backend URL in `.env.local`:**
   ```
   NEXT_PUBLIC_STUDYGENIE_BACKEND_URL=https://studygenie-ai.onrender.com
   ```

2. **Note:** Render free tier has cold starts (30-60 seconds on first request)

### Troubleshooting

#### Error: `ERR_CONNECTION_REFUSED`
- **Cause:** Backend is not running
- **Solution:** Start the Flask backend (see Option 1 above)

#### Error: `Backend is cold-starting`
- **Cause:** Render free tier deployment is sleeping
- **Solution:** Wait 30-60 seconds and try again, or use local backend

#### Error: `Failed to fetch`
- **Cause:** CORS or network issue
- **Solution:** The frontend uses Next.js API proxy routes (`/api/upload-pdf`) which should handle CORS automatically. Check:
  1. Backend is running
  2. `.env.local` has correct `NEXT_PUBLIC_STUDYGENIE_BACKEND_URL`
  3. Restart Next.js dev server after changing `.env.local`

### Testing Backend Connection

1. **Health Check:**
   ```powershell
   curl http://localhost:5000/health
   ```

2. **Or visit in browser:**
   ```
   http://localhost:5000/health
   ```

### Running Both Frontend and Backend

**Terminal 1 (Backend):**
```powershell
cd "D:\UI_strikes back\studygenie-ai"
python -m app.main
```

**Terminal 2 (Frontend):**
```powershell
cd "D:\UI_strikes back\tambo-hackathon"
npm run dev
```

Then visit: `http://localhost:3000`

