# Get SHA-1 Certificate for Google OAuth Android Setup

## Get Debug SHA-1 (for development):

```powershell
cd android
./gradlew signingReport
```

Look for the SHA-1 under "Variant: debug" → "Config: debug"

Or use keytool directly:

```powershell
keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

## What you need:

1. **Package name**: `com.smartguru.upscbeta`
2. **SHA-1 certificate fingerprint**: Run the command above to get it

## Then in Google Cloud Console:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Application type: **Android**
4. Name: `GraspAI Android`
5. Package name: `com.smartguru.upscbeta`
6. SHA-1: Paste the fingerprint from above
7. Click **Create**

## After creating Android OAuth client:

Copy the **Client ID** and add it to your Supabase configuration:

1. Go to Supabase Dashboard → Authentication → Providers → Google
2. Under "Android client ID", paste the Android OAuth Client ID
3. Save

This will allow Google to recognize your Android app and show the authentication page instead of immediately returning.

------------------------------------------------


EAS builds use their own signing certificates
The SHA1 from EAS is what Google will see when your app runs
This will work for both development and production EAS builds IF you're using the same keystore
When Moving to Production:
You'll need to handle TWO scenarios:

Scenario 1: Continuing with EAS Builds (Recommended)
If you keep using EAS for production builds:

✅ Keep the same SHA1 - EAS uses consistent signing
✅ No changes needed to Google OAuth config
Just ensure you're using the same EAS project/credentials
Scenario 2: Publishing to Google Play Store
When you submit to Play Store, Google re-signs your app:

Get the Play Store SHA1:

Go to Google Play Console → Your App → Release → Setup → App Integrity
Copy the App signing certificate SHA-1
Add it to Google Cloud Console:

Create a second Android OAuth Client with:
Same package: com.smartguru.upscbeta
Play Store SHA-1 (not EAS SHA-1)
Or add the Play Store SHA-1 to your existing Android OAuth client
Add the new Client ID to Supabase:

You can have multiple Android client IDs in Supabase
Add both: EAS build Client ID + Play Store Client ID
Best Practice Setup:
In Supabase Google Provider config, you should have:

1 Web Client ID (for Supabase backend)
1 Android Client ID (for EAS builds - current)
1 Android Client ID (for Play Store - add when publishing)
Or simpler: Create one Android OAuth client in Google Cloud Console and add both SHA-1 fingerprints to it:

EAS build SHA-1
Play Store SHA-1 (when available)
Then use that single Android Client ID in Supabase.

Quick Answer:
Now: ✅ Use EAS SHA1 - perfect
Production: Add Play Store SHA1 when you publish (you'll get it from Play Console)
This way your OAuth will work in:

✅ EAS development builds
✅ EAS production builds
✅ Play Store releases