import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLots } from './use-lots';

export interface DailyLotRecord {
  date: string;
  lotId: number;
  checkedIn: boolean;
  checkInDate: string;
}

const DAILY_LOT_KEY = 'guanyin_daily_lot';
const CHECK_IN_KEY = 'guanyin_check_in_history';
const MODAL_SHOWN_KEY = 'guanyin_modal_shown_today';

/**
 * Hook to manage daily lot (每日一签) functionality
 */
export function useDailyLot() {
  const { lots } = useLots();
  const [dailyLot, setDailyLot] = useState<any>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowModal, setShouldShowModal] = useState(false);

  useEffect(() => {
    loadDailyLot();
    checkIfShouldShowModal();
  }, [lots]);

  /**
   * Get today's date as YYYY-MM-DD
   */
  const getTodayDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  /**
   * Get yesterday's date as YYYY-MM-DD
   */
  const getYesterdayDate = (): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  /**
   * Check if modal should be shown on first app open of the day
   */
  const checkIfShouldShowModal = async () => {
    try {
      const today = getTodayDate();
      const lastShown = await AsyncStorage.getItem(MODAL_SHOWN_KEY);

      if (lastShown !== today) {
        setShouldShowModal(true);
        await AsyncStorage.setItem(MODAL_SHOWN_KEY, today);
      }
    } catch (error) {
      console.error('Failed to check modal status:', error);
    }
  };

  /**
   * Load daily lot from storage or generate new one
   */
  const loadDailyLot = async () => {
    try {
      const today = getTodayDate();
      const stored = await AsyncStorage.getItem(DAILY_LOT_KEY);

      let record: DailyLotRecord | null = null;

      if (stored) {
        record = JSON.parse(stored);
      }

      // If no record or date has changed, generate new daily lot
      if (!record || record.date !== today) {
        const randomIndex = Math.floor(Math.random() * lots.length);
        const newLot = lots[randomIndex];

        record = {
          date: today,
          lotId: newLot.id,
          checkedIn: false,
          checkInDate: '',
        };

        await AsyncStorage.setItem(DAILY_LOT_KEY, JSON.stringify(record));
      }

      // Get the lot data
      const lot = lots.find((l) => l.id === record.lotId);
      setDailyLot(lot);
      setCheckedIn(record.checkedIn);

      // Calculate streak
      await calculateStreak();
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load daily lot:', error);
      setIsLoading(false);
    }
  };

  /**
   * Check in for today
   */
  const checkIn = async () => {
    try {
      const today = getTodayDate();
      const stored = await AsyncStorage.getItem(DAILY_LOT_KEY);

      if (stored) {
        const record: DailyLotRecord = JSON.parse(stored);
        record.checkedIn = true;
        record.checkInDate = today;

        await AsyncStorage.setItem(DAILY_LOT_KEY, JSON.stringify(record));
        setCheckedIn(true);

        // Update streak
        await calculateStreak();
      }
    } catch (error) {
      console.error('Failed to check in:', error);
    }
  };

  /**
   * Calculate consecutive check-in streak
   */
  const calculateStreak = async () => {
    try {
      const checkInHistory = await AsyncStorage.getItem(CHECK_IN_KEY);
      let history: string[] = [];

      if (checkInHistory) {
        history = JSON.parse(checkInHistory);
      }

      // Add today if checked in
      const todayDate = getTodayDate();
      if (checkedIn && !history.includes(todayDate)) {
        history.push(todayDate);
        await AsyncStorage.setItem(CHECK_IN_KEY, JSON.stringify(history));
      }

      // Calculate streak
      let currentStreak = 0;
      const currentDate = new Date();

      for (let i = 0; i < 365; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        if (history.includes(dateStr)) {
          currentStreak++;
        } else if (i > 0) {
          break;
        }
      }

      setStreak(currentStreak);
    } catch (error) {
      console.error('Failed to calculate streak:', error);
    }
  };

  return {
    dailyLot,
    checkedIn,
    streak,
    isLoading,
    checkIn,
    reloadDailyLot: loadDailyLot,
    shouldShowModal,
    setShouldShowModal,
  };
}
