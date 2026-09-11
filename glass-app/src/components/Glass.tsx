import React from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  useColorScheme,
} from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "@/theme/ThemeContext";

export type GlassProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
};

/**
 * A frosty "liquid glass" card: translucent blur + faint border + soft shadow.
 * Adapts to light/dark automatically via the current theme.
 */
export function Glass({ children, style, intensity = 70 }: GlassProps) {
  const { theme } = useTheme();
  const scheme = theme.scheme;

  return (
    <View style={[styles.wrapper, style]}>
      <BlurView
        intensity={intensity}
        tint={scheme === "dark" ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.layer,
          {
            backgroundColor: theme.surfaceGlass,
            borderColor: theme.surfaceGlassBorder,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
    borderRadius: 24,
  },
  layer: {
    flex: 1,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
});