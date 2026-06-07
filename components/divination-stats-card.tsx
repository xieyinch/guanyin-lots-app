import { View, Text, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { DivinationStats, TimeRange } from '@/hooks/use-divination-stats';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
    <View 
      className="rounded-2xl p-5 gap-4" 
      style={{ 
        backgroundColor: colors.surface,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <View className="flex-row items-center gap-2 mb-1">
        <MaterialCommunityIcons name="chart-bar" size={20} color={colors.primary} />
        <Text className="text-sm font-bold" style={{ color: colors.foreground }}>占卜统计</Text>
      </View>

      <View className="flex-row items-end gap-2">
        <Text className="text-4xl font-bold" style={{ color: colors.primary }}>{totalCount}</Text>
        <Text className="text-sm mb-1.5" style={{ color: colors.muted }}>总次数</Text>
      </View>

      <View className="flex-row gap-2">
        {timeRanges.map((range) => (
          <Pressable
            key={range.id}
            onPress={() => onTimeRangeChange(range.id)}
            className="flex-1"
            style={({ pressed }) => ({
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 10,
              backgroundColor: timeRange === range.id ? colors.primary : colors.backgroundSecondary,
              opacity: pressed ? 0.85 : 1,
              transform: pressed ? [{ scale: 0.98 }] : [],
              shadowColor: timeRange === range.id ? colors.primary : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: timeRange === range.id ? 0.3 : 0,
              shadowRadius: 4,
              elevation: timeRange === range.id ? 3 : 0,
            })}
          >
            <Text
              className="text-xs font-bold text-center"
              style={{
                color: timeRange === range.id ? 'white' : colors.foregroundSecondary,
              }}
            >
              {range.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {stats.length > 0 ? (
        <View className="gap-3">
          {stats.map((stat) => (
            <View key={stat.type} className="gap-1.5">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-base">{stat.icon}</Text>
                  <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                    {stat.label}
                  </Text>
                </View>
                <Text className="text-xs font-semibold" style={{ color: colors.muted }}>
                  {stat.count} 次 · {stat.percentage.toFixed(1)}%
                </Text>
              </View>

              <View
                className="h-2.5 rounded-full overflow-hidden"
                style={{ backgroundColor: colors.border }}
              >
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${stat.percentage}%`,
                    backgroundColor: stat.percentage >= 50 ? colors.primary : colors.warning,
                    shadowColor: stat.percentage >= 50 ? colors.primary : colors.warning,
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="items-center py-6 gap-2">
          <MaterialCommunityIcons name="chart-pie-outline" size={32} color={colors.muted} />
          <Text className="text-sm" style={{ color: colors.muted }}>暂无占卜数据</Text>
        </View>
      )}

      {totalCount > 0 && stats.length > 0 && (
        <View 
          className="p-3 rounded-xl"
          style={{ backgroundColor: colors.primary + '10' }}
        >
          <View className="flex-row items-center gap-2 mb-1">
            <MaterialCommunityIcons name="star" size={14} color={colors.primary} />
            <Text className="text-xs font-medium" style={{ color: colors.foregroundSecondary }}>最常使用</Text>
          </View>
          <Text className="text-sm font-bold" style={{ color: colors.foreground }}>
            {stats[0]?.label} ({stats[0]?.count} 次)
          </Text>
        </View>
      )}
    </View>
  );
}
