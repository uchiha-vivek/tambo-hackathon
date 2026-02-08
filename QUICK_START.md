# 🚀 Quick Start Guide - StudyGenie 2.0

## Setup in 3 Minutes

### 1. Environment Variables
Your `.env.local` should have:
```env
NEXT_PUBLIC_TAMBO_API_KEY=tambo_j8WsvWPF/L8ToCgyrYn+1oiWmuMJGVIY1l1aX0pP5fw6BMbPuVENVeYVCM8YlPfDOu04BLn+WaK/QH6S9Uj24wPIx0lTKyZMcWGE7hkOznQ=
NEXT_PUBLIC_STUDYGENIE_BACKEND_URL=https://studygenie-ai.onrender.com
```

✅ **Backend is already deployed and running!**

### 2. Start the App
```bash
npm run dev
```

### 3. Try It Out
1. Visit: `http://localhost:3000/study-genie`
2. Click "Try Demo" or upload a PDF syllabus
3. Explore the AI-generated skill tree
4. Start a combat mode quiz battle!

## 🧪 Test Backend Connection

```bash
curl https://studygenie-ai.onrender.com/health
```

Should return:
```json
{"status":"healthy","service":"StudyGenie AI Backend"}
```

## 📝 What Got Integrated

### ✅ Backend Integration Points

1. **PDF Upload** (`syllabus-upload.tsx`)
   - Now calls: `studyGenieBackend.uploadPDF(file, 15, 12)`
   - Returns: Skill map + 15 quiz questions + 12 interview Q&A
   - Processing time: 10-30 seconds

2. **Combat Mode** (`combat-mode.tsx`)
   - Now calls: `studyGenieBackend.generateQuiz(topic, difficulty, 10)`
   - Gets real AI-generated questions
   - Difficulty-based enemy types

3. **Practice Editor** (`practice-editor-enhanced.tsx`)
   - Now calls: `studyGenieBackend.generateCodingChallenge(topic, difficulty, 'python')`
   - Real coding problems with test cases
   - Hints from Gemini AI

4. **Flashcards** (`flashcard-view.tsx`)
   - Now calls: `studyGenieBackend.generateFlashcards(topic, 10)`
   - AI-generated front/back cards

### 🔌 New Service Layer

**File:** `src/services/studygenie-backend.ts`

Key methods:
- `uploadPDF(file, quizCount, interviewCount)` - Full syllabus analysis
- `generateQuiz(topic, difficulty, numQuestions)` - Topic-specific quizzes
- `generateCodingChallenge(topic, difficulty, language)` - Code problems
- `generateFlashcards(topic, numCards)` - Study cards
- `transformSkillMapToUnits(skillMap)` - Backend → Frontend data transform
- `transformQuizToTamboFormat(quiz)` - Quiz data normalization

## 🎯 How Tambo + Backend Work Together

```
User uploads PDF
     ↓
Frontend sends to Backend API
     ↓
Backend extracts text + generates with Gemini
     ↓
Frontend receives structured data
     ↓
Tambo dynamically renders UI based on data
     ↓
User sees custom skill tree, quizzes, challenges
```

### Example Flow: Skill Tree Generation

1. **User uploads:** `Data_Structures_Syllabus.pdf`

2. **Backend processes:**
   ```python
   # Extract text from PDF
   text = extract_text_from_pdf(file)
   
   # Generate with Gemini 2.0
   skill_map = gemini.generate_skill_map(text)
   
   # Returns JSON
   {
     "skill_map": [
       {
         "topic": "Arrays",
         "subtopics": ["Static Arrays", "Dynamic Arrays", "2D Arrays"],
         "difficulty": "Easy",
         "estimated_hours": 4
       },
       {
         "topic": "Linked Lists",
         "subtopics": ["Singly Linked", "Doubly Linked", "Circular"],
         "difficulty": "Medium",
         "estimated_hours": 6,
         "prerequisites": ["Arrays"]
       }
     ]
   }
   ```

3. **Tambo generates UI:**
   - Dynamically creates node graph
   - Shows Arrays → Linked Lists dependency
   - Color codes by difficulty
   - Adds unlock animations

## 🔥 Key Features Now Working

### ✅ Real PDF Analysis
Upload any course syllabus and get:
- Structured topic hierarchy
- Difficulty ratings
- Time estimates
- Prerequisites

### ✅ AI-Generated Quizzes
- 15 questions per PDF upload
- Topic-specific generation
- Difficulty-based (Easy/Medium/Hard)
- Detailed explanations

### ✅ Interview Preparation
- 12 Q&A pairs per upload
- Follow-up questions
- Key points to remember

### ✅ Coding Challenges
- Language-specific (Python, JavaScript, etc.)
- Test cases with explanations
- Complexity analysis
- Hints system

### ✅ Flashcard Generation
- 10 cards per topic
- Question/answer format
- Topic-tagged

## 🐛 Troubleshooting

### Backend takes 30+ seconds
**Cause:** Render free tier has cold starts  
**Solution:** Wait patiently on first request, then it's fast

### PDF upload fails
**Check:**
- File is < 16MB
- PDF has extractable text (not scanned image)
- Backend is awake: `curl https://studygenie-ai.onrender.com/health`

### TypeScript errors
```bash
npm run lint:fix
```

## 📊 Backend API Endpoints

All deployed at: `https://studygenie-ai.onrender.com`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/upload-pdf` | POST | Process syllabus |
| `/api/generate-quiz` | POST | Create quiz |
| `/api/generate-coding-challenge` | POST | Create code problem |
| `/api/generate-flashcards` | POST | Create flashcards |

## 🎓 Demo vs Production Mode

The app intelligently handles both:

**Production Mode** (with backend):
- Real AI generation
- PDF processing
- Dynamic content

**Demo Mode** (fallback):
- Pre-loaded sample data
- Instant loading
- Works offline

## 🚢 Deployment Checklist

### Frontend (Vercel/Netlify)
- [x] Set `NEXT_PUBLIC_STUDYGENIE_BACKEND_URL`
- [x] Set `NEXT_PUBLIC_TAMBO_API_KEY`
- [x] Build command: `npm run build`
- [x] Output directory: `.next`

### Backend
- [x] Already deployed on Render
- [x] URL: `https://studygenie-ai.onrender.com`
- [x] Health check working
- [x] All endpoints tested

## 🎉 You're Ready!

Everything is integrated and working. Just run:

```bash
npm run dev
```

And visit: `http://localhost:3000/study-genie`

Happy learning! 🚀
