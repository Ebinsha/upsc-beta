import { useRecentActivities, useUserDashboard } from '@/hooks/useUserProgress';
import { formatDate } from '@/lib/userProgress';
import { Activity, Award, Book, Clock, Flame, X } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Format seconds to readable time
const formatStudyTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export default function Dashboard() {
  const [showCalendar, setShowCalendar] = useState(false);
  const { stats, loading: statsLoading } = useUserDashboard();
  const { activities, loading: activitiesLoading } = useRecentActivities(5);

  if (statsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white pt-16 px-5 pb-5 border-b border-slate-200">
        <Text className="text-3xl font-bold text-slate-800 mb-1">Dashboard</Text>
        <Text className="text-base text-slate-500">Track your learning progress</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View className="p-5 gap-4">
          {/* Streak Card */}
          <TouchableOpacity
            onPress={() => setShowCalendar(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 shadow-sm"
            style={{ backgroundColor: '#f97316' }}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white/80 text-sm font-medium">Current Streak</Text>
                <Text className="text-white text-4xl font-bold mt-2">
                  {stats?.current_streak || 0}
                </Text>
                <Text className="text-white/90 text-sm mt-1">days in a row 🔥</Text>
              </View>
              <View className="w-20 h-20 rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                <Flame size={40} color="white" />
              </View>
            </View>
            
            {stats?.longest_streak && stats.longest_streak > 0 && (
              <View className="mt-4 pt-4 border-t" style={{ borderTopColor: 'rgba(255, 255, 255, 0.2)' }}>
                <Text className="text-white/80 text-xs">
                  Best Streak: {stats.longest_streak} days
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Stats Row */}
          <View className="flex-row gap-4">
            {/* Topics Mastered */}
            <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
              <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mb-3">
                <Book size={24} color="#3b82f6" />
              </View>
              <Text className="text-3xl font-bold text-slate-800">
                {stats?.topics_mastered || 0}
              </Text>
              <Text className="text-sm text-slate-500 mt-1">Topics Mastered</Text>
            </View>

            {/* Study Time */}
            <View className="flex-1 bg-white rounded-2xl p-5 shadow-sm">
              <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center mb-3">
                <Clock size={24} color="#10b981" />
              </View>
              <Text className="text-3xl font-bold text-slate-800">
                {formatStudyTime(stats?.total_study_time_seconds || 0)}
              </Text>
              <Text className="text-sm text-slate-500 mt-1">Total Time</Text>
            </View>
          </View>

          {/* Practice Score Card */}
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                  <Award size={20} color="#8b5cf6" />
                </View>
                <View>
                  <Text className="text-base font-semibold text-slate-800">Practice Score</Text>
                  <Text className="text-xs text-slate-500">{stats?.total_tests_taken || 0} tests taken</Text>
                </View>
              </View>
              <Text className="text-3xl font-bold text-purple-600">
                {Math.round(stats?.overall_practice_score || 0)}%
              </Text>
            </View>
            
            {/* Progress Bar */}
            <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <View 
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${Math.min(stats?.overall_practice_score || 0, 100)}%` }}
              />
            </View>
          </View>

          {/* Recent Activities */}
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Activity size={20} color="#64748b" />
              <Text className="text-lg font-bold text-slate-800 ml-2">Recent Activity</Text>
            </View>

            {activitiesLoading ? (
              <ActivityIndicator size="small" color="#3b82f6" />
            ) : activities && activities.length > 0 ? (
              <View className="gap-3">
                {activities.map((activity, index) => (
                  <View 
                    key={activity.id}
                    className={`flex-row items-start ${index !== activities.length - 1 ? 'pb-3 border-b border-slate-100' : ''}`}
                  >
                    <View className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3" />
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-slate-800">
                        {activity.activity_title}
                      </Text>
                      {activity.activity_description && (
                        <Text className="text-xs text-slate-600 mt-1">
                          {activity.activity_description}
                        </Text>
                      )}
                      <Text className="text-xs text-slate-400 mt-1">
                        {formatDate(activity.created_at)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className="py-8 items-center">
                <Text className="text-sm text-slate-400">No recent activities</Text>
                <Text className="text-xs text-slate-400 mt-1">
                  Complete a test to see your activity here
                </Text>
              </View>
            )}
          </View>

          {/* Quick Stats Summary */}
          <View className="bg-slate-800 rounded-2xl p-6 shadow-sm mb-5">
            <Text className="text-white text-lg font-bold mb-4">Summary</Text>
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-300 text-sm">Study Streak</Text>
                <Text className="text-white font-semibold">{stats?.current_streak || 0} days</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-300 text-sm">Topics Completed</Text>
                <Text className="text-white font-semibold">{stats?.topics_mastered || 0}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-300 text-sm">Tests Taken</Text>
                <Text className="text-white font-semibold">{stats?.total_tests_taken || 0}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-300 text-sm">Average Score</Text>
                <Text className="text-white font-semibold">
                  {Math.round(stats?.overall_practice_score || 0)}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Streak Detail Modal */}
      <Modal
        visible={showCalendar}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-bold text-slate-800">Study Streak</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View className="py-5">
              <View className="items-center mb-6">
                <View className="w-24 h-24 rounded-full bg-orange-100 items-center justify-center mb-4">
                  <Flame size={48} color="#f97316" />
                </View>
                <Text className="text-4xl font-bold text-slate-800 mb-2">
                  {stats?.current_streak || 0}
                </Text>
                <Text className="text-base text-slate-600">Current Streak</Text>
              </View>

              <View className="bg-slate-50 rounded-2xl p-5 mb-4">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-sm text-slate-600">Longest Streak</Text>
                  <Text className="text-lg font-bold text-slate-800">
                    {stats?.longest_streak || 0} days
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-slate-600">Total Study Days</Text>
                  <Text className="text-lg font-bold text-slate-800">
                    {stats?.current_streak || 0} days
                  </Text>
                </View>
              </View>

              <Text className="text-xs text-center text-slate-500 mt-4">
                Keep studying every day to maintain your streak! 🔥
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}