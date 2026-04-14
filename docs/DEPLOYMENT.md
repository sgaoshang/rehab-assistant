# Deployment Guide - 康复助手 (Rehab Assistant)

This guide covers building and deploying the Rehab Assistant app to iOS and Android platforms using EAS Build.

## Prerequisites

### Required Tools

1. **EAS CLI**: Install globally
```bash
npm install -g eas-cli
```

2. **Expo Account**: Create an account at https://expo.dev

3. **Apple Developer Account** (for iOS):
   - Individual or Organization account ($99/year)
   - Access to App Store Connect

4. **Google Play Developer Account** (for Android):
   - One-time registration fee ($25)
   - Access to Google Play Console

### Login to EAS

```bash
eas login
```

## Build Configuration

The project uses `eas.json` for build configuration with three profiles:

### Development Profile
- For internal testing during development
- Includes development client
- iOS builds can run on simulator

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Preview Profile
- For internal distribution and testing
- Optimized builds without App Store submission
- Android builds as APK for easy distribution

```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

### Production Profile
- For App Store and Google Play submission
- Fully optimized release builds
- Code signing required

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

## iOS Build Setup

### 1. Configure App Store Connect

1. Log in to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app:
   - Bundle ID: `com.rehab.assistant`
   - Name: 康复助手 / Rehab Assistant
   - Primary Language: Chinese (Simplified) or English

### 2. Configure Code Signing

EAS Build can manage certificates automatically:

```bash
eas credentials
```

Or manually:
1. Generate signing certificates in Apple Developer Portal
2. Upload to EAS:
```bash
eas credentials --platform ios
```

### 3. Update eas.json

Update the production iOS section in `eas.json`:

```json
"ios": {
  "resourceClass": "m-medium",
  "bundleIdentifier": "com.rehab.assistant"
}
```

### 4. Build for iOS

```bash
eas build --platform ios --profile production
```

### 5. Submit to App Store

Update submission details in `eas.json`:

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "your-apple-id@example.com",
      "ascAppId": "your-app-store-connect-app-id",
      "appleTeamId": "your-team-id"
    }
  }
}
```

Then submit:

```bash
eas submit --platform ios --profile production
```

## Android Build Setup

### 1. Configure Google Play Console

1. Log in to [Google Play Console](https://play.google.com/console)
2. Create a new app:
   - Package name: `com.rehab.assistant`
   - App name: 康复助手 / Rehab Assistant
   - Default language: Chinese (Simplified) or English

### 2. Generate Keystore

EAS Build can generate and manage keystores automatically:

```bash
eas credentials --platform android
```

### 3. Update app.json

Ensure Android configuration is correct:

```json
"android": {
  "package": "com.rehab.assistant",
  "permissions": [
    "RECEIVE_BOOT_COMPLETED",
    "VIBRATE",
    "SCHEDULE_EXACT_ALARM"
  ]
}
```

### 4. Build for Android

For APK (direct distribution):
```bash
eas build --platform android --profile preview
```

For AAB (Google Play submission):
```bash
eas build --platform android --profile production
```

### 5. Submit to Google Play

1. Create a service account in Google Cloud Console
2. Download the service account key JSON
3. Update `eas.json`:

```json
"submit": {
  "production": {
    "android": {
      "serviceAccountKeyPath": "./google-service-account.json",
      "track": "internal"
    }
  }
}
```

Then submit:

```bash
eas submit --platform android --profile production
```

## Build Profiles Explained

### Development
- **Purpose**: Local development and debugging
- **Distribution**: Internal only
- **Features**: Development client enabled, fast builds
- **iOS**: Simulator builds enabled
- **Android**: Debug builds

### Preview
- **Purpose**: Internal testing and QA
- **Distribution**: Internal testers via TestFlight/Internal Testing
- **Features**: Optimized builds, no store submission
- **iOS**: Ad-hoc or enterprise distribution
- **Android**: APK for direct installation

### Production
- **Purpose**: Public release
- **Distribution**: App Store and Google Play
- **Features**: Fully optimized, code signing required
- **iOS**: App Store distribution
- **Android**: AAB for Play Store

## Environment Variables

For sensitive data, use EAS Secrets:

```bash
# Set a secret
eas secret:create --scope project --name API_KEY --value your-api-key

# List secrets
eas secret:list

# Delete a secret
eas secret:delete --name API_KEY
```

Access in app.json or code:
```javascript
const apiKey = process.env.API_KEY;
```

## Version Management

### Update Version Number

1. Edit `app.json`:
```json
{
  "expo": {
    "version": "1.0.1",
    "ios": {
      "buildNumber": "2"
    },
    "android": {
      "versionCode": 2
    }
  }
}
```

2. Update `package.json`:
```json
{
  "version": "1.0.1"
}
```

### Version Strategy

- **version**: User-facing version (1.0.0, 1.1.0, 2.0.0)
- **buildNumber (iOS)**: Incremental build number (1, 2, 3...)
- **versionCode (Android)**: Incremental version code (1, 2, 3...)

## Testing Builds

### iOS TestFlight

1. Build with production profile
2. Submit to App Store Connect
3. Add internal/external testers in TestFlight
4. Distribute build to testers

### Android Internal Testing

1. Build AAB with production profile
2. Upload to Google Play Console
3. Create internal testing release
4. Add testers by email
5. Share opt-in URL with testers

## Monitoring Builds

### Check Build Status

```bash
# List all builds
eas build:list

# View specific build
eas build:view [build-id]

# Cancel build
eas build:cancel [build-id]
```

### Build Logs

- Available in Expo dashboard: https://expo.dev
- Real-time logs during build process
- Historical logs for completed builds

## Troubleshooting

### Common Build Issues

**Build fails with "Module not found":**
- Ensure all dependencies are in `package.json`
- Run `npm install` to verify locally
- Check for platform-specific dependencies

**iOS code signing errors:**
- Verify Apple Developer account status
- Check certificate expiration
- Run `eas credentials` to regenerate

**Android keystore issues:**
- Don't lose your keystore (backup securely)
- Use EAS managed credentials for safety
- Keep keystore password secure

**Build timeout:**
- Increase resource class in `eas.json`
- Check for large assets that can be optimized
- Review build logs for hanging processes

### Getting Help

- EAS Build documentation: https://docs.expo.dev/build/introduction/
- Expo forums: https://forums.expo.dev/
- GitHub issues: https://github.com/expo/expo/issues

## Best Practices

1. **Version Control**: Always tag releases in git
2. **Testing**: Test preview builds before production
3. **Credentials**: Use EAS managed credentials when possible
4. **Secrets**: Never commit sensitive data to git
5. **Monitoring**: Check build logs for warnings
6. **Backups**: Keep backups of signing credentials
7. **Documentation**: Document custom build configurations
8. **Updates**: Use Expo Updates for OTA updates between app store releases

## Over-the-Air (OTA) Updates

For minor updates without app store submission:

```bash
# Publish update
eas update --branch production --message "Fix minor bug"

# View updates
eas update:list

# Rollback if needed
eas update:rollback
```

Note: OTA updates work for JavaScript/asset changes only, not native code changes.

## Continuous Integration

### GitHub Actions Example

```yaml
name: EAS Build
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npx eas-cli build --platform all --non-interactive --profile production
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

## Support

For deployment issues or questions, contact the development team or refer to the main [README.md](../README.md).
