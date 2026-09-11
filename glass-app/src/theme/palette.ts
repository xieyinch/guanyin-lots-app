import { type ColorSchemeName } from "react-native";

export type Scheme = "light" | "dark";

export type Seed = {
  primary: number;
  secondary: number;
  tertiary: number;
};

export type Theme = {
  scheme: Scheme;
  seed: Seed;
  background: string;
  backgroundElevated: string;
  surface: string;
  surfaceGlass: string;
  surfaceGlassBorder: string;
  onBackground: string;
  onSurface: string;
  muted: string;
  primary: string;
  onPrimary: string;
  secondary: string;
  tertiary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
};

const FALLBACK_LIGHT = 0xff6d5f9e;
const FALLBACK_DARK = 0xffb39ddb;

export function toHex(n: number): string {
  return "#" + ((n >>> 0) & 0xffffff).toString(16).padStart(6, "0");
}

function withAlpha(hex: string, alpha: number): string {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return hex + a;
}

/** Lighten or darken a hex color by an amount in [-1,1]. */
function shade(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const f = amount >= 0 ? 0 : 0;
  const mix = (c: number) =>
    amount >= 0
      ? Math.round(c + (255 - c) * Math.min(amount, 1))
      : Math.round(c * (1 + amount));
  return (
    "#" +
    [mix(r), mix(g), mix(b)]
      .map((v) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function buildTheme(seedNumber: number, scheme: ColorSchemeName): Theme {
  const isDark = scheme === "dark";
  const valid = typeof seedNumber === "number" && seedNumber !== 0;
  const raw = valid ? seedNumber : isDark ? FALLBACK_DARK : FALLBACK_LIGHT;
  const seedHex = toHex(raw);
  const primary = shade(seedHex, isDark ? 0.28 : 0);
  const secondary = shade(seedHex, isDark ? 0.42 : -0.1);
  const tertiary = shade(seedHex, isDark ? 0.52 : -0.18);

  return {
    scheme: isDark ? "dark" : "light",
    seed: {
      primary: raw,
      secondary: raw,
      tertiary: raw,
    },
    background: isDark ? "#0b0b12" : "#f5f3fb",
    backgroundElevated: isDark ? "#15151f" : "#ecebf7",
    surface: isDark ? "#1d1d29" : "#ffffff",
    surfaceGlass: withAlpha(isDark ? "#ffffff" : "#ffffff", isDark ? 0.05 : 0.5),
    surfaceGlassBorder: withAlpha(isDark ? "#ffffff" : "#000000", isDark ? 0.16 : 0.1),
    onBackground: isDark ? "#e9e9f4" : "#191226",
    onSurface: isDark ? "#ececf8" : "#191226",
    muted: isDark ? "#9aa0b8" : "#6b6679",
    primary,
    onPrimary: isDark ? "#1a1020" : "#ffffff",
    secondary,
    tertiary,
    success: isDark ? "#86d99a" : "#1c8a3d",
    warning: isDark ? "#f0c33a" : "#ad6a00",
    danger: isDark ? "#ff8f8f" : "#c7372f",
    info: isDark ? "#8ec9ef" : "#1f6fb0",
  };
}