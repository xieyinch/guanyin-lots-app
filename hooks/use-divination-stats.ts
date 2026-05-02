import { useState, useCallback, useMemo } from 'react';
import { useLots } from './use-lots';
import { useCoinFlip } from './use-coin-flip';
import { useBagua } from './use-bagua';

export type DivinationType = 'lots' | 'coin' | 'bagua' | 'tarot';
export type TimeRange = 'week' | 'month' | 'all';

export interface DivinationStats {
  type: DivinationType;
  count: number;
  percentage: number;
  icon: string;
  label: string;
}

export interface StatsData {
  totalCount: number;
  stats: DivinationStats[];
  timeRange: TimeRange;
}

export function useDivinationStats() {
  const { history: lotsHistory } = useLots();
  const { history: coinHistory } = useCoinFlip();
  const { history: baguaHistory } = useBagua();
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  const getTimeRangeMs = useCallback((range: TimeRange): number => {
    const now = Date.now();
    switch (range) {
      case 'week':
        return now - 7 * 24 * 60 * 60 * 1000;
      case 'month':
        return now - 30 * 24 * 60 * 60 * 1000;
      case 'all':
      default:
        return 0;
    }
  }, []);

  const filterByTimeRange = useCallback(
    (items: any[], range: TimeRange) => {
      const cutoffTime = getTimeRangeMs(range);
      return items.filter((item) => item.timestamp >= cutoffTime);
    },
    [getTimeRangeMs]
  );

  const stats = useMemo(() => {
    const cutoffTime = getTimeRangeMs(timeRange);

    const lotsCount = lotsHistory.filter(
      (item) => item.timestamp >= cutoffTime
    ).length;
    const coinCount = coinHistory.filter(
      (item) => item.timestamp >= cutoffTime
    ).length;
    const baguaCount = baguaHistory.filter(
      (item) => item.timestamp >= cutoffTime
    ).length;

    const totalCount = lotsCount + coinCount + baguaCount;

    const divinationStats: DivinationStats[] = [
      {
        type: 'lots' as DivinationType,
        count: lotsCount,
        percentage: totalCount > 0 ? (lotsCount / totalCount) * 100 : 0,
        icon: '🎯',
        label: '灵签',
      },
      {
        type: 'coin' as DivinationType,
        count: coinCount,
        percentage: totalCount > 0 ? (coinCount / totalCount) * 100 : 0,
        icon: '💰',
        label: '硬币',
      },
      {
        type: 'bagua' as DivinationType,
        count: baguaCount,
        percentage: totalCount > 0 ? (baguaCount / totalCount) * 100 : 0,
        icon: '☯️',
        label: '八卦',
      },
    ].sort((a, b) => b.count - a.count);

    return {
      totalCount,
      stats: divinationStats,
      timeRange,
    };
  }, [lotsHistory, coinHistory, baguaHistory, timeRange, getTimeRangeMs]);

  return {
    stats,
    timeRange,
    setTimeRange,
    totalCount: stats.totalCount,
    divinationStats: stats.stats,
  };
}
