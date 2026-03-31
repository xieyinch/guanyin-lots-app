import { useEffect, useState } from 'react';
import baguaData from '@/assets/data/bagua.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Bagua {
  id: number;
  name: string;
  symbol: string;
  meaning: string;
  interpretation: string;
  advice: string;
}

export interface BaguaRecord {
  id: string;
  bagua: Bagua;
  timestamp: number;
}

const BAGUA_HISTORY_KEY = 'guanyin_bagua_history';
const MAX_BAGUA_HISTORY = 50;

/**
 * Hook to manage Bagua divination
 */
export function useBagua() {
  const [baguas, setBaguas] = useState<Bagua[]>([]);
  const [history, setHistory] = useState<BaguaRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setBaguas(baguaData as Bagua[]);
      loadHistory();
    } catch (error) {
      console.error('Failed to load bagua data:', error);
      setIsLoading(false);
    }
  }, []);

  /**
   * Load history from AsyncStorage
   */
  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(BAGUA_HISTORY_KEY);
      if (stored) {
        const records = JSON.parse(stored) as BaguaRecord[];
        setHistory(records);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load bagua history:', error);
      setIsLoading(false);
    }
  };

  /**
   * Get a random bagua
   */
  const getRandomBagua = async (): Promise<Bagua | null> => {
    if (baguas.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * baguas.length);
    const bagua = baguas[randomIndex];

    try {
      const newRecord: BaguaRecord = {
        id: `${bagua.id}_${Date.now()}`,
        bagua,
        timestamp: Date.now(),
      };

      const updated = [newRecord, ...history].slice(0, MAX_BAGUA_HISTORY);
      setHistory(updated);
      await AsyncStorage.setItem(BAGUA_HISTORY_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save bagua record:', error);
    }

    return bagua;
  };

  /**
   * Get a bagua by ID
   */
  const getBaguaById = (id: number): Bagua | undefined => {
    return baguas.find(bagua => bagua.id === id);
  };

  /**
   * Clear all bagua history
   */
  const clearHistory = async () => {
    try {
      setHistory([]);
      await AsyncStorage.removeItem(BAGUA_HISTORY_KEY);
    } catch (error) {
      console.error('Failed to clear bagua history:', error);
    }
  };

  /**
   * Get bagua history
   */
  const getHistory = (): BaguaRecord[] => {
    return history;
  };

  return {
    baguas,
    history,
    isLoading,
    getRandomBagua,
    getBaguaById,
    clearHistory,
    getHistory,
  };
}
