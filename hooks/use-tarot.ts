import { useState, useCallback } from 'react';
import tarotData from '@/data/tarot.json';

export interface TarotCard {
  id: number;
  name: string;
  suit: string;
  meaning: string;
  reversed: string;
  description: string;
  advice: string;
}

export function useTarot() {
  const [isReversed, setIsReversed] = useState(false);

  const getRandomTarot = useCallback(async (): Promise<TarotCard & { isReversed: boolean }> => {
    // Simulate async operation
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * tarotData.length);
        const card = tarotData[randomIndex] as TarotCard;
        const reversed = Math.random() > 0.5;
        setIsReversed(reversed);
        
        resolve({
          ...card,
          isReversed: reversed,
        });
      }, 100);
    });
  }, []);

  return {
    getRandomTarot,
    isReversed,
  };
}
