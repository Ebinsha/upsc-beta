import { Bell, ChevronRight, HelpCircle, LogOut, Settings, User } from 'lucide-react-native';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthOperations } from '../../hooks/useAuthOperations';
import { useUserDashboard } from '../../hooks/useUserProgress';


export default function Profile() {
  const { user, session, loading } = useAuth();
  const { handleSignOut } = useAuthOperations();
  const { stats, loading: statsLoading } = useUserDashboard();

  const menuItems = [
    { 
      icon: Settings, 
      title: 'Settings', 
      subtitle: 'App preferences and configurations',
      onPress: () => Alert.alert('Settings', 'Coming soon!')
    },
    { 
      icon: Bell, 
      title: 'Notifications', 
      subtitle: 'Manage your notifications',
      onPress: () => Alert.alert('Notifications', 'Coming soon!')
    },
    { 
      icon: HelpCircle, 
      title: 'Help & Support', 
      subtitle: 'Get help and contact support',
      onPress: () => Alert.alert('Help & Support', 'Coming soon!')
    },
    { 
      icon: LogOut, 
      title: 'Sign Out', 
      subtitle: 'Sign out of your account',
      onPress: () => {
        Alert.alert(
          'Sign Out',
          'Are you sure you want to sign out?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: handleSignOut }
          ]
        );
      }
    },
  ];

  const profileStats = [
    { label: 'Study Streak', value: `${stats?.current_streak || 0} days` },
    { label: 'Tests Taken', value: `${stats?.total_tests_taken || 0}` },
    { label: 'Avg Score', value: `${Math.round(stats?.overall_practice_score || 0)}%` },
  ];

  // Get user display name and email from session
  const displayName = user?.user_metadata?.full_name || 'User';
  const displayEmail = user?.email || 'No email';
  const userInitials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  if (loading || statsLoading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white pt-16 px-5 pb-5 border-b border-slate-200">
        <Text className="text-3xl font-bold text-slate-800">Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-5">
        <View className="bg-white rounded-3xl p-6 items-center mb-6 shadow-md">
          <View className="mb-4">
            <View className="w-20 h-20 rounded-full bg-blue-500 items-center justify-center">
              {user?.user_metadata?.avatar_url ? (
                <User size={40} color="white" />
              ) : (
                <Text className="text-2xl font-bold text-white">{userInitials}</Text>
              )}
            </View>
          </View>
          <Text className="text-2xl font-bold text-slate-800 mb-1">{displayName}</Text>
          <Text className="text-base text-slate-500 mb-6">{displayEmail}</Text>
          
          <View className="flex-row w-full justify-around">
            {profileStats.map((stat, index) => (
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
              <TouchableOpacity 
                key={index} 
                className="flex-row items-center justify-between px-5 py-4"
                onPress={item.onPress}
              >
                <View className="flex-row items-center flex-1">
                  <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
                    item.title === 'Sign Out' ? 'bg-red-50' : 'bg-slate-50'
                  }`}>
                    <IconComponent 
                      size={20} 
                      color={item.title === 'Sign Out' ? '#ef4444' : '#64748b'} 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-base font-semibold mb-0.5 ${
                      item.title === 'Sign Out' ? 'text-red-600' : 'text-slate-800'
                    }`}>
                      {item.title}
                    </Text>
                    <Text className="text-sm text-slate-500">{item.subtitle}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#94a3b8" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Debug Info (Remove in production) */}
        {__DEV__ && session && (
          <View className="bg-slate-100 rounded-2xl p-4 mt-6">
            <Text className="text-xs font-mono text-slate-600">
              User ID: {user?.id}
            </Text>
            <Text className="text-xs font-mono text-slate-600 mt-1">
              Created: {new Date(user?.created_at || '').toLocaleDateString()}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}