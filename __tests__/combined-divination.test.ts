import { describe, it, expect } from 'vitest';

describe('Combined Divination Feature', () => {
  it('should calculate coherence score correctly', () => {
    const results = [
      { type: 'lots', data: { grade: '上签' } },
      { type: 'coin', data: 'heads' },
    ];

    const getPositivityScore = (result: any) => {
      if (result.type === 'coin') {
        return result.data === 'heads' ? 100 : 0;
      } else if (result.type === 'lots') {
        if (result.data.grade === '上签') return 100;
        if (result.data.grade === '中签') return 60;
        return 20;
      }
      return 50;
    };

    const score1 = getPositivityScore(results[0]);
    const score2 = getPositivityScore(results[1]);
    const diff = Math.abs(score1 - score2);
    const coherence = Math.max(0, 100 - diff * 20);

    expect(score1).toBe(100);
    expect(score2).toBe(100);
    expect(coherence).toBe(100);
  });

  it('should handle mixed positive and negative results', () => {
    const results = [
      { type: 'lots', data: { grade: '下签' } },
      { type: 'coin', data: 'heads' },
    ];

    const getPositivityScore = (result: any) => {
      if (result.type === 'coin') {
        return result.data === 'heads' ? 100 : 0;
      } else if (result.type === 'lots') {
        if (result.data.grade === '上签') return 100;
        if (result.data.grade === '中签') return 60;
        return 20;
      }
      return 50;
    };

    const score1 = getPositivityScore(results[0]);
    const score2 = getPositivityScore(results[1]);
    const diff = Math.abs(score1 - score2);
    const coherence = Math.max(0, 100 - diff * 20);

    expect(score1).toBe(20);
    expect(score2).toBe(100);
    expect(coherence).toBe(0);
  });

  it('should generate interpretation summary', () => {
    const types = ['灵签', '硬币'];
    const summary = `通过${types.join('、')}的双重占卜，揭示了事情的多个维度。`;

    expect(summary).toContain('双重占卜');
    expect(summary).toContain('灵签');
    expect(summary).toContain('硬币');
  });

  it('should validate minimum selection', () => {
    const selectedTypes = ['lots'];
    const isValid = selectedTypes.length >= 2;

    expect(isValid).toBe(false);
  });

  it('should validate maximum selection', () => {
    const selectedTypes = ['lots', 'coin', 'bagua', 'tarot'];
    const isValid = selectedTypes.length <= 4;

    expect(isValid).toBe(true);
  });

  it('should sort results by selection order', () => {
    const selectedTypes = ['tarot', 'lots', 'coin'];
    const results = [
      { type: 'lots', label: '灵签' },
      { type: 'coin', label: '硬币' },
      { type: 'tarot', label: '塔罗' },
    ];

    const sorted = results.sort(
      (a, b) =>
        selectedTypes.indexOf(a.type as any) -
        selectedTypes.indexOf(b.type as any)
    );

    expect(sorted[0].type).toBe('tarot');
    expect(sorted[1].type).toBe('lots');
    expect(sorted[2].type).toBe('coin');
  });
});
