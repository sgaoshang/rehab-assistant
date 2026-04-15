import { Project } from '../types';
import { TranslationFunction } from '../i18n/types';

export type PresetProjectId =
  | 'fistExercise'
  | 'fingerStretch'
  | 'armRaise'
  | 'shoulderRotation'
  | 'ankleExercise'
  | 'kneeFlexion'
  | 'marchingInPlace'
  | 'neckRotation'
  | 'deepBreathing'
  | 'balanceTraining'
  | 'antiplateletMed'
  | 'bloodPressureMed'
  | 'lipidLoweringMed'
  | 'diabetesMed'
  | 'vitaminSupplement'
  | 'calciumSupplement'
  | 'checkBloodPressure'
  | 'checkBloodSugar'
  | 'drinkWater'
  | 'afternoonNap';

export type PresetCategory = 'rehabilitation' | 'medication' | 'healthCheck';

export const getPresetProjects = (t: TranslationFunction): Array<Omit<Project, 'id' | 'createdAt' | 'isEnabled' | 'reminderTimes'> & { presetId: PresetProjectId; category: PresetCategory }> => [
  // Rehabilitation exercises
  {
    name: t('presets.fistExercise.name'),
    description: t('presets.fistExercise.description'),
    isPreset: true,
    presetId: 'fistExercise',
    category: 'rehabilitation',
  },
  {
    name: t('presets.fingerStretch.name'),
    description: t('presets.fingerStretch.description'),
    isPreset: true,
    presetId: 'fingerStretch',
    category: 'rehabilitation',
  },
  {
    name: t('presets.armRaise.name'),
    description: t('presets.armRaise.description'),
    isPreset: true,
    presetId: 'armRaise',
    category: 'rehabilitation',
  },
  {
    name: t('presets.shoulderRotation.name'),
    description: t('presets.shoulderRotation.description'),
    isPreset: true,
    presetId: 'shoulderRotation',
    category: 'rehabilitation',
  },
  {
    name: t('presets.ankleExercise.name'),
    description: t('presets.ankleExercise.description'),
    isPreset: true,
    presetId: 'ankleExercise',
    category: 'rehabilitation',
  },
  {
    name: t('presets.kneeFlexion.name'),
    description: t('presets.kneeFlexion.description'),
    isPreset: true,
    presetId: 'kneeFlexion',
    category: 'rehabilitation',
  },
  {
    name: t('presets.marchingInPlace.name'),
    description: t('presets.marchingInPlace.description'),
    isPreset: true,
    presetId: 'marchingInPlace',
    category: 'rehabilitation',
  },
  {
    name: t('presets.neckRotation.name'),
    description: t('presets.neckRotation.description'),
    isPreset: true,
    presetId: 'neckRotation',
    category: 'rehabilitation',
  },
  {
    name: t('presets.deepBreathing.name'),
    description: t('presets.deepBreathing.description'),
    isPreset: true,
    presetId: 'deepBreathing',
    category: 'rehabilitation',
  },
  {
    name: t('presets.balanceTraining.name'),
    description: t('presets.balanceTraining.description'),
    isPreset: true,
    presetId: 'balanceTraining',
    category: 'rehabilitation',
  },

  // Medication reminders
  {
    name: t('presets.antiplateletMed.name'),
    description: t('presets.antiplateletMed.description'),
    isPreset: true,
    presetId: 'antiplateletMed',
    category: 'medication',
  },
  {
    name: t('presets.bloodPressureMed.name'),
    description: t('presets.bloodPressureMed.description'),
    isPreset: true,
    presetId: 'bloodPressureMed',
    category: 'medication',
  },
  {
    name: t('presets.lipidLoweringMed.name'),
    description: t('presets.lipidLoweringMed.description'),
    isPreset: true,
    presetId: 'lipidLoweringMed',
    category: 'medication',
  },
  {
    name: t('presets.diabetesMed.name'),
    description: t('presets.diabetesMed.description'),
    isPreset: true,
    presetId: 'diabetesMed',
    category: 'medication',
  },
  {
    name: t('presets.vitaminSupplement.name'),
    description: t('presets.vitaminSupplement.description'),
    isPreset: true,
    presetId: 'vitaminSupplement',
    category: 'medication',
  },
  {
    name: t('presets.calciumSupplement.name'),
    description: t('presets.calciumSupplement.description'),
    isPreset: true,
    presetId: 'calciumSupplement',
    category: 'medication',
  },

  // Health check reminders
  {
    name: t('presets.checkBloodPressure.name'),
    description: t('presets.checkBloodPressure.description'),
    isPreset: true,
    presetId: 'checkBloodPressure',
    category: 'healthCheck',
  },
  {
    name: t('presets.checkBloodSugar.name'),
    description: t('presets.checkBloodSugar.description'),
    isPreset: true,
    presetId: 'checkBloodSugar',
    category: 'healthCheck',
  },
  {
    name: t('presets.drinkWater.name'),
    description: t('presets.drinkWater.description'),
    isPreset: true,
    presetId: 'drinkWater',
    category: 'healthCheck',
  },
  {
    name: t('presets.afternoonNap.name'),
    description: t('presets.afternoonNap.description'),
    isPreset: true,
    presetId: 'afternoonNap',
    category: 'healthCheck',
  },
];
