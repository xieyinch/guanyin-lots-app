import { useEffect, useState } from 'react';
import lotsData from '@/assets/data/lots.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Lot {
  id: number;
  name: string;
  grade: string;
  poem: string;
  meaning: string;
  interpretation: string;
  details: string;
  story: string;
}

// Map old field names to new ones for compatibility
export interface LotDisplay extends Lot {
  number: number;
  fortune: string;
  advice: string;
}

export interface LotRecord {
  id: string;
  lot: Lot;
  timestamp: number;
}

const LOTS_HISTORY_KEY = 'guanyin_lots_history';
const MAX_LOTS_HISTORY = 50;

/**
 * Hook to load and manage Guanyin Oracle lots data
 */
export function useLots() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [history, setHistory] = useState<LotRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setLots(lotsData as Lot[]);
      loadHistory();
    } catch (error) {
      console.error('Failed to load lots data:', error);
      setIsLoading(false);
    }
  }, []);

  /**
   * Load history from AsyncStorage
   */
  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(LOTS_HISTORY_KEY);
      if (stored) {
        const records = JSON.parse(stored) as LotRecord[];
        setHistory(records);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load lots history:', error);
      setIsLoading(false);
    }
  };

  /**
   * Get a random lot
   */
  const getRandomLot = async (): Promise<Lot | null> => {
    if (lots.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * lots.length);
    const lot = lots[randomIndex];

    try {
      const newRecord: LotRecord = {
        id: `${lot.id}_${Date.now()}`,
        lot,
        timestamp: Date.now(),
      };

      const updated = [newRecord, ...history].slice(0, MAX_LOTS_HISTORY);
      setHistory(updated);
      await AsyncStorage.setItem(LOTS_HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save lot record:', error);
    }

    return lot;
  };

  /**
   * Get a lot by ID
   */
  const getLotById = (id: number): Lot | undefined => {
    return lots.find(lot => lot.id === id);
  };

  /**
   * Get all lots
   */
  const getAllLots = (): Lot[] => {
    return lots;
  };

  /**
   * Clear all history
   */
  const clearHistory = async () => {
    try {
      setHistory([]);
      await AsyncStorage.removeItem(LOTS_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear lots history:', error);
    }
  };

  return {
    lots,
    history,
    isLoading,
    getRandomLot,
    getLotById,
    getAllLots,
    clearHistory,
  };
}
