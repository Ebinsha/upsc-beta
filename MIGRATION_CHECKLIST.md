# 🚀 Database Migration Checklist

## Pre-Migration

- [ ] Backup existing Supabase database (if any)
- [ ] Review the schema in `user-progress-tables.sql`
- [ ] Ensure you have Supabase project access
- [ ] Note your Supabase project URL and keys

## Migration Steps

### Step 1: Update Profiles Table
- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Copy content from `lib/migration/handle-user.sql`
- [ ] Execute the SQL
- [ ] Verify profiles table has:
  - [ ] `username` (text, unique)
  - [ ] `email` (text)
  - [ ] `full_name` (text)
  - [ ] `avatar_url` (text)
  - [ ] No `website` field

### Step 2: Create Progress Tracking Tables
- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Copy content from `lib/migration/user-progress-tables.sql`
- [ ] Execute the SQL (this will take ~30 seconds)
- [ ] Check for any errors in the output

### Step 3: Verify Tables Created
Go to Supabase Dashboard → Table Editor and verify:

- [ ] `user_streaks` table exists
- [ ] `user_topic_mastery` table exists
- [ ] `user_study_sessions` table exists
- [ ] `user_test_records` table exists
- [ ] `user_activities` table exists
- [ ] `user_settings` table exists
- [ ] `profiles` table updated

### Step 4: Verify Functions
Go to Database → Functions and verify:

- [ ] `update_user_streak` function exists
- [ ] `get_total_study_time` function exists
- [ ] `get_overall_practice_score` function exists
- [ ] `get_topics_mastered_count` function exists
- [ ] `handle_new_user` function exists
- [ ] `initialize_user_data` function exists
- [ ] `update_updated_at_column` function exists

### Step 5: Verify Triggers
Go to Database → Triggers and verify:

- [ ] `on_auth_user_created` (creates profile)
- [ ] `on_user_created_initialize_data` (creates default records)
- [ ] Update triggers for timestamp columns

### Step 6: Verify Policies (RLS)
For each table, check RLS policies exist:

- [ ] user_streaks (select, insert, update)
- [ ] user_topic_mastery (select, insert, update)
- [ ] user_study_sessions (select, insert)
- [ ] user_test_records (select, insert)
- [ ] user_activities (select, insert)
- [ ] user_settings (select, insert, update)

### Step 7: Test with Existing User
- [ ] Create a test user via your app
- [ ] Verify profile created in `profiles` table
- [ ] Verify default records created in:
  - [ ] `user_streaks` (initial streak = 0)
  - [ ] `user_settings` (default settings)

### Step 8: Test App Integration
- [ ] Run the app: `npm start` or `npx expo start`
- [ ] Login with test user
- [ ] Complete a practice test
- [ ] Verify data saved in:
  - [ ] `user_test_records`
  - [ ] `user_topic_mastery`
  - [ ] `user_study_sessions`
  - [ ] `user_activities`
  - [ ] `user_streaks` (updated)

### Step 9: Test Dashboard
- [ ] Navigate to dashboard (or create one using DashboardExample.tsx)
- [ ] Verify stats display:
  - [ ] Current streak shows
  - [ ] Topics mastered shows (should be 1 after test)
  - [ ] Total study time shows
  - [ ] Tests taken shows (should be 1)
  - [ ] Practice score shows
  - [ ] Recent activities shows

### Step 10: Test Hooks
Run these in a component to verify:

```typescript
// Test each hook
const { stats } = useUserDashboard();
console.log('Dashboard stats:', stats);

const { streak } = useUserStreak();
console.log('Streak:', streak);

const { tests, overallScore } = useTestRecords();
console.log('Tests:', tests, 'Score:', overallScore);

const { activities } = useRecentActivities(5);
console.log('Activities:', activities);
```

- [ ] All hooks return data without errors
- [ ] Data matches what's in database

## Post-Migration Testing

### Streak Testing
- [ ] Complete study activity today
- [ ] Check `user_streaks.current_streak` incremented
- [ ] Complete activity tomorrow (change system date to test)
- [ ] Verify streak incremented to 2
- [ ] Skip a day, then study
- [ ] Verify streak reset to 1

### Topic Mastery Testing
- [ ] Complete test on subtopic A
- [ ] Verify subtopic A marked as completed
- [ ] Complete test on subtopic B
- [ ] Verify topics_mastered = 2
- [ ] Complete another test on subtopic A
- [ ] Verify questions_attempted increased
- [ ] Verify accuracy percentage updated

### Test Records Testing
- [ ] Complete practice test with 8/10 correct
- [ ] Verify score_percentage = 80
- [ ] Verify answers_data saved as JSON
- [ ] Complete another test
- [ ] Verify overall_practice_score updated

### Activity Feed Testing
- [ ] Complete various activities
- [ ] Verify activities appear in feed
- [ ] Verify ordered by created_at (newest first)
- [ ] Verify activity metadata correct

### Settings Testing
- [ ] Update a setting (e.g., theme)
- [ ] Verify setting persisted
- [ ] Reload app
- [ ] Verify setting still applied

## Troubleshooting

### If tables don't create:
1. Check for syntax errors in SQL
2. Ensure you have sufficient permissions
3. Try running schema in smaller chunks

### If RLS blocks access:
1. Verify user is authenticated
2. Check auth.uid() returns user's ID
3. Review RLS policies

### If functions fail:
1. Check function syntax in Supabase
2. Verify function security settings
3. Check logs for detailed errors

### If hooks don't return data:
1. Check browser/app console for errors
2. Verify Supabase client configured
3. Check RLS policies allow access
4. Verify tables have data

## Rollback Plan

If something goes wrong:

### Option 1: Drop all tables
```sql
drop table if exists user_activities cascade;
drop table if exists user_test_records cascade;
drop table if exists user_study_sessions cascade;
drop table if exists user_topic_mastery cascade;
drop table if exists user_settings cascade;
drop table if exists user_streaks cascade;
```

### Option 2: Restore from backup
Use Supabase Dashboard → Database → Backups

### Option 3: Reset entire database
```bash
supabase db reset
```
(Only if using Supabase CLI and local development)

## Success Criteria

✅ Migration is successful when:
- [ ] All tables created without errors
- [ ] All functions working
- [ ] RLS policies active
- [ ] Test user can complete tests
- [ ] Test results save to database
- [ ] Dashboard displays correct stats
- [ ] Streak updates properly
- [ ] No console errors in app

## Performance Monitoring

After migration, monitor:
- [ ] Query response times (should be < 500ms)
- [ ] Database size (in Supabase dashboard)
- [ ] API calls per user (in Supabase logs)
- [ ] Error rates (check Supabase logs)

## Next Steps After Migration

1. [ ] Create dashboard UI using `DashboardExample.tsx`
2. [ ] Add streak notifications
3. [ ] Build achievements system
4. [ ] Add leaderboards (if desired)
5. [ ] Set up analytics tracking
6. [ ] Create weekly progress reports

---

## 📞 Support

If you encounter issues:
1. Check `lib/migration/README.md` for detailed docs
2. Review error messages in Supabase logs
3. Check app console for client-side errors
4. Verify RLS policies in Supabase dashboard

## 📊 Expected Results

After successful migration:
- 6 new tables in database
- 7 functions created
- Multiple triggers active
- RLS policies protecting all data
- Users can track progress automatically
- Dashboard shows real-time stats

---

**Date Completed:** _______________

**Tested By:** _______________

**Status:** ⬜ Pending | ⬜ In Progress | ⬜ Complete | ⬜ Issues

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
