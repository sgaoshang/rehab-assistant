import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Project, Settings } from '../types';
import { getProjects, saveProjects } from '../storage/projectStorage';
import { getSettings, saveSettings } from '../storage/settingsStorage';
import { scheduleProjectNotifications, cancelProjectNotifications } from '../services/notificationService';

interface AppContextType {
  state: AppState;
  loading: boolean;
  refreshProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleProjectEnabled: (id: string) => Promise<void>;
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
    projects: [],
    settings: {
      notificationPermissionGranted: false,
    },
    initialized: false,
  });
  const [loading, setLoading] = useState(true);

  // 初始化数据
  useEffect(() => {
    const initialize = async () => {
      try {
        const projects = await getProjects();
        const settings = await getSettings();

        setState({
          projects,
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

  const refreshProjects = async () => {
    const projects = await getProjects();
    setState((prev) => ({ ...prev, projects }));
  };

  const addProject = async (project: Omit<Project, 'id' | 'createdAt'>) => {
    const projects = [...state.projects];
    const newProject: Project = {
      ...project,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    projects.push(newProject);
    await saveProjects(projects);
    setState((prev) => ({ ...prev, projects }));

    if (newProject.isEnabled) {
      await scheduleProjectNotifications(newProject);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const projects = [...state.projects];
    const index = projects.findIndex((proj) => proj.id === id);
    if (index !== -1) {
      const oldProject = projects[index];
      projects[index] = { ...oldProject, ...updates };
      await saveProjects(projects);
      setState((prev) => ({ ...prev, projects }));

      // 重新调度通知
      if (projects[index].isEnabled) {
        await scheduleProjectNotifications(projects[index]);
      } else {
        await cancelProjectNotifications(id);
      }
    }
  };

  const deleteProject = async (id: string) => {
    await cancelProjectNotifications(id);
    const projects = state.projects.filter((proj) => proj.id !== id);
    await saveProjects(projects);
    setState((prev) => ({ ...prev, projects }));
  };

  const toggleProjectEnabled = async (id: string) => {
    const project = state.projects.find((proj) => proj.id === id);
    if (project) {
      await updateProject(id, { isEnabled: !project.isEnabled });
    }
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    const newSettings = { ...state.settings, ...updates };
    await saveSettings(newSettings);
    setState((prev) => ({ ...prev, settings: newSettings }));
  };

  const value: AppContextType = {
    state,
    loading,
    refreshProjects,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectEnabled,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
