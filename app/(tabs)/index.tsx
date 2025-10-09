import { Award, Clock, Target, TrendingUp, X } from 'lucide-react-native';
import { useState } from 'react';
import { Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const [showCalendar, setShowCalendar] = useState(false);

  const stats = [
    { icon: TrendingUp, title: 'Study Streak', value: '12 days', color: '#10b981' },
    { icon: Target, title: 'Topics Mastered', value: '8/15', color: '#3b82f6' },
    { icon: Clock, title: 'Time Studied', value: '24h 15m', color: '#f59e0b' },
    { icon: Award, title: 'Practice Score', value: '85%', color: '#8b5cf6' },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white pt-16 px-5 pb-5 border-b border-slate-200">
        <Text className="text-3xl font-bold text-slate-800 mb-1">Dashboard</Text>
        <Text className="text-base text-slate-500">Track your learning progress</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap p-5 gap-3">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (stat.title === 'Study Streak') {
                    setShowCalendar(true);
                  }
                }}
                className="bg-white p-5 rounded-2xl items-center shadow-sm"
                style={{ width: (width - 52) / 2 }}
              >
                <View className="w-12 h-12 rounded-full items-center justify-center mb-3" style={{ backgroundColor: `${stat.color}20` }}>
                  <IconComponent size={24} color={stat.color} />
                </View>
                <Text className="text-xl font-bold text-slate-800 mb-1">{stat.value}</Text>
                <Text className="text-sm text-slate-500 text-center">{stat.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="p-5">
          <Text className="text-xl font-bold text-slate-800 mb-4">Recent Activity</Text>
          <View className="bg-white p-4 rounded-xl mb-3 shadow-sm">
            <Text className="text-base text-slate-800 mb-1">Completed Environment practice test</Text>
            <Text className="text-sm text-slate-500">2 hours ago</Text>
          </View>
          <View className="bg-white p-4 rounded-xl shadow-sm">
            <Text className="text-base text-slate-800 mb-1">Studied Economics for 45 minutes</Text>
            <Text className="text-sm text-slate-500">5 hours ago</Text>
          </View>
        </View>
      </ScrollView>

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
            
            {/* Add your calendar component here */}
            <View className="h-80">
              <Text className="text-base text-slate-600">Current Streak: 12 days</Text>
              <Text className="text-base text-slate-600 mt-2">Longest Streak: 15 days</Text>
              {/* You can integrate a calendar library like react-native-calendars here */}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}