import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lot } from './use-lots';

export interface HistoryRecord {
  id: string;
  lot: Lot;
  timestamp: number;
}

const HISTORY_KEY = 'guanyin_lots_history';
const MAX_HISTORY = 50;

/**
 * Hook to manage drawing history
 */
export function useHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
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
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      if (stored) {
        const records = JSON.parse(stored) as HistoryRecord[];
        setHistory(records);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load history:', error);
      setIsLoading(false);
    }
  };

  /**
   * Add a new record to history
   */
  const addRecord = async (lot: Lot) => {
    try {
      const newRecord: HistoryRecord = {
        id: `${lot.id}_${Date.now()}`,
        lot,
        timestamp: Date.now(),
      };

      const updated = [newRecord, ...history].slice(0, MAX_HISTORY);
      setHistory(updated);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to add history record:', error);
    }
  };

  /**
   * Clear all history
   */
  const clearHistory = async () => {
    try {
      setHistory([]);
      await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  /**
   * Get history records
   */
  const getHistory = (): HistoryRecord[] => {
    return history;
  };

  return {
    history,
    isLoading,
    addRecord,
    clearHistory,
    getHistory,
  };
}
