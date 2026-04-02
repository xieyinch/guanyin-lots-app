import { useState, useEffect } from 'react';

export interface LunarInfo {
  lunarDate: string; // 农历日期，如 "正月初一"
  lunarMonth: string; // 农历月份
  lunarDay: string; // 农历日期
  zodiac: string; // 生肖
  stem: string; // 天干
  branch: string; // 地支
  fiveElements: string; // 五行
  auspicious: string[]; // 宜
  inauspicious: string[]; // 忌
  luckyGods: string[]; // 吉神
  unluckyGods: string[]; // 凶神
  luckyDirections: string[]; // 吉方
}

// 农历月份名称
const lunarMonths = [
  '正月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

// 农历日期名称
const lunarDays = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

// 生肖
const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 天干
const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行
const fiveElementsMap: { [key: string]: string } = {
  '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土',
  '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金',
  '戌': '土', '亥': '水'
};

// 宜忌数据库（简化版）
const lunarDatabase: { [key: string]: any } = {
  '0101': { // 正月初一
    auspicious: ['交易', '会亲友', '开市', '立券', '纳财', '理发'],
    inauspicious: ['人宅', '移徙', '栽种'],
    luckyGods: ['喜神', '福神', '财神'],
    unluckyGods: ['五虚', '土符'],
    luckyDirections: ['西北', '东南']
  },
  '0115': { // 正月十五
    auspicious: ['祭祀', '祈福', '求嗣', '开光', '解除', '移徙'],
    inauspicious: ['安床', '动土'],
    luckyGods: ['喜神', '福神'],
    unluckyGods: ['血支', '死气'],
    luckyDirections: ['东', '南']
  },
  '0505': { // 五月初五
    auspicious: ['祭祀', '祈福', '求嗣', '开光', '解除', '移徙'],
    inauspicious: ['安床', '动土', '开仓'],
    luckyGods: ['喜神', '福神'],
    unluckyGods: ['血支'],
    luckyDirections: ['东北', '西南']
  },
  '0815': { // 八月十五
    auspicious: ['祭祀', '祈福', '求嗣', '开光', '解除'],
    inauspicious: ['安床', '动土'],
    luckyGods: ['喜神', '福神', '财神'],
    unluckyGods: ['死气'],
    luckyDirections: ['南', '西']
  }
};

/**
 * 简单的阳历转农历算法（基于已知数据）
 * 注：这是一个简化版本，仅用于演示
 */
function gregorianToLunar(date: Date): { month: number; day: number; year: number } {
  // 这是一个简化的实现，实际应用应使用完整的农历算法库
  // 这里我们使用一个基础的转换表
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 简化的转换逻辑（仅用于演示）
  // 实际应用应使用 lunar-calendar 或类似库
  let lunarMonth = month;
  let lunarDay = day;

  // 基于当前日期的简单计算
  const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / 86400000);
  lunarDay = (dayOfYear % 30) || 30;
  lunarMonth = Math.ceil(dayOfYear / 30);

  return { month: lunarMonth, day: lunarDay, year };
}

/**
 * 获取农历信息
 */
export function useLunarCalendar() {
  const [lunarInfo, setLunarInfo] = useState<LunarInfo | null>(null);

  useEffect(() => {
    updateLunarInfo();
  }, []);

  const updateLunarInfo = () => {
    const today = new Date();
    const lunar = gregorianToLunar(today);

    // 获取生肖（简化版）
    const zodiacIndex = (today.getFullYear() - 1900) % 12;
    const zodiac = zodiacs[zodiacIndex];

    // 获取天干地支（简化版）
    const stemIndex = (today.getFullYear() - 1900) % 10;
    const branchIndex = (today.getFullYear() - 1900) % 12;
    const stem = stems[stemIndex];
    const branch = branches[branchIndex];

    // 获取五行
    const fiveElements = (fiveElementsMap[stem] || '金') + (fiveElementsMap[branch] || '水');

    // 获取宜忌信息
    const key = `${String(lunar.month).padStart(2, '0')}${String(lunar.day).padStart(2, '0')}`;
    const dbInfo = lunarDatabase[key] || {
      auspicious: ['祭祀', '祈福', '求嗣'],
      inauspicious: ['安床', '动土'],
      luckyGods: ['喜神', '福神'],
      unluckyGods: ['死气'],
      luckyDirections: ['东', '南']
    };

    const info: LunarInfo = {
      lunarDate: `${lunarMonths[lunar.month - 1]}${lunarDays[lunar.day - 1]}`,
      lunarMonth: lunarMonths[lunar.month - 1],
      lunarDay: lunarDays[lunar.day - 1],
      zodiac,
      stem,
      branch,
      fiveElements,
      auspicious: dbInfo.auspicious,
      inauspicious: dbInfo.inauspicious,
      luckyGods: dbInfo.luckyGods,
      unluckyGods: dbInfo.unluckyGods,
      luckyDirections: dbInfo.luckyDirections
    };

    setLunarInfo(info);
  };

  return {
    lunarInfo,
    refreshLunarInfo: updateLunarInfo
  };
}
