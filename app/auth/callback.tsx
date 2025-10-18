import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Auth callback params:', params);
        
        // Check if we have an access token or session in the URL params
        if (params.access_token) {
          // Set the session with the access token
          const { data, error } = await supabase.auth.setSession({
            access_token: params.access_token as string,
            refresh_token: params.refresh_token as string,
          });

          if (error) {
            console.error('Error setting session:', error);
            router.replace('/(auth)/sign-in');
            return;
          }

          console.log('Session set successfully:', data);
          router.replace('/(tabs)');
        } else {
          // No token found, redirect to sign in
          console.log('No access token found in callback');
          router.replace('/(auth)/sign-in');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.replace('/(auth)/sign-in');
      }
    };

    handleCallback();
  }, [params]);

  return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="text-base text-slate-600 mt-4">Completing sign in...</Text>
    </View>
  );
}
