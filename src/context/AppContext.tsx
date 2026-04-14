import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Exercise, CheckIn, Settings } from '../types';
import { getExercises, saveExercises, initializePresetExercises } from '../storage/exerciseStorage';
import { getCheckIns, addCheckIn as addCheckInStorage, hasCheckedInToday } from '../storage/checkinStorage';
import { getSettings, saveSettings } from '../storage/settingsStorage';
import { scheduleExerciseNotifications, cancelExerciseNotifications, rescheduleAllNotifications } from '../services/notificationService';

interface AppContextType {
  state: AppState;
  loading: boolean;
  refreshExercises: () => Promise<void>;
  refreshCheckIns: () => Promise<void>;
  addExercise: (exercise: Omit<Exercise, 'id' | 'createdAt'>) => Promise<void>;
  updateExercise: (id: string, updates: Partial<Exercise>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
  toggleExerciseEnabled: (id: string) => Promise<void>;
  addCheckIn: (checkin: Omit<CheckIn, 'id' | 'timestamp'>) => Promise<void>;
  isCheckedInToday: (exerciseId: string) => boolean;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    exercises: [],
    checkins: [],
    settings: {
      enableEarlyReminder: false,
      notificationPermissionGranted: false,
    },
    initialized: false,
  });
  const [loading, setLoading] = useState(true);

  // 初始化数据
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializePresetExercises();
        const exercises = await getExercises();
        const checkins = await getCheckIns();
        const settings = await getSettings();

        setState({
          exercises,
          checkins,
          settings,
          initialized: true,
        });
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const refreshExercises = async () => {
    const exercises = await getExercises();
    setState((prev) => ({ ...prev, exercises }));
  };

  const refreshCheckIns = async () => {
    const checkins = await getCheckIns();
    setState((prev) => ({ ...prev, checkins }));
  };

  const addExercise = async (exercise: Omit<Exercise, 'id' | 'createdAt'>) => {
    const exercises = [...state.exercises];
    const newExercise: Exercise = {
      ...exercise,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    exercises.push(newExercise);
    await saveExercises(exercises);
    setState((prev) => ({ ...prev, exercises }));

    if (newExercise.isEnabled) {
      await scheduleExerciseNotifications(newExercise);
    }
  };

  const updateExercise = async (id: string, updates: Partial<Exercise>) => {
    const exercises = [...state.exercises];
    const index = exercises.findIndex((ex) => ex.id === id);
    if (index !== -1) {
      const oldExercise = exercises[index];
      exercises[index] = { ...oldExercise, ...updates };
      await saveExercises(exercises);
      setState((prev) => ({ ...prev, exercises }));

      // 重新调度通知
      if (exercises[index].isEnabled) {
        await scheduleExerciseNotifications(exercises[index]);
      } else {
        await cancelExerciseNotifications(id);
      }
    }
  };

  const deleteExercise = async (id: string) => {
    await cancelExerciseNotifications(id);
    const exercises = state.exercises.filter((ex) => ex.id !== id);
    await saveExercises(exercises);
    setState((prev) => ({ ...prev, exercises }));
  };

  const toggleExerciseEnabled = async (id: string) => {
    const exercise = state.exercises.find((ex) => ex.id === id);
    if (exercise) {
      await updateExercise(id, { isEnabled: !exercise.isEnabled });
    }
  };

  const addCheckIn = async (checkin: Omit<CheckIn, 'id' | 'timestamp'>) => {
    const newCheckIn = await addCheckInStorage(checkin);
    setState((prev) => ({
      ...prev,
      checkins: [...prev.checkins, newCheckIn],
    }));
  };

  const isCheckedInToday = (exerciseId: string): boolean => {
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayEnd = new Date().setHours(23, 59, 59, 999);
    return state.checkins.some(
      (c) => c.exerciseId === exerciseId && c.timestamp >= todayStart && c.timestamp <= todayEnd
    );
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    const newSettings = { ...state.settings, ...updates };
    await saveSettings(newSettings);
    setState((prev) => ({ ...prev, settings: newSettings }));
  };

  const value: AppContextType = {
    state,
    loading,
    refreshExercises,
    refreshCheckIns,
    addExercise,
    updateExercise,
    deleteExercise,
    toggleExerciseEnabled,
    addCheckIn,
    isCheckedInToday,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
