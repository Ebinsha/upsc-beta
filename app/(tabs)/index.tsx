import { View, Text, ScrollView, Dimensions } from 'react-native';
import { TrendingUp, Target, Clock, Award } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function Dashboard() {
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
              <View key={index} className="bg-white p-5 rounded-2xl items-center shadow-sm" style={{ width: (width - 52) / 2 }}>
                <View className="w-12 h-12 rounded-full items-center justify-center mb-3" style={{ backgroundColor: `${stat.color}20` }}>
                  <IconComponent size={24} color={stat.color} />
                </View>
                <Text className="text-xl font-bold text-slate-800 mb-1">{stat.value}</Text>
                <Text className="text-sm text-slate-500 text-center">{stat.title}</Text>
              </View>
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
    </View>
  );
}