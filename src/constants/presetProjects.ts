import { Project } from '../types';
import { TranslationFunction } from '../i18n/types';

export type PresetProjectId =
  // Medications
  | 'antiplateletMed'
  | 'bloodPressureMed'
  | 'lipidLoweringMed'
  | 'diabetesMed'
  // Health checks
  | 'checkBloodPressure'
  | 'checkBloodSugar'
  | 'drinkWater'
  // Early stage rehabilitation
  | 'positionChange'
  | 'properPositioning'
  | 'passiveROM'
  | 'limbMassage'
  | 'skinCare'
  | 'swallowingTraining'
  | 'ankleExercise'
  | 'kneeFlexion'
  | 'deepBreathing'
  | 'neckRotation'
  | 'shoulderRotation'
  | 'bridgeExercise'
  | 'bedMobility'
  | 'bedToSit'
  | 'passiveTrunkRotation'
  // Mid stage rehabilitation
  | 'fistExercise'
  | 'fingerStretch'
  | 'armRaise'
  | 'sittingBalance'
  | 'trunkControl'
  | 'standingBalance'
  | 'weightShift'
  | 'reachingTraining'
  | 'handEyeCoordination'
  | 'fineMotor'
  | 'sitToStand'
  | 'standingEndurance'
  | 'upperLimbFunction'
  // Late stage rehabilitation
  | 'marchingInPlace'
  | 'balanceTraining'
  | 'gaitTraining'
  | 'stairClimbing'
  | 'squatExercise'
  | 'lateralWalking'
  | 'backwardWalking'
  | 'turningTraining'
  | 'obstacleWalking'
  | 'tandemWalking'
  | 'adlTraining'
  | 'dualTaskTraining';

export type PresetCategory = 'rehabilitation' | 'medication' | 'healthCheck';

export type RehabilitationStage = 'early' | 'mid' | 'late' | 'advanced';

export type FunctionalDomain =
  | 'bedCare'           // 床上护理与体位管理
  | 'passiveROM'        // 被动关节活动
  | 'activeROM'         // 主动关节活动
  | 'strengthening'     // 肌力训练
  | 'balance'           // 平衡与姿势控制
  | 'mobility'          // 移动能力
  | 'upperLimb'         // 上肢功能
  | 'lowerLimb'         // 下肢功能
  | 'handFunction'      // 手部精细功能
  | 'gaitTraining'      // 步态训练
  | 'adl'               // 日常生活活动
  | 'cognitive';        // 认知与双任务

