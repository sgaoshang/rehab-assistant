export type FeelingType = 'easy' | 'normal' | 'hard' | 'pain';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  isPreset: boolean;
  isEnabled: boolean;
  reminderTimes: string[];
  createdAt: number;
}

export interface CheckIn {
  id: string;
  exerciseId: string;
  exerciseName: string;
  timestamp: number;
  feeling: FeelingType;
  note?: string;
}

export interface Settings {
  enableEarlyReminder: boolean;
  notificationPermissionGranted: boolean;
}

export interface AppState {
  exercises: Exercise[];
  checkins: CheckIn[];
  settings: Settings;
  initialized: boolean;
}
