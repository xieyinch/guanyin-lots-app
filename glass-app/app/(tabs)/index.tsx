import { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import * as Haptics from "expo-haptics";
import { GlassScreen } from "@/components/GlassScreen";
import { Glass } from "@/components/Glass";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/theme/ThemeContext";
import { useHistory } from "@/hooks/useHistory";
import {
  randomLot,
  randomBagua,
  randomTarot,
  findLot,
} from "@/data";
import type { HistoryEntry } from "@/data/types";

type Mode = "lot" | "coin" | "bagua" | "tarot";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { add } = useHistory();
  const [mode, setMode] = useState<Mode>("lot");
  const [result, setResult] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [dailyLot, setDailyLot] = useState(() => dailyPick());

  const draw = useCallback(() => {
    if (running) return;
    setRunning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      let r: any;
      let entry: HistoryEntry;
      if (mode === "lot") {
        r = randomLot();
        entry = { id: String(Date.now()), type: "lot", title: r.name, grade: r.grade, detail: `第 ${r.id} 签`, timestamp: Date.now() };
      } else if (mode === "coin") {
        const heads = Math.random() < 0.5;
        r = { heads, label: heads ? "正面" : "反面" };
        entry = { id: String(Date.now()), type: "coin", title: r.label, detail: heads ? "吉祥如意" : "需要谨慎", timestamp: Date.now() };
      } else if (mode === "bagua") {
        r = randomBagua();
        entry = { id: String(Date.now()), type: "bagua", title: r.name, detail: r.meaning, timestamp: Date.now() };
      } else {
        r = randomTarot();
        entry = { id: String(Date.now()), type: "tarot", title: r.name, detail: r.suit, timestamp: Date.now() };
      }
      setResult(r);
      add(entry);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => setRunning(false), 300);
    }, 900);
  }, [mode, running, add]);

  return (
    <GlassScreen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText variant="title">琉璃占卜</ThemedText>
          <ThemedText variant="muted">主题随壁纸变幻</ThemedText>
        </View>

        {/* Daily pick card */}
        {dailyLot && (
          <Glass style={styles.dailyCard} intensity={60}>
            <View style={styles.dailyRow}>
              <View style={{ flex: 1 }}>
                <ThemedText variant="muted">每日一签 · 第 {dailyLot.id} 签</ThemedText>
                <ThemedText variant="headline" color={theme.primary}>
                  {dailyLot.name}
                </ThemedText>
                <ThemedText variant="muted">「{dailyLot.poem}」</ThemedText>
              </View>
              <GradeBadge grade={dailyLot.grade} />
            </View>
          </Glass>
        )}

        {/* Mode tabs */}
        <View style={styles.tabsRow}>
          {MODES.map((m) => {
            const active = m.id === mode;
            return (
              <Pressable
                key={m.id}
                onPress={() => setMode(m.id)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: active ? theme.primary : theme.surfaceGlass,
                    borderColor: theme.surfaceGlassBorder,
                  },
                ]}
              >
                <ThemedText
                  style={{ color: active ? "#0a0a14" : theme.muted, fontWeight: "700" }}
                >
                  {m.label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {/* Result area */}
        <Glass style={styles.resultCard} intensity={55}>
          {result ? (
            <ResultView result={result} mode={mode} />
          ) : (
            <View style={styles.empty}>
              <ThemedText variant="body" color={theme.muted}>
                选择一种占卜方式，开始吧
              </ThemedText>
            </View>
          )}
        </Glass>

        {/* Draw button */}
        <Pressable
          onPress={draw}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: theme.primary,
              opacity: pressed || running ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
              shadowColor: theme.primary,
            },
          ]}
        >
          <ThemedText style={styles.ctaText}>{running ? "占卜中…" : "开始占卜"}</ThemedText>
        </Pressable>
      </ScrollView>
    </GlassScreen>
  );
}

const MODES: { id: Mode; label: string }[] = [
  { id: "lot", label: "灵签" },
  { id: "coin", label: "硬币" },
  { id: "bagua", label: "八卦" },
  { id: "tarot", label: "塔罗" },
];

function GradeBadge({ grade }: { grade: string }) {
  const { theme } = useTheme();
  const color =
    grade === "上签" ? theme.success : grade === "中签" ? theme.warning : theme.danger;
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{grade}</Text>
    </View>
  );
}

function ResultView({ result, mode }: { result: any; mode: Mode }) {
  const { theme } = useTheme();
  return (
    <View style={styles.resultInner}>
      {mode === "lot" && (
        <>
          <ThemedText variant="headline" color={theme.primary}>签诗</ThemedText>
          <ThemedText variant="body">{result.poem}</ThemedText>
          <ThemedText variant="muted" color={theme.muted}>解曰：{result.interpretation}</ThemedText>
        </>
      )}
      {mode === "coin" && (
        <ThemedText variant="headline" style={{ fontSize: 34, fontWeight: "800" }}>
          {result.label}
        </ThemedText>
      )}
      {mode === "bagua" && (
        <>
          <ThemedText variant="title">{result.symbol} {result.name}</ThemedText>
          <ThemedText variant="body">{result.meaning}</ThemedText>
          <ThemedText variant="muted" color={theme.muted}>{result.interpretation}</ThemedText>
        </>
      )}
      {mode === "tarot" && (
        <>
          <ThemedText variant="muted" color={theme.primary}>{result.suit}</ThemedText>
          <ThemedText variant="title">{result.name}</ThemedText>
          <ThemedText variant="body">{result.meaning}</ThemedText>
          <ThemedText variant="muted" color={theme.muted}>建议：{result.advice}</ThemedText>
        </>
      )}
    </View>
  );
}

function dailyPick() {
  const day = Math.floor(Date.now() / 86400000);
  const lotId = (day % 100) + 1;
  return findLot(lotId) ?? null;
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginVertical: 12 },
  dailyCard: { padding: 18, borderRadius: 24, marginBottom: 16 },
  dailyRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.06)",
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
  },
  resultCard: { borderRadius: 24, padding: 20, minHeight: 140 },
  resultInner: { gap: 10 },
  empty: { alignItems: "center", paddingVertical: 30 },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  badgeText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  cta: {
    marginTop: 20,
    borderRadius: 28,
    alignItems: "center",
    paddingVertical: 16,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  ctaText: { color: "#0a0a14", fontSize: 17, fontWeight: "800" },
});