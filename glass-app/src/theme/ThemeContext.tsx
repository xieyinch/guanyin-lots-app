import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { buildTheme, type Theme, type Seed } from "./palette";
import { readWallpaperSeed } from "./wallpaper";

type ThemeContextValue = {
  theme: Theme;
  seed: Seed | null;
  refresh: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: buildTheme(0, "light"),
  seed: null,
  refresh: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme() ?? "light";
  const [seed, setSeed] = useState<Seed | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    readWallpaperSeed().then((res) => {
      if (mounted) setSeed(res);
    });
    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  const theme = useMemo(
    () => buildTheme(seed?.primary ?? 0, systemScheme),
    [seed, systemScheme]
  );

  const value = useMemo(
    () => ({
      theme,
      seed,
      refresh: () => setRefreshKey((k) => k + 1),
    }),
    [theme, seed]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}