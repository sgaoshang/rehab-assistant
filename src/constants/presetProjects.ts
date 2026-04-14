import { Project } from '../types';

export const PRESET_PROJECTS: Omit<Project, 'id' | 'createdAt' | 'isEnabled' | 'reminderTimes'>[] = [
  // 康复训练类
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

  // 用药提醒类
  {
    name: '降压药',
    description: '每日定时服用降压药，饭后服用，避免空腹',
    isPreset: true,
  },
  {
    name: '降糖药',
    description: '餐前30分钟服用，注意监测血糖',
    isPreset: true,
  },
  {
    name: '维生素补充',
    description: '每日一次，早餐后服用',
    isPreset: true,
  },
  {
    name: '钙片补充',
    description: '睡前服用，促进吸收',
    isPreset: true,
  },

  // 生活习惯类
  {
    name: '测量血压',
    description: '每日早晚各一次，记录血压值',
    isPreset: true,
  },
  {
    name: '测量血糖',
    description: '空腹和餐后2小时测量，记录数值',
    isPreset: true,
  },
  {
    name: '喝水提醒',
    description: '每次饮水200-300ml，保持充足水分',
    isPreset: true,
  },
  {
    name: '午休',
    description: '午饭后休息30分钟，有助于恢复精力',
    isPreset: true,
  },
];
