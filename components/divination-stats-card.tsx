import { View, Text, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { DivinationStats, TimeRange } from '@/hooks/use-divination-stats';

interface DivinationStatsCardProps {
  stats: DivinationStats[];
  totalCount: number;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export function DivinationStatsCard({
  stats,
  totalCount,
  timeRange,
  onTimeRangeChange,
}: DivinationStatsCardProps) {
  const colors = useColors();

  const timeRanges: { id: TimeRange; label: string }[] = [
    { id: 'week', label: '本周' },
    { id: 'month', label: '本月' },
    { id: 'all', label: '全部' },
  ];

  return (
    <View className="mx-4 mb-6 rounded-2xl p-6 gap-4" style={{ backgroundColor: colors.surface }}>
      {/* Header */}
      <View className="gap-2">
        <Text className="text-lg font-bold text-foreground">占卜统计</Text>
        <Text className="text-3xl font-bold text-primary">{totalCount}</Text>
        <Text className="text-xs text-muted">总占卜次数</Text>
      </View>

      {/* Time Range Selector */}
      <View className="flex-row gap-2">
        {timeRanges.map((range) => (
          <Pressable
            key={range.id}
            onPress={() => onTimeRangeChange(range.id)}
            style={({ pressed }) => [
              {
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor:
                  timeRange === range.id ? colors.primary : colors.background,
                opacity: pressed ? 0.8 : 1,
                borderWidth: timeRange === range.id ? 0 : 1,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              className="text-xs font-semibold text-center"
              style={{
                color: timeRange === range.id ? 'white' : colors.foreground,
              }}
            >
              {range.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Stats Bars */}
      <View className="gap-4">
        {stats.length > 0 ? (
          stats.map((stat) => (
            <View key={stat.type} className="gap-2">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-lg">{stat.icon}</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {stat.label}
                  </Text>
                </View>
                <Text className="text-xs font-semibold text-muted">
                  {stat.count} 次 ({stat.percentage.toFixed(1)}%)
                </Text>
              </View>

              {/* Progress Bar */}
              <View
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: colors.border }}
              >
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${stat.percentage}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
            </View>
          ))
        ) : (
          <View className="items-center py-4">
            <Text className="text-sm text-muted">暂无占卜数据</Text>
          </View>
        )}
      </View>

      {/* Summary */}
      {totalCount > 0 && (
        <View
          className="p-3 rounded-lg gap-1"
          style={{ backgroundColor: colors.background }}
        >
          <Text className="text-xs text-muted">最常使用</Text>
          <Text className="text-sm font-semibold text-foreground">
            {stats[0]?.label} ({stats[0]?.count} 次)
          </Text>
        </View>
      )}
    </View>
  );
}
