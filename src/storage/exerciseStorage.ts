import AsyncStorage from '@react-native-async-storage/async-storage';
import { Exercise } from '../types';
import { PRESET_EXERCISES } from '../constants/presetExercises';

const STORAGE_KEY = '@rehab_app:exercises';
const INIT_KEY = '@rehab_app:initialized';

/**
 * 生成 UUID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 初始化预设训练
 */
export const initializePresetExercises = async (): Promise<void> => {
  try {
    const initialized = await AsyncStorage.getItem(INIT_KEY);
    if (initialized === 'true') {
      return;
    }

    const exercises: Exercise[] = PRESET_EXERCISES.map((preset) => ({
      ...preset,
      id: generateId(),
      isEnabled: false,
      reminderTimes: [],
      createdAt: Date.now(),
    }));

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
    await AsyncStorage.setItem(INIT_KEY, 'true');
  } catch (error) {
    console.error('Failed to initialize preset exercises:', error);
    throw error;
  }
};

/**
 * 获取所有训练
 */
export const getExercises = async (): Promise<Exercise[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get exercises:', error);
    return [];
  }
};

/**
 * 保存训练列表
 */
export const saveExercises = async (exercises: Exercise[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
  } catch (error) {
    console.error('Failed to save exercises:', error);
    throw error;
  }
};

/**
 * 添加训练
 */
export const addExercise = async (exercise: Omit<Exercise, 'id' | 'createdAt'>): Promise<Exercise> => {
  try {
    const exercises = await getExercises();
    const newExercise: Exercise = {
      ...exercise,
      id: generateId(),
      createdAt: Date.now(),
    };
    exercises.push(newExercise);
    await saveExercises(exercises);
    return newExercise;
  } catch (error) {
    console.error('Failed to add exercise:', error);
    throw error;
  }
};

/**
 * 更新训练
 */
export const updateExercise = async (id: string, updates: Partial<Exercise>): Promise<void> => {
  try {
    const exercises = await getExercises();
    const index = exercises.findIndex((ex) => ex.id === id);
    if (index !== -1) {
      exercises[index] = { ...exercises[index], ...updates };
      await saveExercises(exercises);
    }
  } catch (error) {
    console.error('Failed to update exercise:', error);
    throw error;
  }
};

/**
 * 删除训练
 */
export const deleteExercise = async (id: string): Promise<void> => {
  try {
    const exercises = await getExercises();
    const filtered = exercises.filter((ex) => ex.id !== id);
    await saveExercises(filtered);
  } catch (error) {
    console.error('Failed to delete exercise:', error);
    throw error;
  }
};

/**
 * 获取启用的训练
 */
export const getEnabledExercises = async (): Promise<Exercise[]> => {
  try {
    const exercises = await getExercises();
    return exercises.filter((ex) => ex.isEnabled);
  } catch (error) {
    console.error('Failed to get enabled exercises:', error);
    return [];
  }
};
