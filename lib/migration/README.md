# User Progress Tracking - Database Schema

This document explains the database schema for tracking user progress in the UPSC app.

## 📊 Database Tables

### 1. **user_streaks**
Tracks user study streaks and consistency.

**Columns:**
- `id` (uuid): Primary key
- `user_id` (uuid): Foreign key to auth.users
- `current_streak` (integer): Current consecutive days studied
- `longest_streak` (integer): Best streak ever achieved
- `last_study_date` (date): Last date user studied
- `created_at`, `updated_at` (timestamp)

**Features:**
- Automatically updates when user completes any study activity
- Resets if user misses a day
- Tracks personal best (longest streak)

---

### 2. **user_topic_mastery**
Tracks which topics/subtopics users have mastered.

**Columns:**
- `id` (uuid): Primary key
- `user_id` (uuid): Foreign key to auth.users
- `topic_id` (text): Topic identifier
- `subtopic_id` (text): Subtopic identifier
- `is_completed` (boolean): Whether user has attempted questions
- `questions_attempted` (integer): Total questions attempted
- `questions_correct` (integer): Total correct answers
- `last_practiced_at` (timestamp): Last practice time
- `completed_at` (timestamp): When first completed
- `created_at`, `updated_at` (timestamp)

**Features:**
- Marks subtopic as completed when user attempts any questions
- Accumulates stats across multiple attempts
- Tracks accuracy per subtopic

---

### 3. **user_study_sessions**
Records individual study sessions with duration.

**Columns:**
- `id` (uuid): Primary key
- `user_id` (uuid): Foreign key to auth.users
- `session_date` (date): Date of session
- `duration_seconds` (integer): Duration in seconds
- `topic_id` (text): Optional topic
- `subtopic_id` (text): Optional subtopic
- `activity_type` (enum): 'study', 'test', or 'practice'
- `created_at` (timestamp)

**Features:**
- Tracks time spent studying
- Categorizes activities
- Used for total study time calculation

---

### 4. **user_test_records**
Stores all test attempts with scores and answers.

**Columns:**
- `id` (uuid): Primary key
- `user_id` (uuid): Foreign key to auth.users
- `test_title` (text): Test name
- `topic_id` (text): Optional topic
- `subtopic_id` (text): Subtopic identifier
- `total_questions` (integer): Number of questions
- `correct_answers` (integer): Correct answers count
- `score_percentage` (numeric): Auto-calculated percentage
- `time_taken_seconds` (integer): Time spent
- `test_type` (enum): 'practice', 'mock', or 'chapter'
- `answers_data` (jsonb): Detailed answer data
- `created_at` (timestamp)

**Features:**
- Auto-calculates score percentage
- Stores full answer details in JSON
- Tracks test completion time
- Used for practice score calculation

---

### 5. **user_activities**
Recent user activities for activity feed.

**Columns:**
- `id` (uuid): Primary key
- `user_id` (uuid): Foreign key to auth.users
- `activity_type` (enum): Activity category
  - 'test_completed'
  - 'topic_completed'
  - 'study_session'
  - 'streak_milestone'
  - 'achievement'
- `activity_title` (text): Display title
- `activity_description` (text): Description
- `metadata` (jsonb): Additional data
- `created_at` (timestamp)

**Features:**
- Timeline of user actions
- Supports various activity types
- Flexible metadata storage

---

### 6. **user_settings**
User preferences and settings.

**Columns:**

**Notification Preferences:**
- `notifications_enabled` (boolean)
- `daily_reminder_enabled` (boolean)
- `daily_reminder_time` (time)
- `streak_reminder_enabled` (boolean)

**Study Preferences:**
- `questions_per_test` (integer)
- `test_timer_enabled` (boolean)
- `show_explanations_immediately` (boolean)

**Display Preferences:**
- `theme` (enum): 'light', 'dark', or 'auto'
- `language` (text)

**Privacy Preferences:**
- `show_profile_publicly` (boolean)
- `show_streak_publicly` (boolean)

---

## 🔧 Helper Functions

### Streak Management
```sql
-- Updates user streak (call when user studies)
update_user_streak(p_user_id uuid)
```

### Statistics
```sql
-- Get total study time in seconds
get_total_study_time(p_user_id uuid) returns integer

-- Get overall practice test score percentage
get_overall_practice_score(p_user_id uuid) returns numeric

-- Get count of completed topics
get_topics_mastered_count(p_user_id uuid) returns integer
```

---

## 📱 Usage in React Native

### Import the hooks
```typescript
import {
  useUserDashboard,
  useUserStreak,
  useTopicMastery,
  useStudyTime,
  useTestRecords,
  useRecentActivities,
  useUserSettings,
} from '@/hooks/useUserProgress';
```

