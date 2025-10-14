import { router } from 'expo-router';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Add your authentication logic here
      // Example: await signInWithEmail(email, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to main app
      router.replace('/(tabs)/study');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      // Add your Google authentication logic here
      // Example: await signInWithGoogle();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to main app
      router.replace('/(tabs)/study');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-8 pb-6">
            {/* Header */}
            <View className="mb-10">
              <Text className="text-4xl font-bold text-slate-900 mb-2">
                Welcome Back
              </Text>
              <Text className="text-base text-slate-500">
                Sign in to continue your UPSC preparation
              </Text>
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </Text>
              <View className="flex-row items-center bg-slate-50 rounded-2xl px-4 py-4 border border-slate-200">
                <Mail size={20} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-base text-slate-900"
                  placeholder="Enter your email"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-slate-700 mb-2">
                Password
              </Text>
              <View className="flex-row items-center bg-slate-50 rounded-2xl px-4 py-4 border border-slate-200">
                <Lock size={20} color="#64748b" />
                <TextInput
                  className="flex-1 ml-3 text-base text-slate-900"
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color="#64748b" />
                  ) : (
                    <Eye size={20} color="#64748b" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity className="self-end mb-6">
              <Text className="text-sm font-semibold text-blue-600">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              className="bg-blue-600 rounded-2xl py-4 mb-4"
              onPress={handleEmailSignIn}
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white text-center text-base font-bold">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-slate-200" />
              <Text className="mx-4 text-sm text-slate-500">OR</Text>
              <View className="flex-1 h-px bg-slate-200" />
            </View>

            {/* Google Sign In Button */}
            <TouchableOpacity
              className="bg-white border-2 border-slate-200 rounded-2xl py-4 mb-6"
              onPress={handleGoogleSignIn}
              disabled={googleLoading}
              style={{
                opacity: googleLoading ? 0.7 : 1,
              }}
            >
              {googleLoading ? (
                <ActivityIndicator color="#3b82f6" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Text className="text-xl mr-2">🔍</Text>
                  <Text className="text-slate-900 text-base font-bold">
                    Continue with Google
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center mt-auto">
              <Text className="text-slate-600 text-sm">
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
                <Text className="text-blue-600 text-sm font-bold">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
