# Feature Updates - Practice Tests & Profile

## Summary
This update connects the Practice Tests and Profile pages with real-time database data and adds a difficulty selection feature for practice tests.

## Changes Made

### 1. Tests Page (`app/(tabs)/tests.tsx`)
**Connected with Real Data:**
- ✅ **Completed Tests Card**: Now shows actual count from `user_test_records` table
- ✅ **Average Score Card**: Displays real average score from completed practice tests
- Uses `useTestRecords()` hook to fetch data from Supabase

**New Difficulty Selection Modal:**
- ✅ When user clicks "Start Test", a modal appears with 3 difficulty options:
  - **Medium**: Moderate difficulty questions
  - **Hard**: Challenging advanced questions  
  - **PYQ**: Previous Year Questions
- ✅ Selected difficulty is passed to the practice test page
- ✅ Beautiful UI with color-coded difficulty badges

**Database Integration:**
```typescript
const { tests, overallScore, loading } = useTestRecords();
const completedTests = tests?.length || 0;
const avgScore = Math.round(overallScore || 0);
```

### 2. Profile Page (`app/(tabs)/profile.tsx`)
**Connected with Real Data:**
- ✅ **Study Streak**: Now shows `current_streak` from `user_streaks` table
- ✅ **Tests Taken**: Displays `total_tests_taken` from user dashboard stats
- ✅ **Avg Score**: Shows `overall_practice_score` percentage
- ❌ **Rank**: Removed (not available in current database schema)

**Database Integration:**
```typescript
const { stats, loading: statsLoading } = useUserDashboard();

const profileStats = [
  { label: 'Study Streak', value: `${stats?.current_streak || 0} days` },
  { label: 'Tests Taken', value: `${stats?.total_tests_taken || 0}` },
  { label: 'Avg Score', value: `${Math.round(stats?.overall_practice_score || 0)}%` },
];
```

### 3. Practice Test Page (`app/practice-test.tsx`)
**Difficulty Parameter Support:**
- ✅ Receives `difficulty` parameter from tests page
- ✅ Passes difficulty to API when fetching questions
- ✅ Displays difficulty badge in header with color coding:
  - 🟡 Medium → Amber
  - 🔴 Hard → Red
  - 🟣 PYQ → Purple

**Updated API Call:**
```typescript
const { data: questions, loading, error } = useExamQuestions(
  subtopicId as string,
  difficulty as 'medium' | 'hard' | 'pyq' | undefined
);
```

### 4. API Hook Update (`hooks/useApiData.ts`)
**Enhanced useExamQuestions:**
- ✅ Now accepts optional `difficulty` parameter
- ✅ Includes difficulty in API request body
- ✅ Updates dependencies array to refetch when difficulty changes

```typescript
export function useExamQuestions(
  subtopicId: string, 
  difficulty?: 'medium' | 'hard' | 'pyq'
) {
  // ... sends difficulty to backend
}
```

## Database Tables Used

### `user_test_records`
- Stores all test attempts with scores
- Used for: Completed tests count, average score

### `user_streaks`  
- Tracks daily study consistency
- Used for: Current streak, longest streak

### `user_dashboard_stats` (View)
- Aggregated statistics view
- Used for: Overall dashboard metrics

## User Flow

### Taking a Practice Test:
1. User navigates to **Tests** tab
2. Sees real-time stats: Completed tests & Avg Score
3. Clicks "Start Test" on any test
4. **Difficulty Modal** appears with 3 options
5. User selects difficulty (Medium/Hard/PYQ)
6. Navigates to practice test with selected difficulty
7. Questions are fetched based on difficulty
8. Difficulty badge shows in test header

### Viewing Profile:
1. User navigates to **Profile** tab
2. Sees real-time stats:
   - Study Streak (days)
   - Tests Taken (count)
   - Average Score (percentage)
3. Stats update automatically as user completes tests

## API Requirements

The backend `/exam` endpoint should now accept:
```json
{
  "topic_id": "string",
  "difficulty": "medium" | "hard" | "pyq"  // optional
}
```

## Testing Checklist

- [ ] Tests page shows correct count of completed tests
- [ ] Average score calculates correctly
- [ ] Difficulty modal opens on "Start Test" click
- [ ] Each difficulty option navigates correctly
- [ ] Difficulty badge shows in practice test header
- [ ] Profile shows correct study streak
- [ ] Profile shows correct test count
- [ ] Profile shows correct average score
- [ ] Loading states work properly
- [ ] Empty states handled gracefully (0 tests)

## Future Enhancements

1. **Rank System**: Implement leaderboard and ranking
2. **Test History**: Show detailed history of all tests taken
3. **Difficulty Filtering**: Filter test history by difficulty
4. **Statistics Charts**: Visual charts for progress tracking
5. **Streak Calendar**: Visual calendar showing study days

## Notes

- All changes are backward compatible
- Existing test records work without difficulty field
- If API doesn't support difficulty, it's safely ignored
- Empty database states are handled with fallback values (0, 0%)
