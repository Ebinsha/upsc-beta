import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { Link, useRouter } from 'expo-router';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthOperations } from '../../hooks/useAuthOperations';
import { supabase } from '../../lib/supabase';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { session, user, loading } = useAuth();
  const { handleSignIn, isLoading } = useAuthOperations();
  const router = useRouter();

  // Configure Google Sign-In
  useEffect(() => {
    const configureGoogleSignIn = async () => {
      try {
        await GoogleSignin.configure({
          webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // From your Google Cloud Console
        });
        console.log('Google Sign-In configured successfully');
      } catch (error) {
        console.error('Error configuring Google Sign-In:', error);
      }
    };
    
    configureGoogleSignIn();
  }, []);

  // Check for existing session and redirect to dashboard
  useEffect(() => {
    if (!loading && session && user) {
      console.log('=== Active session found on sign-in page ===');
      console.log('User:', user.email);
      console.log('Redirecting to dashboard...');
      router.replace('/(tabs)');
    }
  }, [session, user, loading, router]);

  const handleEmailSignIn = async () => {
    await handleSignIn(email, password);
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google Sign-In...');
      
      // Check if GoogleSignin is available
      if (!GoogleSignin || typeof GoogleSignin.configure !== 'function') {
        console.log('Native Google Sign-In not available, falling back to OAuth');
        // Fallback to Supabase OAuth
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'graspai://auth/callback',
          },
        });
        
        if (error) {
          throw error;
        }
        
        console.log('OAuth initiated, check for session updates');
        return;
      }
      
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();
      
      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In successful:', userInfo.data?.user);

      // Check if we have the ID token
      if (userInfo.data?.idToken) {
        console.log('ID Token received, signing in with Supabase...');
        
        // Sign in to Supabase with the Google ID token
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.data.idToken,
        });

        if (error) {
          console.error('Supabase auth error:', error);
          throw error;
        }

        console.log('Supabase auth successful:', data.user?.email);
        router.replace('/(tabs)');
      } else {
        throw new Error('No ID token received from Google');
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled Google sign in');
            break;
          case statusCodes.IN_PROGRESS:
            Alert.alert('Error', 'Google sign in is already in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Error', 'Google Play Services not available or outdated');
            break;
          default:
            Alert.alert('Error', `Google sign in failed: ${error.message}`);
        }
      } else {
        Alert.alert('Error', error.message || 'Google sign in failed. Note: This requires a development build with native modules.');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="items-center mt-12 mb-8">
            <View className="w-32 h-32 items-center justify-center mb-4">
              <Image 
                source={require('../../assets/images/logo-white.png')} 
                style={{ width: 128, height: 128 }} 
                resizeMode="contain"
              />
            </View>
            <Text className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</Text>
            <Text className="text-gray-600 text-center">
              Sign in to continue your smart learning journey
            </Text>
          </View>

          {/* Sign In Form */}
          <View className="space-y-4 mb-6">
            {/* Email Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Email</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                <Mail size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-3 text-gray-700"
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                <Lock size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-3 text-gray-700"
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="self-end">
              <Text className="text-blue-600 font-medium">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            className={`bg-blue-500 py-4 rounded-xl shadow-lg mb-4 ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleEmailSignIn}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google Sign In */}
          <TouchableOpacity
            className="flex-row items-center justify-center bg-white border border-gray-300 py-4 rounded-xl shadow-sm mb-8"
            onPress={handleGoogleSignIn}
            activeOpacity={0.8}
          >
            <Image 
              source={require('../../assets/images/google.png')} 
              style={{ width: 20, height: 20, marginRight: 12 }} 
              resizeMode="contain"
            />
            <Text className="text-gray-700 font-semibold">Continue with Google</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center mb-8">
            <Text className="text-gray-600">Don&apos;t have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}