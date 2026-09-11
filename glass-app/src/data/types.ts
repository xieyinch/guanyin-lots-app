export type Lot = {
  id: number;
  name: string;
  grade: "上签" | "中签" | "下签" | string;
  poem: string;
  meaning: string;
  interpretation: string;
  details: string;
  story?: string;
};

export type Bagua = {
  id: number;
  name: string;
  symbol: string;
  meaning: string;
  interpretation: string;
  advice?: string;
};

export type Hexagram = {
  id: number;
  name: string;
  symbol: string;
  meaning: string;
  description: string;
  advice: string;
  fortune: string;
};

export type Tarot = {
  id: number;
  name: string;
  suit: string;
  meaning: string;
  reversed: string;
  description: string;
  advice: string;
  isReversed?: boolean;
};

export type HistoryEntry = {
  id: string;
  type: "lot" | "coin" | "bagua" | "tarot";
  title: string;
  grade?: string;
  detail: string;
  timestamp: number;
};