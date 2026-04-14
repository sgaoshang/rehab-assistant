import * as Speech from 'expo-speech';
import { Project } from '../types';

/**
 * 播报单个项目
 */
export const speakProject = async (project: Project): Promise<void> => {
  try {
    // 停止当前播报
    await Speech.stop();

    // 构建播报文本
    let text = `该做${project.name}了。`;
    if (project.description) {
      text += project.description;
    }

    // 播报
    await Speech.speak(text, {
      language: 'zh-CN',
      pitch: 1.0,
      rate: 0.8, // 稍慢一点，更容易听清
      volume: 1.0,
    });
  } catch (error) {
    console.error('Failed to speak project:', error);
  }
};

/**
 * 播报今日待做项目列表
 */
export const speakTodayProjects = async (
  projects: Project[],
  t?: any,
  locale?: any
): Promise<void> => {
  try {
    if (projects.length === 0) {
      await Speech.speak('今天的项目都完成了，太棒了！', {
        language: 'zh-CN',
        pitch: 1.0,
        rate: 0.8,
        volume: 1.0,
      });
      return;
    }

    // 停止当前播报
    await Speech.stop();

    // 构建播报文本
    let text = `您好，今天还有${projects.length}项待办事项需要完成。`;

    if (projects.length === 1) {
      text += `是${projects[0].name}。`;
      if (projects[0].description) {
        text += projects[0].description;
      }
    } else if (projects.length <= 3) {
      text += '分别是：';
      projects.forEach((proj, index) => {
        text += `${index + 1}、${proj.name}。`;
      });
    } else {
      text += '请查看首页列表。';
    }

    // 播报
    await Speech.speak(text, {
      language: 'zh-CN',
      pitch: 1.0,
      rate: 0.8,
      volume: 1.0,
    });
  } catch (error) {
    console.error('Failed to speak today projects:', error);
  }
};

/**
 * 播报完成鼓励语
 */
export const speakEncouragement = async (message: string): Promise<void> => {
  try {
    await Speech.stop();
    await Speech.speak(message, {
      language: 'zh-CN',
      pitch: 1.0,
      rate: 0.8,
      volume: 1.0,
    });
  } catch (error) {
    console.error('Failed to speak encouragement:', error);
  }
};

/**
 * 停止播报
 */
export const stopSpeaking = async (): Promise<void> => {
  try {
    await Speech.stop();
  } catch (error) {
    console.error('Failed to stop speaking:', error);
  }
};

/**
 * 检查语音是否正在播放
 */
export const isSpeaking = async (): Promise<boolean> => {
  try {
    return await Speech.isSpeakingAsync();
  } catch (error) {
    console.error('Failed to check if speaking:', error);
    return false;
  }
};

/**
 * 播报通知内容
 */
export const speakProjectNotification = async (
  projectName: string,
  description?: string
): Promise<void> => {
  try {
    // 停止当前播报
    await Speech.stop();

    // 构建播报文本
    let text = `提醒：该做${projectName}了。`;
    if (description) {
      text += description;
    }

    // 播报
    await Speech.speak(text, {
      language: 'zh-CN',
      pitch: 1.0,
      rate: 0.8,
      volume: 1.0,
    });
  } catch (error) {
    console.error('Failed to speak notification:', error);
  }
};
