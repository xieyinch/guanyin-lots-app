import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lot } from './use-lots';

const FAVORITES_KEY = 'guanyin_lots_favorites';

/**
 * Hook to manage favorite lots
 */
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  /**
   * Load favorites from AsyncStorage
   */
  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const ids = JSON.parse(stored) as number[];
        setFavoriteIds(ids);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setIsLoading(false);
    }
  };

  /**
   * Add a lot to favorites
   */
  const addFavorite = async (lotId: number) => {
    try {
      if (!favoriteIds.includes(lotId)) {
        const updated = [...favoriteIds, lotId];
        setFavoriteIds(updated);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  };

  /**
   * Remove a lot from favorites
   */
  const removeFavorite = async (lotId: number) => {
    try {
      const updated = favoriteIds.filter(id => id !== lotId);
      setFavoriteIds(updated);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  /**
   * Toggle favorite status
   */
  const toggleFavorite = async (lotId: number) => {
    if (favoriteIds.includes(lotId)) {
      await removeFavorite(lotId);
    } else {
      await addFavorite(lotId);
    }
  };

  /**
   * Check if a lot is favorited
   */
  const isFavorited = (lotId: number): boolean => {
    return favoriteIds.includes(lotId);
  };

  /**
   * Get all favorite IDs
   */
  const getFavoriteIds = (): number[] => {
    return favoriteIds;
  };

  return {
    favoriteIds,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorited,
    getFavoriteIds,
  };
}
