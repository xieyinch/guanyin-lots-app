import { ScrollView, StyleSheet, Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { GlassScreen } from "@/components/GlassScreen";
import { Glass } from "@/components/Glass";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/theme/ThemeContext";
import { useHistory } from "@/hooks/useHistory";

export default function SettingsScreen() {
  const { theme, seed, refresh } = useTheme();
  const { clear } = useHistory();

  const seedHex =
    seed && seed.primary
      ? "#" + ((seed.primary >>> 0) & 0xffffff).toString(16).padStart(6, "0")
      : "未获取";

  return (
    <GlassScreen>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText variant="title">设置</ThemedText>
        </View>

        <Glass style={styles.card} intensity={55}>
          <ThemedText variant="headline">外观</ThemedText>

          <Pressable
            style={styles.action}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              refresh();
            }}
          >
            <View style={{ flex: 1 }}>
              <ThemedText variant="body">重新读取壁纸颜色</ThemedText>
              <ThemedText variant="muted">让毛玻璃主题跟随壁纸</ThemedText>
            </View>
            <Swatch color={seedHex} />
          </Pressable>

          <View style={styles.divider} />
          <ThemedText variant="muted">
            当前模式：{theme.scheme === "dark" ? "深色（跟随系统）" : "浅色（跟随系统）"}
          </ThemedText>
          <ThemedText variant="muted">壁纸主色：{seedHex}</ThemedText>
        </Glass>

        <Glass style={styles.card} intensity={45}>
          <ThemedText variant="headline">数据</ThemedText>
          <Pressable
            style={styles.dangerAction}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              clear();
            }}
          >
            <ThemedText variant="body" color={theme.danger}>
              清空占卜历史
            </ThemedText>
          </Pressable>
        </Glass>

        <Glass style={styles.card} intensity={45}>
          <ThemedText variant="headline">关于</ThemedText>
          <ThemedText variant="muted">
            琉璃占卜 · 纯本地运行
          </ThemedText>
          <ThemedText variant="muted">
            灵签 · 硬币 · 八卦 · 塔罗，数据皆在本地，无需联网。
          </ThemedText>
        </Glass>
      </ScrollView>
    </GlassScreen>
  );
}

function Swatch({ color }: { color: string }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.swatch,
        {
          backgroundColor: color === "#6d5f9e" ? theme.primary : color,
          borderColor: theme.surfaceGlassBorder,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  header: { marginVertical: 12 },
  card: { padding: 18, borderRadius: 20, gap: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  dangerAction: { paddingVertical: 10 },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  divider: { height: 1, backgroundColor: "rgba(0,0,0,0.08)", marginVertical: 6 },
});