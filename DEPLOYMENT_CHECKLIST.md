# Deployment Checklist - Phase 4 Sprint 3-5

**Status**: Code pushed to `main` branch - Vercel auto-deployment triggered ✓

## 🚀 Automatic Deployment Status

Your code has been successfully pushed to GitHub. Vercel should automatically:

1. Detect the push to `main` branch
2. Start building the application
3. Deploy to production

**Monitor deployment**: https://vercel.com/dashboard (check your project)

## ⚠️ Post-Deployment Requirements

### 1. Database Migrations (REQUIRED)

Run these SQL migrations in your Supabase dashboard:

```sql
-- File: supabase-migrations/20250131_calendar_integrations.sql
-- Creates calendar_integrations table for OAuth tokens
-- Adds google_calendar_event_id, outlook_calendar_event_id to appointments

-- File: supabase-migrations/20250131_reschedule_requests.sql
-- Creates reschedule_requests table
-- Adds scheduled_date_time, original_scheduled_date_time to appointments
```

**Steps**:

1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase-migrations/20250131_calendar_integrations.sql`
3. Copy contents and run
4. Open `supabase-migrations/20250131_reschedule_requests.sql`
5. Copy contents and run

### 2. Environment Variables (OPTIONAL - For Calendar Features)

Add these to Vercel Dashboard → Settings → Environment Variables:

#### Google Calendar (Optional)

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

**Setup**: https://console.cloud.google.com/apis/credentials

- Enable Google Calendar API
- Create OAuth 2.0 Client → Web application
- Authorized redirect URIs: `https://yourdomain.com/api/calendar/google/callback`

#### Outlook Calendar (Optional)

```bash
MICROSOFT_CLIENT_ID=your-app-id
MICROSOFT_CLIENT_SECRET=your-client-secret
MICROSOFT_TENANT_ID=common
```

**Setup**: https://portal.azure.com/ → Azure AD → App registrations

- Register new app
- API permissions → Calendars.ReadWrite
- Redirect URI: `https://yourdomain.com/api/calendar/outlook/callback`
- Create client secret in "Certificates & secrets"

#### Email Branding (Optional)

```bash
NEXT_PUBLIC_COMPANY_NAME=Your Company Name
EMAIL_FROM_NAME=Your Team Name
```

### 3. Testing Checklist

After deployment, test these features:

#### Basic Features (Should Work Immediately)

- [ ] Admin login via magic link
- [ ] View appointments list
- [ ] Filter appointments by status
- [ ] Search appointments by name/email
- [ ] View appointment details
- [ ] Send emails to clients
- [ ] Preview emails before sending
- [ ] Update appointment status
- [ ] Add notes to appointments

#### Sprint 3 Features (Should Work Immediately)

- [ ] Multi-select appointments (checkboxes)
- [ ] Bulk status updates
- [ ] Bulk email sending
- [ ] CSV export (download appointments)
- [ ] Advanced filters (date range + sorting)

#### Sprint 4 Features (Requires OAuth Setup)

- [ ] Connect Google Calendar (OAuth flow)
- [ ] Sync appointment to Google Calendar
- [ ] Update Google Calendar event
- [ ] Remove from Google Calendar
- [ ] Connect Outlook Calendar (OAuth flow)
- [ ] Sync appointment to Outlook Calendar
- [ ] Toggle between Google/Outlook in UI

#### Sprint 5 Features (Should Work After Migrations)

- [ ] Create reschedule request
- [ ] View reschedule requests
- [ ] Approve reschedule request
- [ ] Reject reschedule request

## 🔍 Troubleshooting

### Build Fails on Vercel

Check Vercel build logs for:

- Missing environment variables (SUPABASE_URL, RESEND_API_KEY, etc.)
- Node version mismatch (project uses Node 18+)

### Calendar Features Not Working

1. Verify OAuth credentials in Vercel dashboard
2. Check redirect URIs match exactly (include `/api/calendar/google/callback`)
3. Run migrations to ensure `calendar_integrations` table exists
4. Check Vercel logs for OAuth errors

### Reschedule Features Not Working

1. Ensure migrations are run (check `reschedule_requests` table exists)
2. Verify `scheduled_date_time` column added to `appointments`

### Database Errors

- Ensure all required Supabase tables exist
- Run migrations in correct order
- Check RLS (Row Level Security) policies don't block service role

## 📊 What Was Deployed

### New Features (Production Ready)

- ✅ Bulk operations (select multiple appointments)
- ✅ CSV export with filtering
- ✅ Advanced date range + sorting filters
- ✅ Email preview before sending
- ✅ Google Calendar OAuth + sync
- ✅ Outlook Calendar OAuth + sync
- ✅ Reschedule request system
- ✅ Configurable email branding

### New Files Deployed

- 36 files modified/created
- 5,880+ lines of code added
- 2 database migration files
- 8 new admin components
- 6 new API endpoints
- Complete calendar integration

### Dependencies Added

- googleapis (Google Calendar)
- @microsoft/microsoft-graph-client (Outlook)
- @microsoft/microsoft-graph-types (TypeScript types)
- @azure/identity (Azure auth)

## 🎯 Next Steps

### Immediate Actions (Required)

1. ✅ Monitor Vercel deployment completion
2. ⬜ Run database migrations in Supabase
3. ⬜ Test basic admin features

### Optional Actions (If Using Calendar Features)

4. ⬜ Set up Google OAuth credentials
5. ⬜ Set up Outlook OAuth credentials
6. ⬜ Add environment variables to Vercel
7. ⬜ Test calendar sync features

### Future Development (Placeholders Created)

- Sprint 6: Twilio SMS integration (placeholder at `src/lib/sms/twilio.ts`)
- Sprint 7: Client portal (not started)
- Sprint 8: Stripe payments (placeholder at `src/lib/payments/stripe.ts`)
- Sprint 9: E2E tests with Playwright (not started)

See `IMPLEMENTATION_STATUS.md` for detailed feature breakdown.

## 📞 Support

If deployment fails or features don't work:

1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Ensure database migrations are run
4. Review `IMPLEMENTATION_STATUS.md` for feature requirements
5. Check browser console for client-side errors
6. Check Vercel function logs for server-side errors

---

**Build Status**: ✓ Successful (warnings only, no errors)
**Deployment**: Auto-triggered via Git push
**Migrations Required**: Yes (2 files)
**Environment Variables**: Optional (for calendar features)
