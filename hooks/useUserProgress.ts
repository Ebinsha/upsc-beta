import { useAuth } from '@/contexts/AuthContext';
import {
    addActivity,
    getDashboardStats,
    getOverallPracticeScore,
    getRecentActivities,
    getRecentStudySessions,
    getSubtopicTestHistory,
    getTotalStudyTime,
    getUserSettings,
    getUserStreak,
    getUserTestRecords,
    getUserTopicMastery,
    recordStudySession,
    saveTestRecord,
    updateUserSettings,
} from '@/lib/userProgress';
import {
    InsertUserActivity,
    InsertUserStudySession,
    InsertUserTestRecord,
    UpdateUserSettings,
    UserActivity,
    UserDashboardStats,
    UserSettings,
    UserStreak,
    UserStudySession,
    UserTestRecord,
    UserTopicMastery,
} from '@/types/database';
import { useEffect, useState } from 'react';

// ============================================
// DASHBOARD STATS HOOK
// ============================================

export function useUserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats(user.id);
        setStats(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  return { stats, loading, error, refetch: () => user?.id && getDashboardStats(user.id) };
}

// ============================================
// STREAK HOOK
// ============================================

export function useUserStreak() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchStreak = async () => {
      try {
        const data = await getUserStreak(user.id);
        setStreak(data);
      } catch (err) {
        console.error('Error fetching streak:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, [user?.id]);

  return { streak, loading };
}

// ============================================
// TOPIC MASTERY HOOK
// ============================================

export function useTopicMastery(subtopicId?: string) {
  const { user } = useAuth();
  const [mastery, setMastery] = useState<UserTopicMastery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchMastery = async () => {
      try {
        const data = await getUserTopicMastery(user.id, subtopicId);
        setMastery(data || []);
      } catch (err) {
        console.error('Error fetching mastery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMastery();
  }, [user?.id, subtopicId]);

  return { mastery, loading };
}

// ============================================
// STUDY TIME HOOK
// ============================================

export function useStudyTime() {
  const { user } = useAuth();
  const [totalTime, setTotalTime] = useState<number>(0);
  const [sessions, setSessions] = useState<UserStudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [time, recentSessions] = await Promise.all([
          getTotalStudyTime(user.id),
          getRecentStudySessions(user.id, 10),
        ]);
        setTotalTime(time);
        setSessions(recentSessions || []);
      } catch (err) {
        console.error('Error fetching study time:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const recordSession = async (sessionData: Omit<InsertUserStudySession, 'user_id'>) => {
    if (!user?.id) return;
    
    try {
      await recordStudySession({
        ...sessionData,
        user_id: user.id,
      });
      // Refetch data
      const [time, recentSessions] = await Promise.all([
        getTotalStudyTime(user.id),
        getRecentStudySessions(user.id, 10),
      ]);
      setTotalTime(time);
      setSessions(recentSessions || []);
    } catch (err) {
      console.error('Error recording session:', err);
      throw err;
    }
  };

  return { totalTime, sessions, loading, recordSession };
}

// ============================================
// TEST RECORDS HOOK
// ============================================

export function useTestRecords(limit?: number) {
  const { user } = useAuth();
  const [tests, setTests] = useState<UserTestRecord[]>([]);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchTests = async () => {
      try {
        const [testData, score] = await Promise.all([
          getUserTestRecords(user.id, limit),
          getOverallPracticeScore(user.id),
        ]);
        setTests(testData || []);
        setOverallScore(score);
      } catch (err) {
        console.error('Error fetching tests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [user?.id, limit]);

  const saveTest = async (testData: Omit<InsertUserTestRecord, 'user_id'>) => {
    if (!user?.id) return;
    
    try {
      const savedTest = await saveTestRecord({
        ...testData,
        user_id: user.id,
      });
      
      // Refetch data
      const [updatedTests, score] = await Promise.all([
        getUserTestRecords(user.id, limit),
        getOverallPracticeScore(user.id),
      ]);
      setTests(updatedTests || []);
      setOverallScore(score);
      
      return savedTest;
    } catch (err) {
      console.error('Error saving test:', err);
      throw err;
    }
  };

  return { tests, overallScore, loading, saveTest };
}

// ============================================
// SUBTOPIC TEST HISTORY HOOK
// ============================================

export function useSubtopicTestHistory(subtopicId: string) {
  const { user } = useAuth();
  const [history, setHistory] = useState<UserTestRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !subtopicId) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const data = await getSubtopicTestHistory(user.id, subtopicId);
        setHistory(data || []);
      } catch (err) {
        console.error('Error fetching test history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?.id, subtopicId]);

  return { history, loading };
}

// ============================================
// ACTIVITIES HOOK
// ============================================

export function useRecentActivities(limit: number = 20) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        const data = await getRecentActivities(user.id, limit);
        setActivities(data || []);
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user?.id, limit]);

  const addNewActivity = async (activityData: Omit<InsertUserActivity, 'user_id'>) => {
    if (!user?.id) return;
    
    try {
      await addActivity({
        ...activityData,
        user_id: user.id,
      });
      
      // Refetch activities
      const data = await getRecentActivities(user.id, limit);
      setActivities(data || []);
    } catch (err) {
      console.error('Error adding activity:', err);
      throw err;
    }
  };

  return { activities, loading, addNewActivity };
}

// ============================================
// SETTINGS HOOK
// ============================================

export function useUserSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const data = await getUserSettings(user.id);
        setSettings(data);
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user?.id]);

  const updateSettings = async (updates: UpdateUserSettings) => {
    if (!user?.id) return;
    
    try {
      const updated = await updateUserSettings(user.id, updates);
      setSettings(updated);
      return updated;
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  return { settings, loading, updateSettings };
}
