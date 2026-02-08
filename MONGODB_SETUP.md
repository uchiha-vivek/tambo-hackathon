# MongoDB Setup Guide

## ✅ Database Migration Complete

The database has been migrated from Prisma/PostgreSQL to **MongoDB with Mongoose**.

## 📦 What Changed

### Dependencies
- ❌ Removed: `@prisma/client`, `prisma`, `@auth/prisma-adapter`
- ✅ Added: `mongoose`, `mongodb`, `@auth/mongodb-adapter`

### Database Models
All models are now Mongoose schemas in `src/models/`:
- `User.ts` - User accounts
- `Account.ts` - NextAuth accounts
- `Session.ts` - NextAuth sessions
- `VerificationToken.ts` - Email verification
- `UserProfile.ts` - Game stats and profile
- `Syllabus.ts` - Course/syllabus data
- `Topic.ts` - Topics from skill map
- `Progress.ts` - Progress tracking
- `StudySession.ts` - Study session logs
- `Flashcard.ts` - Flashcards with spaced repetition
- `Achievement.ts` - User achievements
- `DailyQuest.ts` - Daily quests

### Services Updated
- ✅ `src/lib/db.ts` - MongoDB connection
- ✅ `src/lib/progress-service.ts` - Mongoose queries
- ✅ `src/app/api/auth/[...nextauth]/route.ts` - MongoDB adapter
- ✅ `src/app/api/auth/register/route.ts` - Mongoose models
- ✅ `src/app/api/youtube/parse/route.ts` - Mongoose models

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd tambo-hackathon
npm install
```

### 2. Setup MongoDB

#### Option A: Local MongoDB
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string

### 3. Configure Environment Variables

Update `.env.local`:

```env
# MongoDB Connection String
MONGODB_URI="mongodb://localhost:27017/studygenie"
# OR for MongoDB Atlas:
# MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/studygenie?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Tambo AI
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here

# StudyGenie Backend
NEXT_PUBLIC_STUDYGENIE_BACKEND_URL=https://studygenie-ai.onrender.com
```

**Note:** You can use `DATABASE_URL` instead of `MONGODB_URI` - both work.

### 4. Run Development Server

```bash
npm run dev
```

The database connection will be established automatically on first use.

## 📊 Database Structure

### Collections

1. **users** - User accounts
2. **accounts** - OAuth accounts (NextAuth)
3. **sessions** - User sessions (NextAuth)
4. **verificationtokens** - Email verification
5. **userprofiles** - User game stats
6. **syllabi** - Course/syllabus documents
7. **topics** - Topics from skill maps
8. **progresses** - Progress tracking records
9. **studysessions** - Study session logs
10. **flashcards** - Flashcard data
11. **achievements** - User achievements
12. **dailyquests** - Daily quest data

## 🔄 Migration Notes

### Key Differences from Prisma

1. **Object IDs**: MongoDB uses `_id` (ObjectId) instead of `id` (string)
2. **Queries**: Use Mongoose methods instead of Prisma
3. **Relations**: Use `populate()` instead of `include`
4. **No Migrations**: MongoDB is schema-less (but we use Mongoose for validation)

### Example Query Changes

**Before (Prisma):**
```typescript
const user = await db.user.findUnique({
  where: { email: 'user@example.com' }
});
```

**After (Mongoose):**
```typescript
const user = await User.findOne({ email: 'user@example.com' });
```

## 🧪 Testing the Connection

Create a test file `test-db.ts`:

```typescript
import connectDB from '@/lib/db';
import User from '@/models/User';

async function test() {
  await connectDB();
  const users = await User.find();
  console.log('Users:', users);
}

test();
```

## 🚨 Important Notes

1. **No Prisma Migrations**: MongoDB doesn't need migrations - schemas are enforced by Mongoose
2. **Connection Pooling**: Mongoose handles connection pooling automatically
3. **Type Safety**: All models have TypeScript interfaces
4. **Indexes**: Unique indexes are defined in schemas (email, etc.)

## 📝 Next Steps

1. Start MongoDB (local or Atlas)
2. Update `.env.local` with connection string
3. Run `npm run dev`
4. Test registration/login
5. Data will be created automatically on first use

## 🎉 Benefits of MongoDB

- ✅ No migrations needed
- ✅ Flexible schema (easy to add fields)
- ✅ Better for nested data (skill maps, topics)
- ✅ Easier to scale horizontally
- ✅ Native JSON support
- ✅ Simpler queries for nested data

Your StudyGenie app is now using MongoDB! 🚀

