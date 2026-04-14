# 康复助手 (Rehab Assistant)

A comprehensive rehabilitation assistant mobile application built with React Native and Expo, designed to help patients manage their recovery exercises and track progress.

## Features

- **Exercise Library**: Browse and search rehabilitation exercises with detailed instructions
- **Personalized Plans**: Create custom recovery plans with scheduled exercises
- **Progress Tracking**: Monitor completion rates and recovery progress over time
- **Reminders**: Set up notifications for exercise sessions
- **Calendar View**: Visualize exercise schedules and history
- **Data Export**: Share progress reports with healthcare providers

## Tech Stack

- **Framework**: React Native with Expo SDK 51
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Storage**: AsyncStorage for local data persistence
- **Notifications**: Expo Notifications
- **Date Handling**: date-fns library
- **UI Components**: React Native Calendars

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app (for testing on physical devices)
- iOS Simulator or Android Emulator (optional)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rehab-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npx tsc --noEmit` - Run TypeScript type checking

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ExerciseCard.tsx
│   ├── ExerciseList.tsx
│   ├── PlanCard.tsx
│   ├── ProgressChart.tsx
│   └── StatCard.tsx
├── constants/        # App configuration and constants
│   ├── Colors.ts
│   ├── Exercises.ts
│   ├── Images.ts
│   ├── Layout.ts
│   └── Styles.ts
├── context/          # React Context providers
│   └── DataContext.tsx
├── navigation/       # Navigation configuration
│   ├── AppNavigator.tsx
│   └── types.ts
├── screens/          # Screen components
│   ├── CalendarScreen.tsx
│   ├── ExerciseDetailScreen.tsx
│   ├── ExerciseLibraryScreen.tsx
│   ├── HomeScreen.tsx
│   ├── PlanDetailScreen.tsx
│   ├── ProgressScreen.tsx
│   └── SettingsScreen.tsx
├── services/         # Business logic and services
│   ├── exerciseService.ts
│   ├── notificationService.ts
│   └── progressService.ts
├── storage/          # Data persistence layer
│   ├── exerciseStorage.ts
│   ├── planStorage.ts
│   ├── progressStorage.ts
│   └── settingsStorage.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── utils/            # Utility functions
│   └── dateUtils.ts
└── App.tsx           # Root component
```

## Usage Guide

### Creating a Recovery Plan

1. Navigate to the Home screen
2. Tap "Create New Plan"
3. Select exercises from the library
4. Set schedule and frequency
5. Save the plan

### Tracking Progress

1. Complete exercises as scheduled
2. Mark exercises as completed in the app
3. View progress charts in the Progress screen
4. Export reports to share with healthcare providers

### Setting Reminders

1. Go to Settings
2. Enable notifications
3. Set reminder times for exercise sessions
4. Grant notification permissions when prompted

### Viewing Exercise Details

1. Browse the Exercise Library
2. Tap on any exercise to view detailed instructions
3. Watch video demonstrations (if available)
4. Add exercises to your recovery plan

## Configuration

### Notifications

The app uses Expo Notifications for reminders. Ensure you have granted notification permissions:

- **iOS**: Permissions are requested on first use
- **Android**: Permissions are requested on first use

### Data Storage

All data is stored locally using AsyncStorage:
- Exercise completion history
- Custom recovery plans
- User preferences
- Progress statistics

## Building for Production

### Using EAS Build

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure your project (see `eas.json`)

3. Build for iOS:
```bash
eas build --platform ios
```

4. Build for Android:
```bash
eas build --platform android
```

See [deployment documentation](./docs/DEPLOYMENT.md) for detailed build instructions.

## Development

### Type Checking

Run TypeScript compiler to check for type errors:
```bash
npx tsc --noEmit
```

### Code Structure

- All components use TypeScript for type safety
- React Context API for state management
- Modular architecture with clear separation of concerns
- Service layer for business logic
- Storage layer for data persistence

## Troubleshooting

### Common Issues

**App won't start:**
- Clear Metro bundler cache: `npx expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**Notifications not working:**
- Ensure notification permissions are granted
- Check device notification settings
- Verify Expo Notifications is properly configured

**Data not persisting:**
- Check AsyncStorage implementation
- Verify storage methods are awaited properly
- Check for storage quota issues

## Support

For issues, questions, or contributions, please contact the development team.

## License

Private - All rights reserved

## Version

1.0.0
