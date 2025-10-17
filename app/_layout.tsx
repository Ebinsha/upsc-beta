import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../contexts/AuthContext';
import './globals.css';




export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
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
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}