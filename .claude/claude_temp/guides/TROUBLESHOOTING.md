# Troubleshooting Guide

> **File**: `.claude/guides/TROUBLESHOOTING.md`
> **Last Updated**: October 29, 2025

---

## Build Failures

### Issue: TypeScript errors during build

```bash
# Solution
npm run type-check  # Find type errors
# Fix errors, then
npm run build
```

### Issue: Module not found

```bash
# Solution
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## Development Server Issues

### Issue: Port 3000 already in use

```bash
# Solution (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Issue: Environment variables not loading

```bash
# Solution
# 1. Verify .env.local exists
# 2. Restart dev server
# 3. Check variable names start with NEXT_PUBLIC_ for client-side access
```

---

## Database Issues

### Issue: Supabase connection timeout

```bash
# Solution
# 1. Check Supabase project is active
# 2. Verify credentials in .env.local
# 3. Check RLS policies aren't blocking requests
```

### Issue: Database migration needed

```bash
# Solution
# Run SQL in Supabase dashboard or use migration tool
# Backup data first!
```

---

## Email Issues

### Issue: Emails not sending

```bash
# Solution
# 1. Verify Resend API key
# 2. Check sender email is verified in Resend
# 3. Check email logs table for error messages
# 4. Test with Resend dashboard
```

---

## Deployment Issues

### Issue: Vercel deployment failing

```bash
# Solution
# 1. Check GitHub Actions logs
# 2. Verify environment variables in Vercel dashboard
# 3. Ensure build succeeds locally first
# 4. Check Vercel deployment logs for specific errors
```

### Issue: Cloudflare showing old content

```bash
# Solution
# Purge Cloudflare cache
curl -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

---

## Test Failures

### Issue: Tests failing

```bash
# Update snapshots
npm run test -- -u

# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Issue: Build failing

```bash
# Clear all caches
rm -rf .next node_modules
npm install
npm run build
```

---

[Return to Main Index](../CLAUDE.md)
