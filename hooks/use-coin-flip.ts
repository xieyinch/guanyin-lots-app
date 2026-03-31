import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CoinResult = 'heads' | 'tails';

export interface CoinFlipRecord {
  id: string;
  result: CoinResult;
  timestamp: number;
}

const COIN_FLIP_KEY = 'guanyin_coin_flip_history';
const MAX_COIN_HISTORY = 50;

/**
 * Hook to manage coin flip divination
 */
export function useCoinFlip() {
  const [history, setHistory] = useState<CoinFlipRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load history from AsyncStorage on mount
  useEffect(() => {
    loadHistory();
  }, []);

  /**
   * Load history from AsyncStorage
   */
  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(COIN_FLIP_KEY);
      if (stored) {
        const records = JSON.parse(stored) as CoinFlipRecord[];
        setHistory(records);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load coin flip history:', error);
      setIsLoading(false);
    }
  };

  /**
   * Flip the coin and return result
   */
  const flipCoin = async (): Promise<CoinResult> => {
    // Random result: 50% heads, 50% tails
    const result: CoinResult = Math.random() < 0.5 ? 'heads' : 'tails';

    try {
      const newRecord: CoinFlipRecord = {
        id: `${Date.now()}_${Math.random()}`,
        result,
        timestamp: Date.now(),
      };

      const updated = [newRecord, ...history].slice(0, MAX_COIN_HISTORY);
      setHistory(updated);
      await AsyncStorage.setItem(COIN_FLIP_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save coin flip record:', error);
    }

    return result;
  };

  /**
   * Clear all coin flip history
   */
  const clearHistory = async () => {
    try {
      setHistory([]);
      await AsyncStorage.removeItem(COIN_FLIP_KEY);
    } catch (error) {
      console.error('Failed to clear coin flip history:', error);
    }
  };

  /**
   * Get coin flip history
   */
  const getHistory = (): CoinFlipRecord[] => {
    return history;
  };

  /**
   * Get statistics
   */
  const getStatistics = () => {
    const headsCount = history.filter(r => r.result === 'heads').length;
    const tailsCount = history.filter(r => r.result === 'tails').length;
    const total = history.length;

    return {
      headsCount,
      tailsCount,
      total,
      headsPercentage: total > 0 ? ((headsCount / total) * 100).toFixed(1) : '0',
      tailsPercentage: total > 0 ? ((tailsCount / total) * 100).toFixed(1) : '0',
    };
  };

  return {
    history,
    isLoading,
    flipCoin,
    clearHistory,
    getHistory,
    getStatistics,
  };
}
