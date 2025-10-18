# Google OAuth Setup Guide for UPSC Beta App

## ⚠️ Important Note
**Google OAuth does NOT work with Expo Go!** You must create a development build to test OAuth functionality.

## Prerequisites
- Google Cloud Console account
- Supabase project set up
- Expo account

## Step 1: Configure Google Cloud Console

### 1.1 Create OAuth 2.0 Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project or create a new one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**

### 1.2 Configure Consent Screen
1. Go to **OAuth consent screen**
2. Choose **External** user type
3. Fill in required information:
   - App name: UPSC Beta
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
4. Add scopes: `email`, `profile`, `openid`
5. Save and continue

### 1.3 Create Web Application Client
1. Application type: **Web application**
2. Name: UPSC Beta Web
3. Authorized redirect URIs:
   ```
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```
4. Save and copy:
   - Client ID
   - Client Secret

### 1.4 Create iOS Client (if deploying to iOS)
1. Application type: **iOS**
2. Name: UPSC Beta iOS
3. Bundle ID: `com.smartguru.upscbeta`
4. Save Client ID

### 1.5 Create Android Client (if deploying to Android)
1. Application type: **Android**
2. Name: UPSC Beta Android
3. Package name: `com.smartguru.upscbeta`
4. SHA-1 certificate fingerprint: (get from step 2)
5. Save Client ID

## Step 2: Get SHA-1 Certificate (For Android)

### Debug Keystore (Development)
Run this command in your terminal:

**Windows:**
```bash
keytool -list -v -keystore %USERPROFILE%\.android\debug.keystore -alias androiddebugkey -storepass android -keypass android
```

**Mac/Linux:**
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Copy the SHA-1 fingerprint from the output.

### Production Keystore
When you're ready for production, generate a production keystore and get its SHA-1.

## Step 3: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and enable it
4. Enter your credentials:
   - **Client ID**: Paste the Web application Client ID
   - **Client Secret**: Paste the Web application Client Secret
5. Click **Save**

## Step 4: Update Redirect URLs in Supabase

1. Go to **Authentication** → **URL Configuration**
2. Add these redirect URLs:
   ```
   upscbeta://auth/callback
   exp://localhost:8081/--/auth/callback
   ```
3. Save

## Step 5: Build Development Build

Since OAuth doesn't work in Expo Go, you need to create a development build:

### For Android:
```bash
eas build --profile development --platform android
```

### For iOS:
```bash
eas build --profile development --platform ios
```

### Local Build (Alternative):
```bash
npx expo prebuild
npx expo run:android
# or
npx expo run:ios
```

## Step 6: Test OAuth Flow

1. Install the development build on your device
2. Click "Continue with Google"
3. You should see:
   - Browser opens with Google sign-in
   - After signing in, redirects back to your app
   - User is authenticated and navigated to main screen

## Troubleshooting

### Common Issues:

**1. "The WebBrowser's auth session is in an invalid state"**
- This happens when a previous OAuth session wasn't cleaned up
- Solution: We've added `WebBrowser.maybeCompleteAuthSession()` and `WebBrowser.dismissBrowser()` to handle this
- If you still see this, restart the app completely

**2. "OAuth not working in Expo Go"**
- Solution: Create a development build. OAuth cannot work in Expo Go.

**3. "Invalid redirect URI"**
- Check that `upscbeta://auth/callback` is added in both:
  - Google Cloud Console (if using native clients)
  - Supabase redirect URL settings
- Ensure the scheme `upscbeta` matches your app.json

**4. "The browser session was canceled"**
- This is normal if you cancel the OAuth flow
- Try again and complete the sign-in

**5. "Client ID mismatch"**
- Make sure you're using the Web Application Client ID in Supabase
- Not the Android or iOS Client ID

**6. "redirect_uri_mismatch error"**
- Add all these URLs to Google Cloud Console → Authorized redirect URIs:
  ```
  https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
  ```

### Debug Logs

Check console logs for:
```javascript
console.log('Redirect URI:', redirectTo);
console.log('Google OAuth initiated');
console.log('Auth callback params:', params);
```

## Current Implementation

The app now has:
- ✅ Google OAuth button on Sign In page
- ✅ Google OAuth button on Sign Up page  
- ✅ OAuth callback handler at `/auth/callback`
- ✅ Proper redirect URI using app scheme
- ✅ User-friendly error messages

## Files Modified:
1. `app/(auth)/sign-in.tsx` - Google OAuth implementation
2. `app/(auth)/sign-up.tsx` - Google OAuth implementation
3. `app/auth/callback.tsx` - OAuth callback handler (NEW)
4. `lib/supabase.ts` - Supabase client configuration

## Environment Variables Required:
```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Next Steps

1. Create Google Cloud Console project and OAuth credentials
2. Configure Supabase with Google credentials
3. Build development build (not Expo Go!)
4. Test OAuth flow on physical device
5. For production: Create production keystores and update credentials

## Support Resources

- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Expo AuthSession](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
