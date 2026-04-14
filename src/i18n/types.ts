export type Locale = 'zh' | 'en';

export interface Translations {
  common: {
    confirm: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
  };
  tabs: {
    home: string;
    settings: string;
  };
  home: {
    greeting: string;
    greetingEmpty: string;
    emptyState: string;
    emptyHint: string;
  };
  settings: {
    title: string;
    addProject: string;
    manageProjects: string;
    languageSettings: string;
    language: string;
    developerInfo: string;
    version: string;
  };
  projects: {
    reminderTimes: string;
    enabled: string;
    disabled: string;
    rehabilitation: string;
    medication: string;
    healthCheck: string;
  };
  presets: {
    fistExercise: {
      name: string;
      description: string;
    };
    fingerStretch: {
      name: string;
      description: string;
    };
    armRaise: {
      name: string;
      description: string;
    };
    shoulderRotation: {
      name: string;
      description: string;
    };
    ankleExercise: {
      name: string;
      description: string;
    };
    kneeFlexion: {
      name: string;
      description: string;
    };
    marchingInPlace: {
      name: string;
      description: string;
    };
    neckRotation: {
      name: string;
      description: string;
    };
    deepBreathing: {
      name: string;
      description: string;
    };
    balanceTraining: {
      name: string;
      description: string;
    };
    bloodPressureMed: {
      name: string;
      description: string;
    };
    diabetesMed: {
      name: string;
      description: string;
    };
    vitaminSupplement: {
      name: string;
      description: string;
    };
    calciumSupplement: {
      name: string;
      description: string;
    };
    checkBloodPressure: {
      name: string;
      description: string;
    };
    checkBloodSugar: {
      name: string;
      description: string;
    };
    drinkWater: {
      name: string;
      description: string;
    };
    afternoonNap: {
      name: string;
      description: string;
    };
  };
  speech: {
    todayProjectsIntro: string;
    projectReminder: string;
    noProjects: string;
  };
  addProject: {
    title: string;
    selectPreset: string;
    customProject: string;
    projectName: string;
    projectNamePlaceholder: string;
    projectDescription: string;
    projectDescriptionPlaceholder: string;
    addReminderTime: string;
    selectTime: string;
  };
  manageProjects: {
    title: string;
    noProjects: string;
  };
  notifications: {
    title: string;
    body: string;
  };
}

export type TranslationFunction = (key: string, params?: Record<string, any>) => string;
