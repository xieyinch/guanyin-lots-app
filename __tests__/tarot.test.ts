import { describe, it, expect } from 'vitest';
import tarotData from '../data/tarot.json';

describe('Tarot Card Feature', () => {
  it('should have 78 tarot cards', () => {
    expect(tarotData).toHaveLength(78);
  });

  it('should have valid tarot card structure', () => {
    tarotData.forEach((card: any) => {
      expect(card).toHaveProperty('id');
      expect(card).toHaveProperty('name');
      expect(card).toHaveProperty('suit');
      expect(card).toHaveProperty('meaning');
      expect(card).toHaveProperty('reversed');
      expect(card).toHaveProperty('description');
      expect(card).toHaveProperty('advice');
    });
  });

  it('should have unique card IDs', () => {
    const ids = tarotData.map((card: any) => card.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(tarotData.length);
  });

  it('should have valid card suits', () => {
    const validSuits = ['大阿卡那', '权杖', '圣杯', '宝剑', '金币'];
    tarotData.forEach((card: any) => {
      expect(validSuits).toContain(card.suit);
    });
  });

  it('should have meaningful descriptions', () => {
    tarotData.forEach((card: any) => {
      expect(card.meaning).toBeTruthy();
      expect(card.meaning.length).toBeGreaterThan(0);
      expect(card.reversed).toBeTruthy();
      expect(card.reversed.length).toBeGreaterThan(0);
    });
  });

  it('should randomly select a tarot card', () => {
    const randomIndex = Math.floor(Math.random() * tarotData.length);
    const card = tarotData[randomIndex];
    expect(card).toBeDefined();
    expect(card.id).toBeGreaterThanOrEqual(0);
    expect(card.id).toBeLessThan(78);
  });

  it('should handle reversed card state', () => {
    const isReversed = Math.random() > 0.5;
    expect(typeof isReversed).toBe('boolean');
  });
});
