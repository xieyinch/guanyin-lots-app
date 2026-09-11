import React from "react";
import { StyleSheet, View, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeContext";

export function GlassScreen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();
  const tint = theme.primary;

  return (
    <LinearGradient
      colors={
        theme.scheme === "dark"
          ? [theme.background, `${theme.primary}22`, theme.background]
          : [theme.backgroundElevated, theme.background]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.flex}
    >
      <View style={[styles.flex, { backgroundColor: tint + "00" }]} />
      <SafeAreaView edges={["top", "left", "right"]} style={styles.flex}>
        <View style={[styles.content, style]}>{children}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1 },
});