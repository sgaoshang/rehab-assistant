import { Translations } from '../types';

export const en: Translations = {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
  },
  tabs: {
    home: 'Home',
    settings: 'Settings',
  },
  home: {
    greeting: 'Hello! You have {{count}} reminder projects',
    greetingEmpty: 'Welcome to Reminder Assistant!',
    emptyState: 'No reminder projects yet',
    emptyHint: 'Tap "Settings" below to add projects',
  },
  settings: {
    title: 'Project Management',
    addProject: '+ Add Project',
    manageProjects: 'Manage My Projects',
    languageSettings: 'Language Settings',
    language: 'Language',
    developerInfo: 'Developer Info',
    version: 'Reminder Assistant v1.0.0',
  },
  projects: {
    reminderTimes: 'Reminder Times',
    enabled: 'Enabled',
    disabled: 'Disabled',
    rehabilitation: 'Rehabilitation',
    medication: 'Medication',
    healthCheck: 'Health Check',
  },
  presets: {
    fistExercise: {
      name: 'Fist Exercise',
      description: 'Slowly make a fist and release, repeat 10-15 times',
    },
    fingerStretch: {
      name: 'Finger Stretch',
      description: 'Stretch fingers, hold for 5 seconds, repeat 10 times',
    },
    armRaise: {
      name: 'Arm Raise',
      description: 'Slowly raise both arms up, hold for 3 seconds and lower',
    },
    shoulderRotation: {
      name: 'Shoulder Rotation',
      description: 'Rotate shoulders in circles, 5 times clockwise and counterclockwise',
    },
    ankleExercise: {
      name: 'Ankle Exercise',
      description: 'Move ankles up and down, 10 times each side',
    },
    kneeFlexion: {
      name: 'Knee Flexion',
      description: 'Bend and extend knees while seated, repeat 10-15 times',
    },
    marchingInPlace: {
      name: 'Marching in Place',
      description: 'March in place lifting legs, 1-2 minutes each time',
    },
    neckRotation: {
      name: 'Neck Rotation',
      description: 'Slowly rotate head, 5 times each direction',
    },
    deepBreathing: {
      name: 'Deep Breathing',
      description: 'Breathe in deeply for 3 seconds, exhale slowly',
    },
    balanceTraining: {
      name: 'Balance Training',
      description: 'Stand on one leg maintaining balance, 30 seconds each side',
    },
    bloodPressureMed: {
      name: 'Blood Pressure Medicine',
      description: 'Take blood pressure medication as prescribed',
    },
    diabetesMed: {
      name: 'Diabetes Medicine',
      description: 'Take diabetes medication as prescribed',
    },
    vitaminSupplement: {
      name: 'Vitamin Supplement',
      description: 'Take vitamin supplement',
    },
    calciumSupplement: {
      name: 'Calcium Supplement',
      description: 'Take calcium supplement',
    },
    checkBloodPressure: {
      name: 'Check Blood Pressure',
      description: 'Measure and record blood pressure',
    },
    checkBloodSugar: {
      name: 'Check Blood Sugar',
      description: 'Measure and record blood sugar',
    },
    drinkWater: {
      name: 'Drink Water',
      description: 'Drink a glass of water (about 200ml)',
    },
    afternoonNap: {
      name: 'Afternoon Nap',
      description: 'Take a 30-60 minute nap',
    },
  },
  speech: {
    todayProjectsIntro: 'You have {{count}} reminder projects today',
    projectReminder: '{{name}}, reminder times: {{times}}',
    noProjects: 'No reminder projects today',
  },
  addProject: {
    title: 'Add Project',
    selectPreset: 'Select Preset Project',
    customProject: 'Custom Project',
    projectName: 'Project Name',
    projectNamePlaceholder: 'Enter project name',
    projectDescription: 'Project Description',
    projectDescriptionPlaceholder: 'Enter project description',
    addReminderTime: '+ Add Reminder Time',
    selectTime: 'Select Time',
  },
  manageProjects: {
    title: 'Manage Projects',
    noProjects: 'No projects yet',
  },
  notifications: {
    title: 'Reminder',
    body: '{{name}} - Time to do it!',
  },
};
