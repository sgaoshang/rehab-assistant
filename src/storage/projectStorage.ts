import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project } from '../types';

const STORAGE_KEY = '@rehab_app:projects';

/**
 * 生成 UUID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 迁移项目数据：添加 completionHistory 字段
 */
const migrateProjects = (projects: any[]): Project[] => {
  return projects.map(project => ({
    ...project,
    completionHistory: project.completionHistory || [],
  }));
};

/**
 * 获取所有项目
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const rawProjects = data ? JSON.parse(data) : [];
    const migratedProjects = migrateProjects(rawProjects);

    // If migration added missing fields, save the migrated data
    const needsMigration = rawProjects.some((p: any) => !p.completionHistory);
    if (needsMigration && rawProjects.length > 0) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(migratedProjects));
    }

    return migratedProjects;
  } catch (error) {
    console.error('Failed to get projects:', error);
    return [];
  }
};

/**
 * 保存项目列表
 */
export const saveProjects = async (projects: Project[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects:', error);
    throw error;
  }
};

/**
 * 添加项目
 */
export const addProject = async (project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> => {
  try {
    const projects = await getProjects();
    const newProject: Project = {
      ...project,
      id: generateId(),
      createdAt: Date.now(),
    };
    projects.push(newProject);
    await saveProjects(projects);
    return newProject;
  } catch (error) {
    console.error('Failed to add project:', error);
    throw error;
  }
};

/**
 * 更新项目
 */
export const updateProject = async (id: string, updates: Partial<Project>): Promise<void> => {
  try {
    const projects = await getProjects();
    const index = projects.findIndex((proj) => proj.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      await saveProjects(projects);
    }
  } catch (error) {
    console.error('Failed to update project:', error);
    throw error;
  }
};

/**
 * 删除项目
 */
export const deleteProject = async (id: string): Promise<void> => {
  try {
    const projects = await getProjects();
    const filtered = projects.filter((proj) => proj.id !== id);
    await saveProjects(filtered);
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw error;
  }
};

/**
 * 获取启用的项目
 */
export const getEnabledProjects = async (): Promise<Project[]> => {
  try {
    const projects = await getProjects();
    return projects.filter((proj) => proj.isEnabled);
  } catch (error) {
    console.error('Failed to get enabled projects:', error);
    return [];
  }
};
