import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // 生成完全随机的下次出现时间（毫秒）
  // 范围：从现在起的 1 天到 365 天之间的随机时间
  const generateNextAppearanceTime = (): number => {
    // 最小间隔：1 天（86400000 毫秒）
    // 最大间隔：365 天（31536000000 毫秒）
    const minInterval = 24 * 60 * 60 * 1000; // 1 天
    const maxInterval = 365 * 24 * 60 * 60 * 1000; // 365 天
    
    // 使用指数分布来增加长时间不出现的概率
    // 这样可以实现"几个月甚至一年都不会出现"的效果
    const randomValue = Math.random();
    const exponentialValue = -Math.log(1 - randomValue * 0.99) / 0.01;
    const interval = minInterval * Math.pow(exponentialValue, 1.5);
    
    return Math.min(interval, maxInterval);
  };

  // 检查是否应该显示卦象
  const checkAndShowHexagram = async () => {
    try {
      const lastAppearanceTime = await AsyncStorage.getItem('hexagram_last_appearance');
      const nextAppearanceTime = await AsyncStorage.getItem('hexagram_next_appearance');
      
      const now = Date.now();
      
      // 如果这是第一次，生成下次出现时间
      if (!nextAppearanceTime) {
        const nextTime = now + generateNextAppearanceTime();
        await AsyncStorage.setItem('hexagram_next_appearance', nextTime.toString());
        return;
      }
      
      // 检查是否到达了显示时间
      if (now >= parseInt(nextAppearanceTime)) {
        // 显示卦象
        const randomIndex = Math.floor(Math.random() * hexagrams.length);
        const selectedHexagram = hexagrams[randomIndex] as Hexagram;
        setHexagram(selectedHexagram);
        setIsVisible(true);
        
        // 记录这次出现的时间
        await AsyncStorage.setItem('hexagram_last_appearance', now.toString());
        
        // 生成下一次出现时间（完全随机，可能立即出现，也可能很久以后）
        const nextTime = now + generateNextAppearanceTime();
        await AsyncStorage.setItem('hexagram_next_appearance', nextTime.toString());
        
        // 10秒后自动隐藏
        const timer = setTimeout(() => {
          setIsVisible(false);
        }, 10000);
        
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error checking hexagram appearance:', error);
    }
  };

  // 在组件挂载时检查是否应该显示卦象
  useEffect(() => {
    checkAndShowHexagram();
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
