import { useState, useEffect } from 'react';
import tcmHoursData from '@/assets/data/tcm-hours.json';

interface TCMHour {
  hour: string;
  time: string;
  organ: string;
  element: string;
  advice: string;
  dos: string[];
  donts: string[];
  food: string;
  emotion: string;
}

export function useTCMHours() {
  const [currentHour, setCurrentHour] = useState<TCMHour | null>(null);
  const [hourIndex, setHourIndex] = useState(0);

  useEffect(() => {
    const updateCurrentHour = () => {
      const now = new Date();
      const hour = now.getHours();

      // 计算当前时辰索引
      // 子时: 23-0, 丑时: 1-2, 寅时: 3-4, 卯时: 5-6, 辰时: 7-8, 巳时: 9-10
      // 午时: 11-12, 未时: 13-14, 申时: 15-16, 酉时: 17-18, 戌时: 19-20, 亥时: 21-22
      let index = 0;
      if (hour >= 23 || hour < 1) {
        index = 0; // 子时
      } else if (hour >= 1 && hour < 3) {
        index = 1; // 丑时
      } else if (hour >= 3 && hour < 5) {
        index = 2; // 寅时
      } else if (hour >= 5 && hour < 7) {
        index = 3; // 卯时
      } else if (hour >= 7 && hour < 9) {
        index = 4; // 辰时
      } else if (hour >= 9 && hour < 11) {
        index = 5; // 巳时
      } else if (hour >= 11 && hour < 13) {
        index = 6; // 午时
      } else if (hour >= 13 && hour < 15) {
        index = 7; // 未时
      } else if (hour >= 15 && hour < 17) {
        index = 8; // 申时
      } else if (hour >= 17 && hour < 19) {
        index = 9; // 酉时
      } else if (hour >= 19 && hour < 21) {
        index = 10; // 戌时
      } else if (hour >= 21 && hour < 23) {
        index = 11; // 亥时
      }

      setHourIndex(index);
      setCurrentHour(tcmHoursData[index] as TCMHour);
    };

    updateCurrentHour();

    // 每分钟检查一次是否需要更新时辰
    const interval = setInterval(updateCurrentHour, 60000);

    return () => clearInterval(interval);
  }, []);

  return { currentHour, hourIndex, allHours: tcmHoursData as TCMHour[] };
}
