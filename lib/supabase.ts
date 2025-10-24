import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'implicit',
      },
    });

    // Handle OAuth completion for native platforms
    if (Platform.OS !== 'web') {
      supabaseInstance.auth.onAuthStateChange(async (event, session) => {
        console.log('[Auth Event]', event, '| Session:', !!session);
        
        if (event === 'SIGNED_OUT') {
          WebBrowser.dismissBrowser().catch(() => {});
        }
      });
    }
  }
  return supabaseInstance;
};

// For convenience, export as supabase but use getter
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    const client = getSupabase();
    return client[prop as keyof SupabaseClient];
  },
});


