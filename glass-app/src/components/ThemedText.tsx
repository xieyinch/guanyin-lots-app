import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { useTheme } from "@/theme/ThemeContext";

type Variant = "title" | "headline" | "body" | "muted";

export function ThemedText({
  variant = "body",
  color,
  style,
  ...props
}: TextProps & { variant?: Variant; color?: string }) {
  const { theme } = useTheme();
  const resolved = color ?? (variant === "muted" ? theme.muted : theme.onBackground);
  return <Text {...props} style={[styles[variant], { color: resolved }, style]} />;
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: "800", letterSpacing: 0.3 },
  headline: { fontSize: 20, fontWeight: "700" },
  body: { fontSize: 15, lineHeight: 22 },
  muted: { fontSize: 13, fontWeight: "500" },
});