import { useState, useCallback } from 'react';
import { useLots } from './use-lots';
import { useCoinFlip } from './use-coin-flip';
import { useBagua } from './use-bagua';
import { useTarot } from './use-tarot';

export type DivinationType = 'lots' | 'coin' | 'bagua' | 'tarot';

export interface CombinedResult {
  type: DivinationType;
  data: any;
  icon: string;
  label: string;
}

export interface CombinedInterpretation {
  summary: string;
  analysis: string;
  advice: string;
  harmony: string;
}

export function useCombinedDivination() {
  const { getRandomLot } = useLots();
  const { flipCoin } = useCoinFlip();
  const { getRandomBagua } = useBagua();
  const { getRandomTarot } = useTarot();

  const [selectedTypes, setSelectedTypes] = useState<DivinationType[]>([]);
  const [results, setResults] = useState<CombinedResult[]>([]);
  const [interpretation, setInterpretation] = useState<CombinedInterpretation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleType = useCallback((type: DivinationType) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  }, []);

  const generateCombinedReading = useCallback(async () => {
    if (selectedTypes.length === 0) return;

    setIsLoading(true);
    try {
      const newResults: CombinedResult[] = [];

      for (const type of selectedTypes) {
        if (type === 'lots') {
          const lot = await getRandomLot();
          newResults.push({
            type: 'lots',
            data: lot,
            icon: '🎯',
            label: '灵签',
          });
        } else if (type === 'coin') {
          const result = await flipCoin();
          newResults.push({
            type: 'coin',
            data: result,
            icon: '💰',
            label: '硬币',
          });
        } else if (type === 'bagua') {
          const bagua = await getRandomBagua();
          newResults.push({
            type: 'bagua',
            data: bagua,
            icon: '☯️',
            label: '八卦',
          });
        } else if (type === 'tarot') {
          const tarot = await getRandomTarot();
          newResults.push({
            type: 'tarot',
            data: tarot,
            icon: '🎴',
            label: '塔罗',
          });
        }
      }

      setResults(newResults);
      generateInterpretation(newResults);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTypes, getRandomLot, flipCoin, getRandomBagua, getRandomTarot]);

  const generateInterpretation = (results: CombinedResult[]) => {
    const interpretations = generateInterpretations(results);
    setInterpretation(interpretations);
  };

  const reset = useCallback(() => {
    setResults([]);
    setInterpretation(null);
  }, []);

  return {
    selectedTypes,
    toggleType,
    results,
    interpretation,
    isLoading,
    generateCombinedReading,
    reset,
  };
}

function generateInterpretations(results: CombinedResult[]): CombinedInterpretation {
  const typeLabels = results.map((r) => r.label).join('、');
  const resultCount = results.length;

  let summary = '';
  let analysis = '';
  let advice = '';
  let harmony = '';

  // 生成总结
  if (resultCount === 2) {
    summary = `通过${typeLabels}的双重占卜，揭示了事情的多个维度。`;
  } else if (resultCount === 3) {
    summary = `通过${typeLabels}的三重占卜，形成了立体的占卜视角。`;
  } else if (resultCount === 4) {
    summary = `通过${typeLabels}的四重占卜，获得了全面的占卜指引。`;
  } else {
    summary = `通过${typeLabels}的组合占卜，为您提供多维度的参考。`;
  }

  // 分析各占卜方式的含义
  const analysisPoints: string[] = [];
  results.forEach((result) => {
    if (result.type === 'lots') {
      analysisPoints.push(
        `灵签第${result.data.id}签"${result.data.name}"表示${result.data.meaning}，`
      );
    } else if (result.type === 'coin') {
      analysisPoints.push(
        `硬币${result.data === 'heads' ? '正面' : '反面'}暗示${
          result.data === 'heads' ? '顺利进展' : '需要谨慎'
        }，`
      );
    } else if (result.type === 'bagua') {
      analysisPoints.push(`八卦"${result.data.name}"表示${result.data.meaning}，`);
    } else if (result.type === 'tarot') {
      analysisPoints.push(
        `塔罗牌"${result.data.name}"${result.data.isReversed ? '（逆位）' : ''}表示${
          result.data.isReversed ? result.data.reversed : result.data.meaning
        }，`
      );
    }
  });

  analysis = analysisPoints.join('');
  analysis = analysis.slice(0, -1) + '。';

  // 生成建议
  const hasPositive = results.some((r) => {
    if (r.type === 'coin') return r.data === 'heads';
    if (r.type === 'lots') return r.data.grade === '上签' || r.data.grade === '中签';
    return true;
  });

  if (hasPositive) {
    advice =
      '多个占卜结果指向积极的方向，建议您把握机会，积极行动。同时保持谨慎，注意细节。';
  } else {
    advice = '占卜结果提示需要谨慎，建议您深思熟虑，做好充分准备后再行动。';
  }

  // 生成和谐度
  const coherence = calculateCoherence(results);
  if (coherence >= 80) {
    harmony = '各占卜方式高度一致，指引明确，可信度高。';
  } else if (coherence >= 60) {
    harmony = '占卜结果基本一致，整体指向清晰，可作为参考。';
  } else if (coherence >= 40) {
    harmony = '占卜结果存在一定差异，建议综合考虑多个角度。';
  } else {
    harmony = '占卜结果差异较大，可能反映事情的复杂性，需要更多思考。';
  }

  return {
    summary,
    analysis,
    advice,
    harmony,
  };
}

function calculateCoherence(results: CombinedResult[]): number {
  if (results.length < 2) return 100;

  let coherenceScore = 0;
  let comparisons = 0;

  // 比较各占卜结果的积极性
  for (let i = 0; i < results.length; i++) {
    for (let j = i + 1; j < results.length; j++) {
      const score1 = getPositivityScore(results[i]);
      const score2 = getPositivityScore(results[j]);
      const diff = Math.abs(score1 - score2);
      coherenceScore += Math.max(0, 100 - diff * 20);
      comparisons++;
    }
  }

  return comparisons > 0 ? coherenceScore / comparisons : 100;
}

function getPositivityScore(result: CombinedResult): number {
  if (result.type === 'coin') {
    return result.data === 'heads' ? 100 : 0;
  } else if (result.type === 'lots') {
    if (result.data.grade === '上签') return 100;
    if (result.data.grade === '中签') return 60;
    return 20;
  } else if (result.type === 'bagua') {
    // 简化评分
    return 50;
  } else if (result.type === 'tarot') {
    // 大阿卡那中的正位通常更积极
    return result.data.isReversed ? 30 : 70;
  }
  return 50;
}
