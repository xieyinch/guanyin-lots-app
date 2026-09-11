import type { Lot, Bagua, Hexagram, Tarot } from "./types";
import lotsData from "./lots.json";
import baguaData from "./bagua.json";
import hexagramData from "./bagua-64.json";
import tarotData from "./tarot.json";

export const lots: Lot[] = lotsData as Lot[];
export const bagua: Bagua[] = baguaData as Bagua[];
export const hexagrams: Hexagram[] = hexagramData as Hexagram[];
export const tarot: Tarot[] = tarotData as Tarot[];

export function randomLot(): Lot {
  return lots[Math.floor(Math.random() * lots.length)];
}

export function randomBagua(): Bagua {
  return bagua[Math.floor(Math.random() * bagua.length)];
}

export function randomHexagram(): Hexagram {
  return hexagrams[Math.floor(Math.random() * hexagrams.length)];
}

export function randomTarot(): Tarot {
  return tarot[Math.floor(Math.random() * tarot.length)];
}

export function findLot(id: number): Lot | undefined {
  return lots.find((l) => l.id === id);
}