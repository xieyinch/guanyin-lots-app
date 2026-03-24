import { useEffect, useState } from 'react';
import lotsData from '@/assets/data/lots.json';

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

/**
 * Hook to load and manage Guanyin Oracle lots data
 */
export function useLots() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setLots(lotsData as Lot[]);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load lots data:', error);
      setIsLoading(false);
    }
  }, []);

  /**
   * Get a random lot
   */
  const getRandomLot = (): Lot | null => {
    if (lots.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * lots.length);
    return lots[randomIndex];
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

  return {
    lots,
    isLoading,
    getRandomLot,
    getLotById,
    getAllLots,
  };
}
