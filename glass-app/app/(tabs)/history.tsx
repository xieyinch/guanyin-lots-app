import { ScrollView, StyleSheet, View, FlatList } from "react-native";
import { GlassScreen } from "@/components/GlassScreen";
import { Glass } from "@/components/Glass";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/theme/ThemeContext";
import { useHistory } from "@/hooks/useHistory";
import type { HistoryEntry } from "@/data/types";

const TYPE_LABEL: Record<HistoryEntry["type"], string> = {
  lot: "灵签",
  coin: "硬币",
  bagua: "八卦",
  tarot: "塔罗",
};

export default function HistoryScreen() {
  const { theme } = useTheme();
  const { entries } = useHistory();

  return (
    <GlassScreen>
      <View style={styles.page}>
        <View style={styles.header}>
          <ThemedText variant="title">占卜历史</ThemedText>
          <ThemedText variant="muted">共 {entries.length} 条记录</ThemedText>
        </View>
        <FlatList
          data={entries}
          keyExtractor={(e) => e.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Glass style={styles.empty}>
              <ThemedText variant="muted">还没有占卜记录</ThemedText>
            </Glass>
          }
          renderItem={({ item }) => {
            const d = new Date(item.timestamp);
            const time = `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            return (
              <Glass style={styles.card} intensity={45}>
                <View style={[styles.tag, { backgroundColor: theme.primary }]}>
                  <ThemedText style={styles.tagText}>{TYPE_LABEL[item.type]}</ThemedText>
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={styles.titleRow}>
                    <ThemedText variant="headline">{item.title}</ThemedText>
                    {item.grade ? <ThemedText variant="muted">{item.grade}</ThemedText> : null}
                  </View>
                  <ThemedText variant="muted" style={{ fontSize: 12 }}>
                    {time}
                  </ThemedText>
                </View>
              </Glass>
            );
          }}
        />
      </View>
    </GlassScreen>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingTop: 8 },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  list: { padding: 16, gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 20,
  },
  tag: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { color: "#0a0a14", fontWeight: "800", fontSize: 12 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  empty: { padding: 24, borderRadius: 16, alignItems: "center" },
});