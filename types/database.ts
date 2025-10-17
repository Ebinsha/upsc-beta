// Database types for user progress tracking

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_study_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserTopicMastery {
  id: string;
  user_id: string;
  topic_id: string;
  subtopic_id: string;
  is_completed: boolean;
  questions_attempted: number;
  questions_correct: number;
  last_practiced_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserStudySession {
  id: string;
  user_id: string;
  session_date: string;
  duration_seconds: number;
  topic_id: string | null;
  subtopic_id: string | null;
  activity_type: 'study' | 'test' | 'practice';
  created_at: string;
}

export interface UserTestRecord {
  id: string;
  user_id: string;
  test_title: string;
  topic_id: string | null;
  subtopic_id: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  time_taken_seconds: number;
  test_type: 'practice' | 'mock' | 'chapter';
  answers_data: any; // JSON data
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'test_completed' | 'topic_completed' | 'study_session' | 'streak_milestone' | 'achievement';
  activity_title: string;
  activity_description: string | null;
  metadata: any; // JSON data
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  
  // Notification preferences
  notifications_enabled: boolean;
  daily_reminder_enabled: boolean;
  daily_reminder_time: string;
  streak_reminder_enabled: boolean;
  
  // Study preferences
  questions_per_test: number;
  test_timer_enabled: boolean;
  show_explanations_immediately: boolean;
  
  // Display preferences
  theme: 'light' | 'dark' | 'auto';
  language: string;
  
  // Privacy preferences
  show_profile_publicly: boolean;
  show_streak_publicly: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface UserDashboardStats {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  topics_mastered: number;
  total_study_time_seconds: number;
  total_tests_taken: number;
  overall_practice_score: number;
}

// Insert types (without auto-generated fields)
export type InsertUserStreak = Omit<UserStreak, 'id' | 'created_at' | 'updated_at'>;
export type InsertUserTopicMastery = Omit<UserTopicMastery, 'id' | 'created_at' | 'updated_at'>;
export type InsertUserStudySession = Omit<UserStudySession, 'id' | 'created_at'>;
export type InsertUserTestRecord = Omit<UserTestRecord, 'id' | 'score_percentage' | 'created_at'>;
export type InsertUserActivity = Omit<UserActivity, 'id' | 'created_at'>;
export type InsertUserSettings = Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>;

// Update types (partial)
export type UpdateUserStreak = Partial<InsertUserStreak>;
export type UpdateUserTopicMastery = Partial<InsertUserTopicMastery>;
export type UpdateUserSettings = Partial<InsertUserSettings>;
