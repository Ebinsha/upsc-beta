# Question Feedback Implementation

## Overview
Implemented feedback collection feature that allows users to provide feedback (thumbs up/down) for each question during practice tests. The feedback is collected throughout the test and submitted to the API when the test is completed.

## Changes Made

### 1. MCQCard Component (`components/MCQCard.tsx`)
- Added `onFeedback` prop to emit feedback events to parent
- Added `questionId` prop for tracking which question received feedback
- Modified `handleFeedback` function to call parent callback instead of direct API call

**New Props:**
```typescript
onFeedback?: (type: 'up' | 'down') => void;
questionId?: string;
```

### 2. Practice Test Screen (`app/practice-test.tsx`)
- Added `QuestionFeedback` interface to track feedback per question
- Added `feedback` state to store feedback for all questions
- Implemented `handleFeedback` function to update feedback state
- Initialize feedback array when questions are loaded
- Pass feedback data to test results screen via navigation params

**New Interface:**
```typescript
interface QuestionFeedback {
  questionId: string;
  feedback: 'up' | 'down' | null;
}
```

### 3. API Hook (`hooks/useApiData.ts`)
- Added `useQuestionFeedback` hook for submitting feedback to API
- Endpoint: `/question_feedback`
- Method: POST
- Body format:
  ```typescript
  {
    feedback: string,      // 'up' or 'down'
    topic_id: string,      // subtopic ID
    question_id: string    // question ID
  }
  ```

**New Hook:**
```typescript
export function useQuestionFeedback() {
  const { submitFeedback } = useQuestionFeedback();
  
  // Returns: { success: boolean; error?: string }
  await submitFeedback('up', 'subtopic-id', 'question-id');
}
```

### 4. Test Results Screen (`app/test-results.tsx`)
- Added `QuestionFeedback` interface
- Parse `feedbackData` from navigation params
- Added `useQuestionFeedback` hook
- Implemented feedback submission effect that runs after test completion
- Filters out null feedback (only submits answered feedback)
- Uses `Promise.allSettled` for batch submission with error handling
- Logs success/failure counts

## User Flow

1. **During Test:**
   - User sees thumbs up/down buttons on each question
   - Clicking a button updates the feedback state for that question
   - Feedback state is maintained even when navigating between questions

2. **On Test Submission:**
   - All answers and feedback data are passed to results screen
   - Test results are saved to database
   - Feedback is submitted to API in batch

3. **Feedback Submission:**
   - Only feedback that was explicitly provided (not null) is submitted
   - Each feedback is submitted as a separate API call
   - All submissions happen in parallel using `Promise.allSettled`
   - Success/failure is logged to console

## API Endpoint

**Endpoint:** `POST /question_feedback`

**Headers:**
- `Content-Type: application/json`
- `Accept: application/json`
- `X-API-KEY: <your-api-key>`

**Request Body:**
```json
{
  "feedback": "up",           // or "down"
  "topic_id": "subtopic-123",
  "question_id": "question-456"
}
```

**Response:**
- Success: HTTP 200
- Error: HTTP error code with error message

## Error Handling

- Missing API configuration: Returns error message
- Network errors: Logged to console, doesn't block test submission
- Individual feedback failures: Don't affect other feedback submissions
- All feedback submissions tracked and logged

## Testing Checklist

- [ ] Feedback buttons appear on each question
- [ ] Clicking feedback updates the UI state
- [ ] Feedback persists when navigating between questions
- [ ] Test submission includes feedback data
- [ ] API receives correct feedback format
- [ ] Multiple feedback submissions handled correctly
- [ ] Error scenarios handled gracefully
- [ ] Console logs show submission status

## Future Enhancements

- Visual confirmation when feedback is submitted
- Retry mechanism for failed submissions
- Offline support with queue
- Analytics dashboard for feedback trends
- User feedback history
