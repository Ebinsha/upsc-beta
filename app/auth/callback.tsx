import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing
    if (hasProcessed.current) return;
    
    const handleCallback = async () => {
      try {
        console.log('=== Auth Callback Started ===');
        console.log('Callback params:', params);
        
        // Extract the URL if it's coming from OAuth redirect
        const url = (params.url as string) || '';
        console.log('URL param:', url);
        
        // Parse the URL to extract tokens
        let accessToken = params.access_token as string;
        let refreshToken = params.refresh_token as string;
        
        // If tokens are in the URL string, extract them
        if (url && !accessToken) {
          const urlParams = new URLSearchParams(url.split('#')[1] || url.split('?')[1] || '');
          accessToken = urlParams.get('access_token') || '';
          refreshToken = urlParams.get('refresh_token') || '';
        }
        
        console.log('Access token found:', !!accessToken);
        console.log('Refresh token found:', !!refreshToken);
        
        if (accessToken && refreshToken) {
          hasProcessed.current = true;
          
          // Set the session with the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session:', error);
            router.replace('/(auth)/sign-in');
            return;
          }

          console.log('Session set successfully');
          console.log('User:', data.user?.email);
          
          // Wait a bit for the session to be fully established
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Navigate to dashboard
          router.replace('/(tabs)');
        } else {
          // No tokens found, check if we already have a session
          console.log('No tokens in callback, checking existing session...');
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            console.log('Existing session found, redirecting to dashboard');
            router.replace('/(tabs)');
          } else {
            console.log('No session found, redirecting to sign in');
            router.replace('/(auth)/sign-in');
          }
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
