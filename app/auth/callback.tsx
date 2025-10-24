import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    
    const handleCallback = async () => {
      try {
        console.log('=== Auth Callback Started ===');
        
        // Get URL from deep link
        const url = await Linking.getInitialURL();
        console.log('Deep link URL:', url ? 'received' : 'null');
        
        if (url) {
          // Extract hash fragment manually
          const hashMatch = url.match(/#(.+)$/);
          if (hashMatch) {
            const hashString = hashMatch[1];
            console.log('Hash fragment found');
            
            // Parse tokens from hash
            const params = new URLSearchParams(hashString);
            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');
            const error = params.get('error');
           const error_description = params.get('error_description');
             
        if (error) {
          console.log('OAuth error:', error, error_description);
          router.replace('/(auth)/sign-in');
          return;
        }
      
        if (access_token && refresh_token) {
          console.log('Tokens found, setting session...');

              const { error } = await supabase.auth.setSession({
                access_token,
                refresh_token,
              });
              
              if (!error) {
                console.log('Session set successfully!');
                router.replace('/(tabs)');
                return;
              } else {
                console.log('Session error:', error.message);
              }
            }
          }
        }
        
        console.log('No tokens found, redirecting to sign in');
        router.replace('/(auth)/sign-in');
        
      } catch (error) {
        console.log('Callback error:', error);
        router.replace('/(auth)/sign-in');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={{ fontSize: 16, color: '#64748b', marginTop: 16 }}>Completing sign in...</Text>
    </View>
  );
}
