import * as Speech from 'expo-speech';
import { Project } from '../types';
import { Locale, TranslationFunction } from '../i18n/types';

/**
 * Convert locale to speech language code
 */
const getLanguageCode = (locale: Locale): string => {
  return locale === 'zh' ? 'zh-CN' : 'en-US';
};

/**
 * Get translated project name and description
 */
const getTranslatedProject = (
  project: Project,
  t: TranslationFunction
): { name: string; description: string } => {
  if (project.presetId) {
    return {
      name: t(`presets.${project.presetId}.name`),
      description: t(`presets.${project.presetId}.description`),
    };
  }
  return {
    name: project.name,
    description: project.description,
  };
};

/**
 * 播报单个项目
 */
export const speakProject = async (
  project: Project,
  t: TranslationFunction,
  locale: Locale
): Promise<void> => {
  try {
    // 停止当前播报
    await Speech.stop();

    const { name, description } = getTranslatedProject(project, t);
    const languageCode = getLanguageCode(locale);

    // 构建播报文本
    let text = '';
    if (locale === 'zh') {
      text = `该做${name}了。`;
      if (description) {
        text += description;
      }
    } else {
      text = `Time for ${name}. `;
      if (description) {
        text += description;
      }
    }

    // 播报
    await Speech.speak(text, {
      language: languageCode,
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
  t: TranslationFunction,
  locale: Locale
): Promise<void> => {
  try {
    const languageCode = getLanguageCode(locale);

    if (projects.length === 0) {
      const text = locale === 'zh'
        ? '今天的项目都完成了，太棒了！'
        : 'All projects for today are complete. Great job!';
      await Speech.speak(text, {
        language: languageCode,
        pitch: 1.0,
        rate: 0.8,
        volume: 1.0,
      });
      return;
    }

    // 停止当前播报
    await Speech.stop();

    // 构建播报文本
    let text = '';
    if (locale === 'zh') {
      text = `您好，今天还有${projects.length}项待办事项需要完成。`;

      if (projects.length === 1) {
        const { name, description } = getTranslatedProject(projects[0], t);
        text += `是${name}。`;
        if (description) {
          text += description;
        }
      } else if (projects.length <= 3) {
        text += '分别是：';
        projects.forEach((proj, index) => {
          const { name } = getTranslatedProject(proj, t);
          text += `${index + 1}、${name}。`;
        });
      } else {
        text += '请查看首页列表。';
      }
    } else {
      text = `Hello! You have ${projects.length} reminder ${projects.length === 1 ? 'project' : 'projects'} to complete today. `;

      if (projects.length === 1) {
        const { name, description } = getTranslatedProject(projects[0], t);
        text += `It is ${name}. `;
        if (description) {
          text += description;
        }
      } else if (projects.length <= 3) {
        text += 'They are: ';
        projects.forEach((proj, index) => {
          const { name } = getTranslatedProject(proj, t);
          text += `${index + 1}. ${name}. `;
        });
      } else {
        text += 'Please check the home screen for the list.';
      }
    }

    // 播报
    await Speech.speak(text, {
      language: languageCode,
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
export const speakEncouragement = async (
  message: string,
  locale: Locale
): Promise<void> => {
  try {
    await Speech.stop();
    const languageCode = getLanguageCode(locale);
    await Speech.speak(message, {
      language: languageCode,
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
  description: string | undefined,
  locale: Locale
): Promise<void> => {
  try {
    // 停止当前播报
    await Speech.stop();

    const languageCode = getLanguageCode(locale);

    // 构建播报文本
    let text = '';
    if (locale === 'zh') {
      text = `提醒：该做${projectName}了。`;
      if (description) {
        text += description;
      }
    } else {
      text = `Reminder: Time for ${projectName}. `;
      if (description) {
        text += description;
      }
    }

    // 播报
    await Speech.speak(text, {
      language: languageCode,
      pitch: 1.0,
      rate: 0.8,
      volume: 1.0,
    });
  } catch (error) {
    console.error('Failed to speak notification:', error);
  }
};
