# Supabase Database Setup Summary

## 📋 Overview

I've created a comprehensive database schema for tracking user progress in your UPSC app. This includes 6 main tables and helper functions to manage user data.

## 🗄️ Tables Created

### 1. **user_streaks**
- Tracks daily study streaks (current and longest)
- Auto-updates when user studies
- Resets if user misses a day

### 2. **user_topic_mastery**
- Tracks completed subtopics
- Records questions attempted and accuracy
- Marks subtopic as "mastered" when user attempts questions

### 3. **user_study_sessions**
- Records individual study sessions
- Tracks duration in seconds
- Categorizes by activity type (study/test/practice)

### 4. **user_test_records**
- Stores all test attempts with detailed results
- Auto-calculates score percentage
- Stores answer data in JSON format

### 5. **user_activities**
- Timeline of user actions (recent activities feed)
- Supports multiple activity types
- Flexible metadata storage

### 6. **user_settings**
- User preferences (notifications, theme, privacy)
- Study preferences (timer, explanations)
- Display preferences

## 📊 Dashboard Metrics

The system tracks and displays:

1. ✅ **Streak Days**: Consecutive days studied
2. 📚 **Topics Mastered**: Count of completed subtopics
3. ⏱️ **Total Study Time**: All time spent studying
4. 📝 **Tests Taken**: Number of completed tests
5. 📈 **Practice Score**: Overall average percentage
6. 🕐 **Recent Activities**: Timeline of user actions

## 📁 Files Created

```
lib/
  migration/
    ✅ user-progress-tables.sql    (Database schema)
    ✅ README.md                    (Documentation)
    📝 handle-user.sql              (Updated with profiles)
  ✅ userProgress.ts                (Helper functions)

types/
  ✅ database.ts                    (TypeScript types)

hooks/
  ✅ useUserProgress.ts             (React hooks)

app/
  📝 test-results.tsx               (Updated to save results)
```

## 🚀 Quick Setup

### Step 1: Run Database Migration

**In Supabase Dashboard:**
1. Go to SQL Editor
2. Copy content from `lib/migration/user-progress-tables.sql`
3. Execute the SQL
4. Then run `lib/migration/handle-user.sql` to update profiles table

**Or using Supabase CLI:**
```bash
supabase db reset
```

### Step 2: Update Profiles Table (Already Done)
The `handle-user.sql` file has been updated with:
- `username` (text, unique)
- `email` (text)
- `full_name` (text)
- `avatar_url` (text)
- Removed `website` field ✅

### Step 3: Test in Your App

```typescript
// In any component
import { useUserDashboard } from '@/hooks/useUserProgress';

function Dashboard() {
  const { stats, loading } = useUserDashboard();
  
  if (loading) return <Text>Loading...</Text>;
  
  return (
    <View>
      <Text>Current Streak: {stats?.current_streak} days</Text>
      <Text>Topics Mastered: {stats?.topics_mastered}</Text>
      <Text>Practice Score: {stats?.overall_practice_score}%</Text>
    </View>
  );
}
```

## 🎯 Features Implemented

### ✅ Automatic Test Result Saving
- Test results are now automatically saved to database
- Updates topic mastery when test is completed
- Records study session with time taken
- Creates activity feed entry
- Updates user streak

### ✅ Helper Functions
```typescript
// Streak management
updateStreak(userId)

// Get statistics
getTotalStudyTime(userId)
getOverallPracticeScore(userId)
getTopicsMasteredCount(userId)
```

### ✅ React Hooks
```typescript
useUserDashboard()      // Get all dashboard stats
useUserStreak()         // Get current streak
useTopicMastery()       // Get mastered topics
useStudyTime()          // Get study time & sessions
useTestRecords()        // Get test history
useRecentActivities()   // Get activity feed
useUserSettings()       // Get/update settings
```

## 💡 Usage Examples

### Save Test Results (Auto-integrated in test-results.tsx)
```typescript
const { saveTest } = useTestRecords();

await saveTest({
  test_title: "Practice Test",
  topic_id: "history",
  subtopic_id: "ancient-india",
  total_questions: 10,
  correct_answers: 8,
  time_taken_seconds: 300,
  test_type: 'practice',
  answers_data: answersArray,
});
```

### Display Dashboard
```typescript
const { stats } = useUserDashboard();

<Text>🔥 {stats?.current_streak} day streak</Text>
<Text>📚 {stats?.topics_mastered} topics mastered</Text>
<Text>⏱️ {formatStudyTime(stats?.total_study_time_seconds)}</Text>
<Text>📊 {stats?.overall_practice_score}% average score</Text>
```

### Show Recent Activities
```typescript
const { activities } = useRecentActivities(10);

activities.map(activity => (
  <View key={activity.id}>
    <Text>{activity.activity_title}</Text>
    <Text>{activity.activity_description}</Text>
  </View>
))
```

## 🔒 Security

All tables have Row Level Security (RLS) enabled:
- Users can only access their own data
- Automatic user_id verification
- Secure database functions

## 📝 Next Steps

1. **Run the migrations** in Supabase
2. **Test the dashboard** - Check if stats appear
3. **Complete a test** - Verify data is saved
4. **Check activities** - View recent actions
5. **Customize settings** - Add user preferences

## 🎨 Dashboard UI Components to Build

You'll need to create UI components for:

1. **Streak Display**
   - Current streak counter
   - Longest streak badge
   - Calendar view of study days

2. **Progress Stats**
   - Circular progress for topics mastered
   - Study time chart (daily/weekly)
   - Test score trends

3. **Activity Feed**
   - List of recent activities
   - Achievement notifications
   - Milestone celebrations

4. **Settings Screen**
   - Notification toggles
   - Study preferences
   - Theme selector
   - Privacy controls

## 🐛 Troubleshooting

**Stats not showing?**
- Check if user is authenticated
- Verify migrations ran successfully
- Check browser/app console for errors

**Test not saving?**
- Ensure all required fields are provided
- Check if `subtopic_id` exists
- Verify user permissions in Supabase

**Streak not updating?**
- Check if study session was recorded
- Verify `update_user_streak()` is called
- Look at `last_study_date` in database

## 📚 Documentation

Full documentation available in:
- `lib/migration/README.md` - Detailed schema docs
- `types/database.ts` - TypeScript type definitions
- `lib/userProgress.ts` - Function documentation

---

**Status**: ✅ Ready to use!

Run the migrations and start tracking user progress! 🚀
