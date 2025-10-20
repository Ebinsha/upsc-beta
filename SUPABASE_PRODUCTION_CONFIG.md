# Supabase Production Configuration Guide

## Current Issues Fixed
1. ✅ Google OAuth redirect now properly handles session
2. ✅ Sign-in page checks for existing session and auto-redirects
3. ✅ Removed unnecessary success alerts
4. ✅ Improved callback handling with better token parsing

## Supabase Dashboard Configuration

### For Development (Current Setup)
Navigate to your Supabase project dashboard:

#### 1. Authentication Settings
Go to **Authentication → URL Configuration**

**Site URL:**
- Development: `exp://192.168.29.x:8081` (Replace x with your actual IP)
- Alternative: `http://localhost:8081`
- Production: `https://graspai.in` or `https://www.graspai.in`

**Redirect URLs (Add all of these):**
```
graspai://auth/callback
exp://192.168.29.x:8081/--/auth/callback
http://localhost:8081/auth/callback
exp://localhost:19000/--/auth/callback
https://graspai.in/auth/callback
https://www.graspai.in/auth/callback
```

**Note:** Replace `x` in `192.168.29.x` with your actual IP address (visible in your Expo dev server terminal)

#### 2. Google OAuth Provider Settings
Go to **Authentication → Providers → Google**

Ensure you have:
- ✅ Google OAuth enabled
- ✅ Client ID configured
- ✅ Client Secret configured
- ✅ Authorized redirect URIs in Google Cloud Console

### Google Cloud Console Configuration

#### Add Authorized Redirect URIs:
In Google Cloud Console → APIs & Services → Credentials → Your OAuth 2.0 Client

Add these URIs:
```
https://[your-project-ref].supabase.co/auth/v1/callback
graspai://auth/callback
http://localhost:8081/auth/callback
https://graspai.in/auth/callback
https://www.graspai.in/auth/callback
```

Replace `[your-project-ref]` with your actual Supabase project reference.

## Production Deployment Checklist

### 1. Domain Setup (graspai.in)
Since your domain is available but not connected:

**Option A: Deploy to Vercel/Netlify (Recommended for web)**
1. Connect your domain to Vercel/Netlify
2. Deploy a simple landing page or web version of your app
3. Update Supabase Site URL to `https://graspai.in`

**Option B: Use Expo's hosting**
1. Run `eas build` for production builds
2. Keep using the custom scheme for mobile
3. Use domain for marketing/landing page

### 2. Update Environment Variables
Create a `.env.production` file:
```env
EXPO_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Update Supabase Settings
In Supabase Dashboard:

**Site URL:** Change to `https://graspai.in`

**Redirect URLs:** Add production URLs
```
https://graspai.in/auth/callback
https://www.graspai.in/auth/callback
graspai://auth/callback
```

### 4. Update app.json for Production
```json
{
  "expo": {
    "name": "GraspAI",
    "slug": "graspai",
    "scheme": "graspai",
    // Add these for production
    "androidStatusBar": {
      "backgroundColor": "#ffffff"
    },
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

### 5. Build Production APK/AAB
```bash
# Install EAS CLI if not already installed
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS (if needed)
eas build --platform ios --profile production
```

## Testing OAuth Flow

### Development Testing:
1. Run `npx expo start --clear`
2. Press 'a' for Android or 'i' for iOS
3. Test Google sign-in
4. Check that you're redirected to dashboard
5. Close app and reopen - should stay logged in

### Production Testing:
1. Install production build on device
2. Test OAuth flow
3. Verify redirect to dashboard works
4. Test session persistence

## Troubleshooting

### Issue: OAuth redirects to sign-in page instead of dashboard
**Solution:** 
- ✅ Fixed in callback.tsx - now properly handles tokens
- ✅ Fixed in sign-in.tsx - checks for existing session
- Clear app data and test again

### Issue: "Invalid redirect URL" error
**Solution:**
- Verify all redirect URLs are added to Supabase
- Check Google Cloud Console authorized URIs
- Ensure scheme matches app.json (graspai://)

### Issue: Session not persisting
**Solution:**
- AsyncStorage is properly configured
- Auth state change listener is active
- Check AuthContext for proper session handling

## Security Best Practices

1. **Never commit secrets:**
   - Add `.env*` to `.gitignore`
   - Use EAS Secrets for production

2. **Use PKCE flow:**
   - ✅ Already configured in supabase.ts
   - More secure than implicit flow

3. **Row Level Security:**
   - Ensure RLS is enabled on all tables
   - Test policies before production

4. **Rate Limiting:**
   - Configure in Supabase dashboard
   - Protect against abuse

## Next Steps

1. ✅ Test current OAuth fixes in development
2. Set up domain connection (graspai.in)
3. Configure EAS for production builds
4. Update Supabase URLs for production
5. Test production build thoroughly
6. Submit to Play Store/App Store

## Support Resources

- [Expo OAuth Guide](https://docs.expo.dev/guides/authentication/)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
