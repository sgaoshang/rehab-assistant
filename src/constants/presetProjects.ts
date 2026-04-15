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
  | 'checkBloodPressure'
  | 'checkBloodSugar'
  | 'drinkWater'
  | 'positionChange'
  | 'properPositioning'
  | 'passiveROM'
  | 'limbMassage'
  | 'skinCare'
  | 'swallowingTraining';

export type PresetCategory = 'rehabilitation' | 'medication' | 'healthCheck';

export type RehabilitationStage = 'early' | 'mid' | 'late';

export const getPresetProjects = (t: TranslationFunction): Array<Omit<Project, 'id' | 'createdAt' | 'isEnabled' | 'reminderTimes'> & { presetId: PresetProjectId; category: PresetCategory; suggestedTimes?: string[]; rehabilitationStage?: RehabilitationStage }> => [
  // Rehabilitation exercises - Early stage (Flaccid/Bed stage)
  {
    name: t('presets.positionChange.name'),
    description: t('presets.positionChange.description'),
    isPreset: true,
    presetId: 'positionChange',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    suggestedTimes: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
  },
  {
    name: t('presets.properPositioning.name'),
    description: t('presets.properPositioning.description'),
    isPreset: true,
    presetId: 'properPositioning',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    suggestedTimes: ['08:00', '14:00', '20:00'],
  },
  {
    name: t('presets.passiveROM.name'),
    description: t('presets.passiveROM.description'),
    isPreset: true,
    presetId: 'passiveROM',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    suggestedTimes: ['09:00', '15:00', '21:00'],
  },
  {
    name: t('presets.limbMassage.name'),
    description: t('presets.limbMassage.description'),
    isPreset: true,
    presetId: 'limbMassage',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    suggestedTimes: ['10:00', '16:00'],
  },
  {
    name: t('presets.skinCare.name'),
    description: t('presets.skinCare.description'),
    isPreset: true,
    presetId: 'skinCare',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    suggestedTimes: ['08:00', '20:00'],
  },
  {
    name: t('presets.swallowingTraining.name'),
    description: t('presets.swallowingTraining.description'),
    isPreset: true,
    presetId: 'swallowingTraining',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    suggestedTimes: ['09:00', '15:00'],
  },
  {
    name: t('presets.ankleExercise.name'),
    description: t('presets.ankleExercise.description'),
    isPreset: true,
    presetId: 'ankleExercise',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    suggestedTimes: ['09:00', '14:00', '19:00'],
  },
  {
    name: t('presets.kneeFlexion.name'),
    description: t('presets.kneeFlexion.description'),
    isPreset: true,
    presetId: 'kneeFlexion',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    suggestedTimes: ['09:00', '14:00', '19:00'],
  },
  {
    name: t('presets.deepBreathing.name'),
    description: t('presets.deepBreathing.description'),
    isPreset: true,
    presetId: 'deepBreathing',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    suggestedTimes: ['08:00', '14:00', '20:00'],
  },
  {
    name: t('presets.neckRotation.name'),
    description: t('presets.neckRotation.description'),
    isPreset: true,
    presetId: 'neckRotation',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    suggestedTimes: ['09:00', '15:00', '21:00'],
  },
  {
    name: t('presets.shoulderRotation.name'),
    description: t('presets.shoulderRotation.description'),
    isPreset: true,
    presetId: 'shoulderRotation',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    suggestedTimes: ['09:00', '14:00', '19:00'],
  },

  // Rehabilitation exercises - Mid stage
  {
    name: t('presets.fistExercise.name'),
    description: t('presets.fistExercise.description'),
    isPreset: true,
    presetId: 'fistExercise',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    suggestedTimes: ['10:00', '15:00', '20:00'],
  },
  {
    name: t('presets.fingerStretch.name'),
    description: t('presets.fingerStretch.description'),
    isPreset: true,
    presetId: 'fingerStretch',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    suggestedTimes: ['10:00', '15:00', '20:00'],
  },
  {
    name: t('presets.armRaise.name'),
    description: t('presets.armRaise.description'),
    isPreset: true,
    presetId: 'armRaise',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    suggestedTimes: ['09:00', '14:00', '19:00'],
  },

  // Rehabilitation exercises - Late stage
  {
    name: t('presets.marchingInPlace.name'),
    description: t('presets.marchingInPlace.description'),
    isPreset: true,
    presetId: 'marchingInPlace',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    suggestedTimes: ['10:00', '16:00'],
  },
  {
    name: t('presets.balanceTraining.name'),
    description: t('presets.balanceTraining.description'),
    isPreset: true,
    presetId: 'balanceTraining',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    suggestedTimes: ['10:00', '16:00'],
  },

  // Medication reminders
  {
    name: t('presets.antiplateletMed.name'),
    description: t('presets.antiplateletMed.description'),
    isPreset: true,
    presetId: 'antiplateletMed',
    category: 'medication',
    suggestedTimes: ['07:00'],
  },
  {
    name: t('presets.bloodPressureMed.name'),
    description: t('presets.bloodPressureMed.description'),
    isPreset: true,
    presetId: 'bloodPressureMed',
    category: 'medication',
    suggestedTimes: ['08:00'],
  },
  {
    name: t('presets.lipidLoweringMed.name'),
    description: t('presets.lipidLoweringMed.description'),
    isPreset: true,
    presetId: 'lipidLoweringMed',
    category: 'medication',
    suggestedTimes: ['20:00'],
  },
  {
    name: t('presets.diabetesMed.name'),
    description: t('presets.diabetesMed.description'),
    isPreset: true,
    presetId: 'diabetesMed',
    category: 'medication',
    suggestedTimes: ['07:30', '11:30', '17:30'],
  },

  // Health check reminders
  {
    name: t('presets.checkBloodPressure.name'),
    description: t('presets.checkBloodPressure.description'),
    isPreset: true,
    presetId: 'checkBloodPressure',
    category: 'healthCheck',
    suggestedTimes: ['07:00', '21:00'],
  },
  {
    name: t('presets.checkBloodSugar.name'),
    description: t('presets.checkBloodSugar.description'),
    isPreset: true,
    presetId: 'checkBloodSugar',
    category: 'healthCheck',
    suggestedTimes: ['07:00', '09:30', '14:00', '20:00'],
  },
  {
    name: t('presets.drinkWater.name'),
    description: t('presets.drinkWater.description'),
    isPreset: true,
    presetId: 'drinkWater',
    category: 'healthCheck',
    suggestedTimes: ['08:00', '10:00', '14:00', '16:00', '19:00'],
  },
];
