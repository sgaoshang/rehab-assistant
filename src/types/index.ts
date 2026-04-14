export interface Project {
  id: string;
  name: string;
  description: string;
  isPreset: boolean;
  isEnabled: boolean;
  reminderTimes: string[];
  createdAt: number;
  presetId?: string;  // identifies if created from preset
  completionHistory: string[];  // Array of completion dates in YYYY-MM-DD format
}

export interface Settings {
  notificationPermissionGranted: boolean;
}

export interface AppState {
  projects: Project[];
  settings: Settings;
  initialized: boolean;
}