### 1. Dashboard Statistics
```typescript
function Dashboard() {
  const { stats, loading } = useUserDashboard();
  
  if (loading) return <Loading />;
  
  return (
    <View>
      <Text>Current Streak: {stats?.current_streak} days</Text>
      <Text>Topics Mastered: {stats?.topics_mastered}</Text>
      <Text>Total Study Time: {formatStudyTime(stats?.total_study_time_seconds || 0)}</Text>
      <Text>Tests Taken: {stats?.total_tests_taken}</Text>
      <Text>Practice Score: {stats?.overall_practice_score}%</Text>
    </View>
  );
}
```

### 2. Save Test Results
```typescript
function TestResults({ score, totalQuestions, timeTaken, subtopicId }) {
  const { saveTest } = useTestRecords();
  
  useEffect(() => {
    const saveResults = async () => {
      await saveTest({
        test_title: "Practice Test",
        topic_id: "history",
        subtopic_id: subtopicId,
        total_questions: totalQuestions,
        correct_answers: score,
        time_taken_seconds: timeTaken,
        test_type: 'practice',
        answers_data: answersArray,
      });
    };
    
    saveResults();
  }, []);
}
```

### 3. Track Study Session
```typescript
function StudyScreen() {
  const { recordSession } = useStudyTime();
  const [startTime, setStartTime] = useState(Date.now());
  
  useEffect(() => {
    return () => {
      // Save session when leaving screen
      const duration = Math.floor((Date.now() - startTime) / 1000);
      recordSession({
        session_date: new Date().toISOString().split('T')[0],
        duration_seconds: duration,
        topic_id: 'history',
        subtopic_id: 'ancient-india',
        activity_type: 'study',
      });
    };
  }, []);
}
```

### 4. Display Recent Activities
```typescript
function ActivityFeed() {
  const { activities, loading } = useRecentActivities(10);
  
  return (
    <ScrollView>
      {activities.map(activity => (
        <ActivityCard
          key={activity.id}
          title={activity.activity_title}
          description={activity.activity_description}
          time={activity.created_at}
        />
      ))}
    </ScrollView>
  );
}
```

### 5. User Settings
```typescript
function SettingsScreen() {
  const { settings, loading, updateSettings } = useUserSettings();
  
  const toggleNotifications = async () => {
    await updateSettings({
      notifications_enabled: !settings?.notifications_enabled,
    });
  };
  
  const changeTheme = async (theme: 'light' | 'dark' | 'auto') => {
    await updateSettings({ theme });
  };
}
```

---

## 🚀 Setup Instructions

### 1. Run the migration SQL in Supabase

**Option A: Supabase Dashboard**
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy the content of `lib/migration/user-progress-tables.sql`
4. Execute the SQL

**Option B: Supabase CLI**
```bash
supabase db reset
```

### 2. Update existing handle-user.sql
Make sure your `lib/migration/handle-user.sql` includes the initialization trigger that creates default records for new users.

### 3. Test the setup
```typescript
// Test in your app
const { stats } = useUserDashboard();
console.log('Dashboard stats:', stats);
```

---

## 📈 Dashboard Metrics Explained

### 1. **Current Streak**
- Counts consecutive days user has studied
- Resets if user misses a day
- Updated automatically on any study activity

### 2. **Topics Mastered**
- Count of subtopics where user has attempted questions
- A subtopic is "mastered" when user completes any test on it

### 3. **Total Study Time**
- Sum of all study session durations
- Includes study, test, and practice time
- Displayed in hours and minutes

### 4. **Total Tests Taken**
- Count of all completed tests
- Includes practice, mock, and chapter tests

### 5. **Overall Practice Score**
- Average percentage score across all practice tests
- Excludes mock and chapter tests
- Updated with each new practice test

---

## 🔒 Security (RLS Policies)

All tables have Row Level Security (RLS) enabled:
- Users can only view/insert/update their own data
- No user can access another user's progress
- Admin access requires database-level permissions

---

## 💡 Tips & Best Practices

1. **Always update streak**: Call the appropriate function when user completes any study activity
2. **Save test results immediately**: Don't wait - save as soon as test is completed
3. **Record study time**: Track time for better analytics
4. **Use activities feed**: Keep users engaged with their progress
5. **Respect privacy settings**: Check user preferences before displaying public data

---

## 🐛 Troubleshooting

### Streak not updating?
- Check if `update_user_streak()` is being called
- Verify user_id is correct
- Check last_study_date in database

### Stats not showing?
- Ensure user has completed at least one activity
- Check if RLS policies are working correctly
- Verify user is authenticated

### Test records not saving?
- Check all required fields are provided
- Verify subtopic_id exists
- Check for database errors in console

---

## 📝 Future Enhancements

Potential features to add:
- Weekly/monthly progress reports
- Achievement badges system
- Leaderboards (opt-in)
- Study goals and reminders
- Performance analytics by topic
- Spaced repetition tracking
