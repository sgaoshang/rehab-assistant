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
  | 'bloodPressureMed'
  | 'diabetesMed'
  | 'vitaminSupplement'
  | 'calciumSupplement'
  | 'checkBloodPressure'
  | 'checkBloodSugar'
  | 'drinkWater'
  | 'afternoonNap';

export const getPresetProjects = (t: TranslationFunction): Array<Omit<Project, 'id' | 'createdAt' | 'isEnabled' | 'reminderTimes'> & { presetId: PresetProjectId }> => [
  // Rehabilitation exercises
  {
    name: t('presets.fistExercise.name'),
    description: t('presets.fistExercise.description'),
    isPreset: true,
    presetId: 'fistExercise',
  },
  {
    name: t('presets.fingerStretch.name'),
    description: t('presets.fingerStretch.description'),
    isPreset: true,
    presetId: 'fingerStretch',
  },
  {
    name: t('presets.armRaise.name'),
    description: t('presets.armRaise.description'),
    isPreset: true,
    presetId: 'armRaise',
  },
  {
    name: t('presets.shoulderRotation.name'),
    description: t('presets.shoulderRotation.description'),
    isPreset: true,
    presetId: 'shoulderRotation',
  },
  {
    name: t('presets.ankleExercise.name'),
    description: t('presets.ankleExercise.description'),
    isPreset: true,
    presetId: 'ankleExercise',
  },
  {
    name: t('presets.kneeFlexion.name'),
    description: t('presets.kneeFlexion.description'),
    isPreset: true,
    presetId: 'kneeFlexion',
  },
  {
    name: t('presets.marchingInPlace.name'),
    description: t('presets.marchingInPlace.description'),
    isPreset: true,
    presetId: 'marchingInPlace',
  },
  {
    name: t('presets.neckRotation.name'),
    description: t('presets.neckRotation.description'),
    isPreset: true,
    presetId: 'neckRotation',
  },
  {
    name: t('presets.deepBreathing.name'),
    description: t('presets.deepBreathing.description'),
    isPreset: true,
    presetId: 'deepBreathing',
  },
  {
    name: t('presets.balanceTraining.name'),
    description: t('presets.balanceTraining.description'),
    isPreset: true,
    presetId: 'balanceTraining',
  },

  // Medication reminders
  {
    name: t('presets.bloodPressureMed.name'),
    description: t('presets.bloodPressureMed.description'),
    isPreset: true,
    presetId: 'bloodPressureMed',
  },
  {
    name: t('presets.diabetesMed.name'),
    description: t('presets.diabetesMed.description'),
    isPreset: true,
    presetId: 'diabetesMed',
  },
  {
    name: t('presets.vitaminSupplement.name'),
    description: t('presets.vitaminSupplement.description'),
    isPreset: true,
    presetId: 'vitaminSupplement',
  },
  {
    name: t('presets.calciumSupplement.name'),
    description: t('presets.calciumSupplement.description'),
    isPreset: true,
    presetId: 'calciumSupplement',
  },

  // Health check reminders
  {
    name: t('presets.checkBloodPressure.name'),
    description: t('presets.checkBloodPressure.description'),
    isPreset: true,
    presetId: 'checkBloodPressure',
  },
  {
    name: t('presets.checkBloodSugar.name'),
    description: t('presets.checkBloodSugar.description'),
    isPreset: true,
    presetId: 'checkBloodSugar',
  },
  {
    name: t('presets.drinkWater.name'),
    description: t('presets.drinkWater.description'),
    isPreset: true,
    presetId: 'drinkWater',
  },
  {
    name: t('presets.afternoonNap.name'),
    description: t('presets.afternoonNap.description'),
    isPreset: true,
    presetId: 'afternoonNap',
  },
];
