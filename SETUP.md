# Setup Guide After Cloning

## Quick Setup (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp example.env.local .env.local
```

Then edit `.env.local` and add your API keys:
```env
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here
NEXT_PUBLIC_STUDYGENIE_BACKEND_URL=https://studygenie-ai.onrender.com
```

### 3. Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000/study-genie`

## Common Cloning Issues & Solutions

### Issue: `node_modules` missing
**Error:** `Cannot find module 'next'` or similar
**Solution:**
```bash
npm install
```

### Issue: `.env.local` missing
**Error:** `NEXT_PUBLIC_STUDYGENIE_BACKEND_URL is undefined`
**Solution:**
```bash
cp example.env.local .env.local
# Then edit .env.local with your API keys
```

### Issue: TypeScript errors
**Error:** `Cannot find module` or type errors
**Solution:**
```bash
npm install
npm run build  # This will show any real errors
```

### Issue: Backend connection fails
**Error:** `502 Bad Gateway` or `Failed to connect`
**Solution:**
1. Check backend is running:
   ```bash
   curl https://studygenie-ai.onrender.com/health
   ```
2. First request may take 30-60 seconds (Render free tier cold start)
3. Verify `.env.local` has correct backend URL

### Issue: Port 3000 already in use
**Error:** `Port 3000 is already in use`
**Solution:**
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

## File Checklist After Cloning

✅ **Required files (should exist):**
- `package.json` - Dependencies
- `next.config.ts` - Next.js config
- `tsconfig.json` - TypeScript config
- `example.env.local` - Environment template
- `src/` directory - All source code

❌ **Files that should NOT exist (will be created):**
- `node_modules/` - Run `npm install` to create
- `.next/` - Run `npm run build` or `npm run dev` to create
- `.env.local` - Copy from `example.env.local`

## Verification Steps

After cloning and setup, verify everything works:

```bash
# 1. Check dependencies installed
npm list --depth=0

# 2. Check environment variables
# (Make sure .env.local exists and has values)

# 3. Test build
npm run build

# 4. Start dev server
npm run dev

# 5. Test backend connection
curl https://studygenie-ai.onrender.com/health
```

## Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### TypeScript Errors
```bash
# Check for type errors
npx tsc --noEmit

# Auto-fix linting issues
npm run lint:fix
```

### Backend Not Responding
- Check backend URL in `.env.local`
- Verify backend is deployed: https://studygenie-ai.onrender.com/health
- Wait 30-60 seconds on first request (cold start)

## Need Help?

1. Check `QUICK_START.md` for detailed integration info
2. Check `README.md` for full documentation
3. Verify all environment variables are set correctly

