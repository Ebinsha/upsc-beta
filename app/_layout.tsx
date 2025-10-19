import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import './globals.css';


function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to sign-in if user is not authenticated
      router.replace('/(auth)/sign-in');
    } else if (user && inAuthGroup) {
      // Redirect to dashboard if user is authenticated and on auth screens
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, router]);

  const isLoggedIn = !!user;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Auth routes - accessible when NOT logged in */}
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
      
      {/* Protected routes - require authentication */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="subtopics" />
        <Stack.Screen
          name="topic-justify"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="practice-test" />
        <Stack.Screen name="test-results" />
      </Stack.Protected>

      {/* Public routes */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}