export const getPresetProjects = (t: TranslationFunction): Array<Omit<Project, 'id' | 'createdAt' | 'isEnabled' | 'reminderTimes' | 'completionHistory'> & {
  presetId: PresetProjectId;
  category: PresetCategory;
  suggestedTimes?: string[];
  rehabilitationStage?: RehabilitationStage;
  functionalDomain?: FunctionalDomain;
}> => [
  // ========== 早期康复（软瘫期/床上训练，0-2周）==========

  // 床上护理与体位管理
  {
    name: t('presets.positionChange.name'),
    description: t('presets.positionChange.description'),
    isPreset: true,
    presetId: 'positionChange',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'bedCare',
    suggestedTimes: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
  },
  {
    name: t('presets.properPositioning.name'),
    description: t('presets.properPositioning.description'),
    isPreset: true,
    presetId: 'properPositioning',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'bedCare',
    suggestedTimes: ['08:00', '14:00', '20:00'],
  },
  {
    name: t('presets.skinCare.name'),
    description: t('presets.skinCare.description'),
    isPreset: true,
    presetId: 'skinCare',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'bedCare',
    suggestedTimes: ['08:00', '20:00'],
  },

  // 被动关节活动训练
  {
    name: t('presets.passiveROM.name'),
    description: t('presets.passiveROM.description'),
    isPreset: true,
    presetId: 'passiveROM',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'passiveROM',
    suggestedTimes: ['09:00', '15:00', '21:00'],
  },
  {
    name: t('presets.limbMassage.name'),
    description: t('presets.limbMassage.description'),
    isPreset: true,
    presetId: 'limbMassage',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'passiveROM',
    suggestedTimes: ['10:00', '16:00'],
  },
  {
    name: t('presets.passiveTrunkRotation.name'),
    description: t('presets.passiveTrunkRotation.description'),
    isPreset: true,
    presetId: 'passiveTrunkRotation',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'passiveROM',
    suggestedTimes: ['10:00', '16:00'],
  },

  // 主动关节活动训练（床上）
  {
    name: t('presets.ankleExercise.name'),
    description: t('presets.ankleExercise.description'),
    isPreset: true,
    presetId: 'ankleExercise',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'activeROM',
    suggestedTimes: ['09:00', '14:00', '19:00'],
  },
  {
    name: t('presets.kneeFlexion.name'),
    description: t('presets.kneeFlexion.description'),
    isPreset: true,
    presetId: 'kneeFlexion',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'activeROM',
    suggestedTimes: ['09:00', '14:00', '19:00'],
  },
  {
    name: t('presets.neckRotation.name'),
    description: t('presets.neckRotation.description'),
    isPreset: true,
    presetId: 'neckRotation',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'activeROM',
    suggestedTimes: ['09:00', '15:00', '21:00'],
  },
  {
    name: t('presets.shoulderRotation.name'),
    description: t('presets.shoulderRotation.description'),
    isPreset: true,
    presetId: 'shoulderRotation',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'activeROM',
    suggestedTimes: ['09:00', '14:00', '19:00'],
  },
  {
    name: t('presets.deepBreathing.name'),
    description: t('presets.deepBreathing.description'),
    isPreset: true,
    presetId: 'deepBreathing',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'activeROM',
    suggestedTimes: ['08:00', '14:00', '20:00'],
  },

  // 床上肌力训练
  {
    name: t('presets.bridgeExercise.name'),
    description: t('presets.bridgeExercise.description'),
    isPreset: true,
    presetId: 'bridgeExercise',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'strengthening',
    suggestedTimes: ['10:00', '16:00'],
  },

  // 床上移动能力
  {
    name: t('presets.bedMobility.name'),
    description: t('presets.bedMobility.description'),
    isPreset: true,
    presetId: 'bedMobility',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'mobility',
    suggestedTimes: ['09:00', '15:00'],
  },
  {
    name: t('presets.bedToSit.name'),
    description: t('presets.bedToSit.description'),
    isPreset: true,
    presetId: 'bedToSit',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'mobility',
    suggestedTimes: ['09:00', '14:00', '19:00'],
  },

  // 吞咽与ADL准备
  {
    name: t('presets.swallowingTraining.name'),
    description: t('presets.swallowingTraining.description'),
    isPreset: true,
    presetId: 'swallowingTraining',
    category: 'rehabilitation',
    rehabilitationStage: 'early',
    functionalDomain: 'adl',
    suggestedTimes: ['09:00', '15:00'],
  },

  // ========== 中期康复（痉挛期/坐立训练，2周-3个月）==========

  // 平衡与姿势控制
  {
    name: t('presets.sittingBalance.name'),
    description: t('presets.sittingBalance.description'),
    isPreset: true,
    presetId: 'sittingBalance',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    functionalDomain: 'balance',
    suggestedTimes: ['09:00', '15:00'],
  },
  {
    name: t('presets.trunkControl.name'),
    description: t('presets.trunkControl.description'),
    isPreset: true,
    presetId: 'trunkControl',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    functionalDomain: 'balance',
    suggestedTimes: ['10:00', '16:00'],
  },
  {
    name: t('presets.standingBalance.name'),
    description: t('presets.standingBalance.description'),
    isPreset: true,
    presetId: 'standingBalance',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    functionalDomain: 'balance',
    suggestedTimes: ['10:00', '16:00'],
  },
  {
    name: t('presets.weightShift.name'),
    description: t('presets.weightShift.description'),
    isPreset: true,
    presetId: 'weightShift',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    functionalDomain: 'balance',
    suggestedTimes: ['10:00', '16:00'],
  },

  // 上肢功能训练
  {
    name: t('presets.armRaise.name'),
    description: t('presets.armRaise.description'),
    isPreset: true,
    presetId: 'armRaise',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    functionalDomain: 'upperLimb',
    suggestedTimes: ['09:00', '14:00', '19:00'],
  },
  {
    name: t('presets.reachingTraining.name'),
    description: t('presets.reachingTraining.description'),
    isPreset: true,
    presetId: 'reachingTraining',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    functionalDomain: 'upperLimb',
    suggestedTimes: ['10:00', '15:00', '20:00'],
  },
  {
    name: t('presets.upperLimbFunction.name'),
    description: t('presets.upperLimbFunction.description'),
    isPreset: true,
    presetId: 'upperLimbFunction',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    functionalDomain: 'upperLimb',
    suggestedTimes: ['10:00', '15:00', '20:00'],
  },

  // 手部精细功能训练
  {
    name: t('presets.fistExercise.name'),
    description: t('presets.fistExercise.description'),
    isPreset: true,
    presetId: 'fistExercise',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    functionalDomain: 'handFunction',
    suggestedTimes: ['10:00', '15:00', '20:00'],
  },
  {
    name: t('presets.fingerStretch.name'),
    description: t('presets.fingerStretch.description'),
    isPreset: true,
    presetId: 'fingerStretch',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    functionalDomain: 'handFunction',
    suggestedTimes: ['10:00', '15:00', '20:00'],
  },
  {
    name: t('presets.handEyeCoordination.name'),
    description: t('presets.handEyeCoordination.description'),
    isPreset: true,
    presetId: 'handEyeCoordination',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    functionalDomain: 'handFunction',
    suggestedTimes: ['10:00', '15:00'],
  },
  {
    name: t('presets.fineMotor.name'),
    description: t('presets.fineMotor.description'),
    isPreset: true,
    presetId: 'fineMotor',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    functionalDomain: 'handFunction',
    suggestedTimes: ['10:00', '15:00'],
  },

  // 下肢功能与肌力训练
  {
    name: t('presets.sitToStand.name'),
    description: t('presets.sitToStand.description'),
    isPreset: true,
    presetId: 'sitToStand',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    functionalDomain: 'lowerLimb',
    suggestedTimes: ['09:00', '14:00', '19:00'],
  },
  {
    name: t('presets.standingEndurance.name'),
    description: t('presets.standingEndurance.description'),
    isPreset: true,
    presetId: 'standingEndurance',
    category: 'rehabilitation',
    rehabilitationStage: 'mid',
    functionalDomain: 'lowerLimb',
    suggestedTimes: ['10:00', '16:00'],
  },

  // ========== 后期康复（分离运动期/步行训练，3-6个月）==========

  // 高级平衡训练
  {
    name: t('presets.balanceTraining.name'),
    description: t('presets.balanceTraining.description'),
    isPreset: true,
    presetId: 'balanceTraining',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    functionalDomain: 'balance',
    suggestedTimes: ['10:00', '16:00'],
  },

  // 步态训练
  {
    name: t('presets.marchingInPlace.name'),
    description: t('presets.marchingInPlace.description'),
    isPreset: true,
    presetId: 'marchingInPlace',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    functionalDomain: 'gaitTraining',
    suggestedTimes: ['10:00', '16:00'],
  },
  {
    name: t('presets.gaitTraining.name'),
    description: t('presets.gaitTraining.description'),
    isPreset: true,
    presetId: 'gaitTraining',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    functionalDomain: 'gaitTraining',
    suggestedTimes: ['10:00', '16:00'],
  },
  {
    name: t('presets.lateralWalking.name'),
    description: t('presets.lateralWalking.description'),
    isPreset: true,
    presetId: 'lateralWalking',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    functionalDomain: 'gaitTraining',
    suggestedTimes: ['10:00', '16:00'],
  },
  {
    name: t('presets.backwardWalking.name'),
    description: t('presets.backwardWalking.description'),
    isPreset: true,
    presetId: 'backwardWalking',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    functionalDomain: 'gaitTraining',
    suggestedTimes: ['10:00', '16:00'],
  },
  {
    name: t('presets.turningTraining.name'),
    description: t('presets.turningTraining.description'),
    isPreset: true,
    presetId: 'turningTraining',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    functionalDomain: 'gaitTraining',
    suggestedTimes: ['10:00', '16:00'],
  },
  {
    name: t('presets.obstacleWalking.name'),
    description: t('presets.obstacleWalking.description'),
    isPreset: true,
    presetId: 'obstacleWalking',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    functionalDomain: 'gaitTraining',
    suggestedTimes: ['10:00', '16:00'],
  },
  {
    name: t('presets.tandemWalking.name'),
    description: t('presets.tandemWalking.description'),
    isPreset: true,
    presetId: 'tandemWalking',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    functionalDomain: 'gaitTraining',
    suggestedTimes: ['10:00', '16:00'],
  },
  {
    name: t('presets.stairClimbing.name'),
    description: t('presets.stairClimbing.description'),
    isPreset: true,
    presetId: 'stairClimbing',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    functionalDomain: 'gaitTraining',
    suggestedTimes: ['10:00', '16:00'],
  },

  // 下肢肌力强化
  {
    name: t('presets.squatExercise.name'),
    description: t('presets.squatExercise.description'),
    isPreset: true,
    presetId: 'squatExercise',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    functionalDomain: 'lowerLimb',
    suggestedTimes: ['10:00', '16:00'],
  },

  // 日常生活活动训练
  {
    name: t('presets.adlTraining.name'),
    description: t('presets.adlTraining.description'),
    isPreset: true,
    presetId: 'adlTraining',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    functionalDomain: 'adl',
    suggestedTimes: ['09:00', '15:00'],
  },

  // 认知与双任务训练
  {
    name: t('presets.dualTaskTraining.name'),
    description: t('presets.dualTaskTraining.description'),
    isPreset: true,
    presetId: 'dualTaskTraining',
    category: 'rehabilitation',
    rehabilitationStage: 'late',
    functionalDomain: 'cognitive',
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
