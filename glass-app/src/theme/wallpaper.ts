import { NativeModules, Platform } from "react-native";
import type { Seed } from "./palette";

const Module: {
  getColors?: () => Promise<Partial<Seed> | null>;
} | null = NativeModules.GlassDynamicColors as any;

/**
 * Returns the wallpaper-derived seed colors, or null when unavailable
 * (web, older Android, or native module not linked). Never throws.
 */
export async function readWallpaperSeed(): Promise<Seed | null> {
  if (Platform.OS !== "android" || !Module || typeof Module.getColors !== "function") {
    return null;
  }
  try {
    const res = await Module.getColors();
    if (res && typeof res.primary === "number" && res.primary !== 0) {
      return {
        primary: res.primary,
        secondary: res.secondary ?? res.primary,
        tertiary: res.tertiary ?? res.primary,
      };
    }
  } catch {
    // fall through to null
  }
  return null;
}