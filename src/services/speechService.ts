import * as Speech from 'expo-speech';
import { Exercise } from '../types';

/**
 * 播报单个训练
 */
export const speakExercise = async (exercise: Exercise): Promise<void> => {
  try {
    // 停止当前播报
    await Speech.stop();

    // 构建播报文本
    let text = `该做${exercise.name}了。`;
    if (exercise.description) {
      text += exercise.description;
    }

    // 播报
    await Speech.speak(text, {
      language: 'zh-CN',
      pitch: 1.0,
      rate: 0.8, // 稍慢一点，老人更容易听清
      volume: 1.0,
    });
  } catch (error) {
    console.error('Failed to speak exercise:', error);
  }
};

/**
 * 播报今日待做训练列表
 */
export const speakTodayExercises = async (exercises: Exercise[]): Promise<void> => {
  try {
    if (exercises.length === 0) {
      await Speech.speak('今天的训练都完成了，太棒了！', {
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
    let text = `您好，今天还有${exercises.length}项训练需要完成。`;

    if (exercises.length === 1) {
      text += `是${exercises[0].name}。`;
      if (exercises[0].description) {
        text += exercises[0].description;
      }
    } else if (exercises.length <= 3) {
      text += '分别是：';
      exercises.forEach((ex, index) => {
        text += `${index + 1}、${ex.name}。`;
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
    console.error('Failed to speak today exercises:', error);
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
