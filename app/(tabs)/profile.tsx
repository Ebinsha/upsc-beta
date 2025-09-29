import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { User, Settings, Bell, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';

export default function Profile() {
  const menuItems = [
    { icon: Settings, title: 'Settings', subtitle: 'App preferences and configurations' },
    { icon: Bell, title: 'Notifications', subtitle: 'Manage your notifications' },
    { icon: HelpCircle, title: 'Help & Support', subtitle: 'Get help and contact support' },
    { icon: LogOut, title: 'Sign Out', subtitle: 'Sign out of your account' },
  ];

  const stats = [
    { label: 'Study Streak', value: '12 days' },
    { label: 'Total Score', value: '2,450' },
    { label: 'Rank', value: '#147' },
  ];

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white pt-16 px-5 pb-5 border-b border-slate-200">
        <Text className="text-3xl font-bold text-slate-800">Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        <View className="bg-white rounded-3xl p-6 items-center mb-6 shadow-md">
          <View className="mb-4">
            <View className="w-20 h-20 rounded-full bg-slate-100 items-center justify-center">
              <User size={40} color="#64748b" />
            </View>
          </View>
          <Text className="text-2xl font-bold text-slate-800 mb-1">John Doe</Text>
          <Text className="text-base text-slate-500 mb-6">john.doe@example.com</Text>
          
          <View className="flex-row w-full justify-around">
            {stats.map((stat, index) => (
              <View key={index} className="items-center">
                <Text className="text-xl font-bold text-slate-800 mb-1">{stat.value}</Text>
                <Text className="text-sm text-slate-500">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-white rounded-2xl py-2 shadow-sm">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity key={index} className="flex-row items-center justify-between px-5 py-4">
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-4">
                    <IconComponent size={20} color="#64748b" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-slate-800 mb-0.5">{item.title}</Text>
                    <Text className="text-sm text-slate-500">{item.subtitle}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#94a3b8" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}