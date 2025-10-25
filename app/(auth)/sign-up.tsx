import { Link } from 'expo-router';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthOperations } from '../../hooks/useAuthOperations';
import { supabase } from '../../lib/supabase';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const { session, user } = useAuth();
  const { handleSignUp, isLoading } = useAuthOperations();

  // Log session whenever it changes
  useEffect(() => {
    console.log('=== Sign Up Page Session Update ===');
    console.log('Session:', session);
    console.log('User:', user);
    console.log('==================================');
  }, [session, user]);

  const handleEmailSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Error', 'Please agree to our Terms of Service and Privacy Policy');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    // Pass fullName to the hook
    await handleSignUp(email, password, confirmPassword, fullName);
  };

  const handleGoogleSignUp = async () => {
    try {
      console.log('Starting Google OAuth sign up...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'graspai://auth/callback',
        },
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Google OAuth initiated successfully');
    } catch (error: any) {
      console.error('Google sign up error:', error);
      Alert.alert('Error', error.message || 'Google sign up failed');
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
          <View className="items-center mt-8 mb-8">
            <View className="w-32 h-32 items-center justify-center mb-4">
                  <Image 
                            source={require('../../assets/images/logo-white.png')} 
                            style={{ width: 128, height: 128 }} 
                            resizeMode="contain"
                    />
              </View>
            <Text className="text-3xl font-bold text-gray-800 mb-2">Create Account</Text>
            <Text className="text-gray-600 text-center">
              Join SmartGuru AI and start your AI-powered learning journey
            </Text>
          </View>

          {/* Sign Up Form */}
          <View className="space-y-4 mb-6">
            {/* Full Name Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                <User size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-3 text-gray-700"
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

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
                  placeholder="Create a password"
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

            {/* Confirm Password Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">Confirm Password</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                <Lock size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 ml-3 text-gray-700"
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Terms and Conditions */}
          <TouchableOpacity 
            className="flex-row items-start mb-6"
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            activeOpacity={0.7}
          >
            <View className={`w-5 h-5 border-2 rounded mr-3 mt-0.5 items-center justify-center ${agreedToTerms ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
              {agreedToTerms && <Text className="text-white font-bold text-xs">✓</Text>}
            </View>
            <Text className="flex-1 text-gray-600 text-sm leading-5">
              By creating an account, you agree to our{' '}
              <Text 
                className="text-blue-600 font-semibold"
                onPress={() => Linking.openURL('https://sites.google.com/view/graspai-policy/terms-conditions')}
              >
                Terms of Service
              </Text>
              {' '}and{' '}
              <Text 
                className="text-blue-600 font-semibold"
                onPress={() => Linking.openURL('https://sites.google.com/view/graspai-policy/privacy-policy')}
              >
                Privacy Policy
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            className={`bg-blue-500 py-4 rounded-xl shadow-lg mb-4 ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleEmailSignUp}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Google Sign Up */}
          <TouchableOpacity
            className="flex-row items-center justify-center bg-white border border-gray-300 py-4 rounded-xl shadow-sm mb-8"
            onPress={handleGoogleSignUp}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/images/google.png')}
              style={{ width: 20, height: 20, marginRight: 12 }}
              resizeMode="contain"
            />
            <Text className="text-gray-700 font-semibold">Continue with Google</Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center mb-8">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}