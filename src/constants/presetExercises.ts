import { Exercise } from '../types';

export const PRESET_EXERCISES: Omit<Exercise, 'id' | 'createdAt' | 'isEnabled' | 'reminderTimes'>[] = [
  {
    name: '握拳练习',
    description: '慢慢握紧拳头，保持5秒，然后放松。每次重复10-15次',
    isPreset: true,
  },
  {
    name: '手指伸展',
    description: '将手指尽量张开，保持5秒后放松。每次重复10次',
    isPreset: true,
  },
  {
    name: '抬臂运动',
    description: '慢慢将手臂向前抬高，尽量到肩膀高度。每侧重复8-10次',
    isPreset: true,
  },
  {
    name: '肩关节旋转',
    description: '缓慢转动肩膀，画圆圈。顺时针和逆时针各10次',
    isPreset: true,
  },
  {
    name: '踝关节运动',
    description: '坐姿，脚尖向上勾，再向下压。每侧重复15次',
    isPreset: true,
  },
  {
    name: '膝关节屈伸',
    description: '坐姿，慢慢伸直腿，再弯曲。每侧重复10次',
    isPreset: true,
  },
  {
    name: '原地踏步',
    description: '扶稳椅背，原地缓慢踏步。持续3-5分钟',
    isPreset: true,
  },
  {
    name: '颈部转动',
    description: '慢慢左右转头，不要用力过猛。每侧重复8次',
    isPreset: true,
  },
  {
    name: '深呼吸练习',
    description: '深吸气5秒，慢慢呼出5秒。重复10次',
    isPreset: true,
  },
  {
    name: '平衡训练',
    description: '扶稳物体，单脚站立保持10秒。每侧重复5次',
    isPreset: true,
  },
];
