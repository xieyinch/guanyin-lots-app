import { useState, useEffect } from 'react';
import hexagrams from '@/assets/data/bagua-64.json';

export interface Hexagram {
  id: number;
  name: string;
  symbol: string;
  meaning: string;
  description: string;
  advice: string;
  fortune: string;
}

export function useRandomHexagram() {
  const [hexagram, setHexagram] = useState<Hexagram | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 随机触发卦象显示（每次应用使用时有概率显示）
  useEffect(() => {
    // 每次应用启动时，有 8% 的概率显示卦象
    const shouldShow = Math.random() < 0.08;

    if (shouldShow) {
      // 随机选择一个卦象
      const randomIndex = Math.floor(Math.random() * hexagrams.length);
      const selectedHexagram = hexagrams[randomIndex] as Hexagram;
      setHexagram(selectedHexagram);
      setIsVisible(true);

      // 10秒后自动隐藏
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  // 获取随机卦象（完全随机，无法人为控制）
  const getRandomHexagram = () => {
    const randomIndex = Math.floor(Math.random() * hexagrams.length);
    return hexagrams[randomIndex] as Hexagram;
  };

  // 关闭卦象显示
  const closeHexagram = () => {
    setIsVisible(false);
  };

  return {
    hexagram,
    isVisible,
    closeHexagram,
    getRandomHexagram,
  };
}
