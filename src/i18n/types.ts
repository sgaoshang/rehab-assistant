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
    showAll: string;
    hideCompleted: string;
    allCompletedToday: string;
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
    completed: string;
    notCompleted: string;
    markCompleted: string;
    markIncomplete: string;
    completionStats: string;
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
    choosePreset: string;
    projectInfo: string;
    projectName: string;
    projectNamePlaceholder: string;
    projectNameRequired: string;
    projectNameHint: string;
    projectDescription: string;
    projectDescriptionPlaceholder: string;
    projectDescriptionHint: string;
    reminderTime: string;
    reminderTimeRequired: string;
    reminderTimeHint: string;
    selectedCount: string;
    quickTimes: string;
    templates: string;
    customTime: string;
    saveProject: string;
    success: string;
    projectAdded: string;
    projectUpdated: string;
    error: string;
    addFailed: string;
    updateFailed: string;
    nameRequired: string;
    nameTooLong: string;
    descriptionTooLong: string;
    timeRequired: string;
    morning: string;
    midMorning: string;
    noon: string;
    afternoon: string;
    evening: string;
    night: string;
    beforeBed: string;
    threeDailyMorningNoonEvening: string;
    threeDailyBeforeMeals: string;
    threeDailyAfterMeals: string;
    twiceDailyMorningEvening: string;
    onceDailyMorning: string;
    onceDailyEvening: string;
  };
  manageProjects: {
    title: string;
    noProjects: string;
    edit: string;
    confirmDelete: string;
    confirmDeleteMessage: string;
    deleteSuccess: string;
    projectDeleted: string;
    deleteFailed: string;
  };
  notifications: {
    title: string;
    body: string;
  };
}

export type TranslationFunction = (key: string, params?: Record<string, any>) => string;
