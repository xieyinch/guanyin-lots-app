import { useState, useEffect } from 'react';

export interface MoonPhase {
  phase: string;
  illumination: number;
  name: string;
  description: string;
  influence: string;
  emoji: string;
}

export function useMoonPhase() {
  const [moonPhase, setMoonPhase] = useState<MoonPhase | null>(null);

  // 计算月相
  const calculateMoonPhase = (date: Date): MoonPhase => {
    // 已知的新月日期（2000年1月6日）
    const knownNewMoon = new Date(2000, 0, 6);
    const lunarMonth = 29.53058867; // 朔望月周期（天）

    // 计算从已知新月到现在的天数
    const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    
    // 计算当前月相周期中的位置（0-1）
    const phasePosition = (daysSinceNewMoon % lunarMonth) / lunarMonth;
    
    // 计算月亮照亮百分比
    const illumination = Math.round((1 - Math.cos(2 * Math.PI * phasePosition)) / 2 * 100);

    // 确定月相类型
    let phase: string;
    let name: string;
    let description: string;
    let influence: string;
    let emoji: string;

    if (phasePosition < 0.0625) {
      phase = 'new_moon';
      name = '新月';
      description = '月亮与太阳同方向，月面朝向地球的一面完全被阴影覆盖';
      influence = '新月是新开始的时刻，适合制定计划、启动新项目、种下新的种子';
      emoji = '🌑';
    } else if (phasePosition < 0.1875) {
      phase = 'waxing_crescent';
      name = '娥眉月';
      description = '月亮初生，天空中出现一弯新月';
      influence = '适合学习新技能、建立新习惯、积累能量';
      emoji = '🌒';
    } else if (phasePosition < 0.3125) {
      phase = 'first_quarter';
      name = '上弦月';
      description = '月亮照亮了一半的表面，呈现半圆形';
      influence = '挑战与机遇并存，适合克服困难、做出重要决定、推进项目进展';
      emoji = '🌓';
    } else if (phasePosition < 0.4375) {
      phase = 'waxing_gibbous';
      name = '盈凸月';
      description = '月亮大部分被照亮，但还未完全圆满';
      influence = '能量逐渐增强，适合完善计划、精细调整、为成功做准备';
      emoji = '🌔';
    } else if (phasePosition < 0.5625) {
      phase = 'full_moon';
      name = '满月';
      description = '月亮完全被太阳照亮，呈现圆满的圆形';
      influence = '能量最强，适合庆祝成就、完成项目、释放情感、进行重要仪式';
      emoji = '🌕';
    } else if (phasePosition < 0.6875) {
      phase = 'waning_gibbous';
      name = '亏凸月';
      description = '满月之后，月亮开始减弱';
      influence = '感恩与反思的时刻，适合整理收获、感谢他人、准备放下';
      emoji = '🌖';
    } else if (phasePosition < 0.8125) {
      phase = 'last_quarter';
      name = '下弦月';
      description = '月亮照亮了另一半的表面，呈现半圆形';
      influence = '适合清理旧事物、结束项目、反思学习、为新开始做准备';
      emoji = '🌗';
    } else {
      phase = 'waning_crescent';
      name = '残月';
      description = '月亮逐渐消失，只剩一弯细月';
      influence = '休息与恢复的时刻，适合冥想、放松、内省、准备迎接新月';
      emoji = '🌘';
    }

    return {
      phase,
      illumination,
      name,
      description,
      influence,
      emoji,
    };
  };

  // 初始化月相
  useEffect(() => {
    const today = new Date();
    const phase = calculateMoonPhase(today);
    setMoonPhase(phase);

    // 每小时更新一次月相
    const interval = setInterval(() => {
      const now = new Date();
      const updatedPhase = calculateMoonPhase(now);
      setMoonPhase(updatedPhase);
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return moonPhase;
}
