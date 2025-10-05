import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import './globals.css';

import { useFrameworkReady } from '@/hooks/useFrameworkReady';



export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="subtopics" />
        <Stack.Screen name="topic-justify" />
        <Stack.Screen name="practice-test" />
        <Stack.Screen name="test-results" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}