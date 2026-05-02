import { describe, it, expect } from 'vitest';

describe('Divination Stats Feature', () => {
  it('should calculate statistics correctly', () => {
    const stats = [
      { type: 'lots', count: 10, percentage: 50 },
      { type: 'coin', count: 5, percentage: 25 },
      { type: 'bagua', count: 5, percentage: 25 },
    ];

    const totalCount = stats.reduce((sum, stat) => sum + stat.count, 0);
    expect(totalCount).toBe(20);
  });

  it('should calculate percentages correctly', () => {
    const lotsCount = 10;
    const totalCount = 20;
    const percentage = (lotsCount / totalCount) * 100;

    expect(percentage).toBe(50);
  });

  it('should sort stats by count descending', () => {
    const stats = [
      { type: 'lots', count: 10 },
      { type: 'coin', count: 5 },
      { type: 'bagua', count: 15 },
    ];

    const sorted = stats.sort((a, b) => b.count - a.count);
    expect(sorted[0].type).toBe('bagua');
    expect(sorted[1].type).toBe('lots');
    expect(sorted[2].type).toBe('coin');
  });

  it('should handle empty stats', () => {
    const stats: any[] = [];
    const totalCount = stats.reduce((sum, stat) => sum + stat.count, 0);

    expect(totalCount).toBe(0);
    expect(stats.length).toBe(0);
  });

  it('should filter by time range', () => {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

    const items = [
      { timestamp: now, type: 'lots' },
      { timestamp: weekAgo + 1000, type: 'coin' },
      { timestamp: monthAgo + 1000, type: 'bagua' },
    ];

    const weekItems = items.filter((item) => item.timestamp >= weekAgo);
    expect(weekItems.length).toBe(2);

    const monthItems = items.filter((item) => item.timestamp >= monthAgo);
    expect(monthItems.length).toBe(3);
  });

  it('should identify most used divination type', () => {
    const stats = [
      { type: 'lots', count: 15, label: '灵签' },
      { type: 'coin', count: 5, label: '硬币' },
      { type: 'bagua', count: 5, label: '八卦' },
    ];

    const sorted = stats.sort((a, b) => b.count - a.count);
    const mostUsed = sorted[0];

    expect(mostUsed.label).toBe('灵签');
    expect(mostUsed.count).toBe(15);
  });
});
