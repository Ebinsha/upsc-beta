import { supabase } from '@/lib/supabase';
import {
    InsertUserActivity,
    InsertUserStudySession,
    InsertUserTestRecord,
    InsertUserTopicMastery,
    UpdateUserSettings,
    UserDashboardStats,
} from '@/types/database';

// ============================================
// STREAK FUNCTIONS
// ============================================

export async function updateStreak(userId: string) {
  const { error } = await supabase.rpc('update_user_streak', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
}

export async function getUserStreak(userId: string) {
  const { data, error } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching streak:', error);
    throw error;
  }

  return data;
}

// ============================================
// TOPIC MASTERY FUNCTIONS
// ============================================

export async function updateTopicMastery(
  userId: string,
  topicId: string,
  subtopicId: string,
  correctAnswers: number,
  totalQuestions: number
) {
  // Check if record exists
  const { data: existing } = await supabase
    .from('user_topic_mastery')
    .select('*')
    .eq('user_id', userId)
    .eq('subtopic_id', subtopicId)
    .single();

  const masteryData: Partial<InsertUserTopicMastery> = {
    user_id: userId,
    topic_id: topicId,
    subtopic_id: subtopicId,
    questions_attempted: (existing?.questions_attempted || 0) + totalQuestions,
    questions_correct: (existing?.questions_correct || 0) + correctAnswers,
    last_practiced_at: new Date().toISOString(),
  };

  // Mark as completed if user has attempted questions
  if (!existing?.is_completed && totalQuestions > 0) {
    masteryData.is_completed = true;
    masteryData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('user_topic_mastery')
    .upsert(masteryData, {
      onConflict: 'user_id,subtopic_id',
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating topic mastery:', error);
    throw error;
  }

  return data;
}

export async function getUserTopicMastery(userId: string, subtopicId?: string) {
  let query = supabase
    .from('user_topic_mastery')
    .select('*')
    .eq('user_id', userId);

  if (subtopicId) {
    query = query.eq('subtopic_id', subtopicId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching topic mastery:', error);
    throw error;
  }

  return data;
}

export async function getTopicsMasteredCount(userId: string) {
  const { count, error } = await supabase
    .from('user_topic_mastery')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_completed', true);

  if (error) {
    console.error('Error fetching topics mastered count:', error);
    throw error;
  }

  return count || 0;
}

// ============================================
// STUDY SESSION FUNCTIONS
// ============================================

export async function recordStudySession(sessionData: InsertUserStudySession) {
  const { data, error } = await supabase
    .from('user_study_sessions')
    .insert(sessionData)
    .select()
    .single();

  if (error) {
    console.error('Error recording study session:', error);
    throw error;
  }

  // Update streak
  await updateStreak(sessionData.user_id);

  return data;
}

export async function getTotalStudyTime(userId: string) {
  const { data, error } = await supabase.rpc('get_total_study_time', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Error fetching total study time:', error);
    throw error;
  }

  return data as number;
}

export async function getRecentStudySessions(userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('user_study_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching study sessions:', error);
    throw error;
  }

  return data;
}

// ============================================
// TEST RECORD FUNCTIONS
// ============================================

export async function saveTestRecord(testData: InsertUserTestRecord) {
  const { data, error } = await supabase
    .from('user_test_records')
    .insert(testData)
    .select()
    .single();

  if (error) {
    console.error('Error saving test record:', error);
    throw error;
  }

  // Update topic mastery
  await updateTopicMastery(
    testData.user_id,
    testData.topic_id || '',
    testData.subtopic_id,
    testData.correct_answers,
    testData.total_questions
  );

  // Record study session
  await recordStudySession({
    user_id: testData.user_id,
    session_date: new Date().toISOString().split('T')[0],
    duration_seconds: testData.time_taken_seconds,
    topic_id: testData.topic_id,
    subtopic_id: testData.subtopic_id,
    activity_type: 'test',
  });

  // Add activity
  await addActivity({
    user_id: testData.user_id,
    activity_type: 'test_completed',
    activity_title: `Completed ${testData.test_title}`,
    activity_description: `Scored ${Math.round((testData.correct_answers / testData.total_questions) * 100)}%`,
    metadata: {
      test_id: data.id,
      score: testData.correct_answers,
      total: testData.total_questions,
    },
  });

  return data;
}

export async function getUserTestRecords(userId: string, limit?: number) {
  let query = supabase
    .from('user_test_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching test records:', error);
    throw error;
  }

  return data;
}

export async function getOverallPracticeScore(userId: string) {
  const { data, error } = await supabase.rpc('get_overall_practice_score', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Error fetching practice score:', error);
    throw error;
  }

  return data as number;
}

export async function getSubtopicTestHistory(userId: string, subtopicId: string) {
  const { data, error } = await supabase
    .from('user_test_records')
    .select('*')
    .eq('user_id', userId)
    .eq('subtopic_id', subtopicId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching subtopic test history:', error);
    throw error;
  }

  return data;
}

// ============================================
// ACTIVITY FUNCTIONS
// ============================================

export async function addActivity(activityData: InsertUserActivity) {
  const { data, error } = await supabase
    .from('user_activities')
    .insert(activityData)
    .select()
    .single();

  if (error) {
    console.error('Error adding activity:', error);
    throw error;
  }

  return data;
}

export async function getRecentActivities(userId: string, limit: number = 20) {
  const { data, error } = await supabase
    .from('user_activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }

  return data;
}

// ============================================
// SETTINGS FUNCTIONS
// ============================================

export async function getUserSettings(userId: string) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching settings:', error);
    throw error;
  }

  return data;
}

export async function updateUserSettings(userId: string, settings: UpdateUserSettings) {
  const { data, error } = await supabase
    .from('user_settings')
    .update(settings)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating settings:', error);
    throw error;
  }

  return data;
}

// ============================================
// DASHBOARD FUNCTIONS
// ============================================

export async function getDashboardStats(userId: string): Promise<UserDashboardStats | null> {
  const { data, error } = await supabase
    .from('user_dashboard_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }

  return data;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function formatStudyTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
  });
}
