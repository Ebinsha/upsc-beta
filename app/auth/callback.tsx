import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    
    const handleCallback = async () => {
      try {
        console.log('=== Auth Callback Started ===');
        
        // Wait a moment for Supabase to detect the session from URL
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if session was automatically detected
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Session found, user:', session.user?.email);
          router.replace('/(tabs)');
        } else {
          console.log('No session found, redirecting to sign in');
          router.replace('/(auth)/sign-in');
        }
        
        console.log('=== Auth Callback Complete ===');
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/(auth)/sign-in');
      }
    };

    handleCallback();
  }, [params, router]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="text-base text-slate-600 mt-4">Completing sign in...</Text>
    </View>
  );
}
