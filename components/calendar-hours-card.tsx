import { View, Text } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface CalendarHoursCardProps {
  lunarInfo: any;
  hour: any;
  moonPhase?: any;
}

export function CalendarHoursCard({ lunarInfo, hour, moonPhase }: CalendarHoursCardProps) {
  const colors = useColors();

  if (!lunarInfo || !hour) {
    return null;
  }

  const elementColors: Record<string, string> = {
    '木': '#22C55E',
    '火': '#EF4444',
    '土': '#D4A574',
    '金': '#F59E0B',
    '水': '#3B82F6',
  };

  // Format dates
  const today = new Date();
  const gregorianDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  const lunarDate = `${lunarInfo.lunarMonth}月${lunarInfo.lunarDay}日`;
  const stemBranch = `${lunarInfo.stem}${lunarInfo.branch}`;

  return (
    <View
      className="rounded-3xl p-6 gap-5 mx-4 mb-6"
      style={{
        backgroundColor: colors.surface,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      {/* Header Row - Date Info */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-xs text-muted mb-1">公历</Text>
            <Text className="text-lg font-bold text-foreground">{gregorianDate}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-xs text-muted mb-1">农历</Text>
            <Text className="text-lg font-bold text-foreground">{lunarDate}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-xs text-muted mb-1">生肖</Text>
            <Text className="text-lg font-bold text-foreground">{lunarInfo.zodiac}</Text>
          </View>
        </View>

        {/* Heavenly Stems and Earthly Branches */}
        <View className="flex-row gap-3">
          <View
            className="flex-1 p-3 rounded-2xl"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <Text className="text-xs text-muted mb-1">天干地支</Text>
            <Text className="text-sm font-semibold text-foreground">{stemBranch}</Text>
          </View>
          <View
            className="flex-1 p-3 rounded-2xl"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <Text className="text-xs text-muted mb-1">五行</Text>
            <Text className="text-sm font-semibold text-foreground">{lunarInfo.fiveElements}</Text>
          </View>
        </View>

        {/* Moon Phase */}
        {moonPhase && (
          <View
            className="p-4 rounded-2xl"
            style={{ backgroundColor: colors.primary + '15' }}
          >
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-2xl">{moonPhase.emoji}</Text>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">{moonPhase.name}</Text>
                <Text className="text-xs text-muted">照亮度: {moonPhase.illumination}%</Text>
              </View>
            </View>
            <Text className="text-xs text-foreground leading-relaxed mb-2">{moonPhase.description}</Text>
            <View
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.primary + '25' }}
            >
              <Text className="text-xs text-foreground">{moonPhase.influence}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: colors.border }} />

      {/* Current Hour Section */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="schedule" size={18} color={colors.primary} />
            <Text className="text-sm font-semibold text-foreground">当前时辰</Text>
          </View>
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: elementColors[hour.element] || colors.primary }}
          >
            <Text className="text-xs font-bold text-white">{hour.element}</Text>
          </View>
        </View>

        <View className="flex-row items-baseline gap-2">
          <Text className="text-2xl font-bold text-foreground">{hour.hour}</Text>
          <Text className="text-sm text-muted">{hour.time}</Text>
          <Text className="text-xs text-muted ml-auto">对应器官: {hour.organ}</Text>
        </View>

        <Text className="text-sm text-foreground leading-relaxed">{hour.advice}</Text>
      </View>

      {/* Dos and Donts */}
      <View className="gap-2">
        <View className="flex-row gap-3">
          {/* Dos */}
          <View className="flex-1">
            <View className="flex-row items-center gap-1 mb-2">
              <View
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.success }}
              />
              <Text className="text-xs font-semibold text-success">宜做</Text>
            </View>
            <View className="gap-1">
              {hour.dos.slice(0, 2).map((item: string, index: number) => (
                <Text key={index} className="text-xs text-foreground">
                  • {item}
                </Text>
              ))}
            </View>
          </View>

          {/* Donts */}
          <View className="flex-1">
            <View className="flex-row items-center gap-1 mb-2">
              <View
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.error }}
              />
              <Text className="text-xs font-semibold text-error">忌做</Text>
            </View>
            <View className="gap-1">
              {hour.donts.slice(0, 2).map((item: string, index: number) => (
                <Text key={index} className="text-xs text-foreground">
                  • {item}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Auspicious and Inauspicious Info */}
      <View className="gap-2">
        {/* Auspicious */}
        <View
          className="p-3 rounded-2xl"
          style={{ backgroundColor: colors.success + '15' }}
        >
          <View className="flex-row items-center gap-1 mb-2">
            <MaterialIcons name="check-circle" size={14} color={colors.success} />
            <Text className="text-xs font-semibold text-success">今日宜</Text>
          </View>
          <View className="flex-row flex-wrap gap-1">
            {lunarInfo.auspicious?.slice(0, 4).map((item: string, index: number) => (
              <View
                key={index}
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: colors.success + '25' }}
              >
                <Text className="text-xs text-success">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Inauspicious */}
        <View
          className="p-3 rounded-2xl"
          style={{ backgroundColor: colors.error + '15' }}
        >
          <View className="flex-row items-center gap-1 mb-2">
            <MaterialIcons name="cancel" size={14} color={colors.error} />
            <Text className="text-xs font-semibold text-error">今日忌</Text>
          </View>
          <View className="flex-row flex-wrap gap-1">
            {lunarInfo.inauspicious?.slice(0, 4).map((item: string, index: number) => (
              <View
                key={index}
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: colors.error + '25' }}
              >
                <Text className="text-xs text-error">{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Food and Emotion Tips */}
      <View className="gap-2 pt-2 border-t" style={{ borderTopColor: colors.border }}>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <View className="flex-row items-center gap-1 mb-1">
              <MaterialIcons name="restaurant" size={14} color={colors.warning} />
              <Text className="text-xs font-semibold text-foreground">推荐食物</Text>
            </View>
            <Text className="text-xs text-foreground">{hour.food}</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1 mb-1">
              <MaterialIcons name="mood" size={14} color={colors.primary} />
              <Text className="text-xs font-semibold text-foreground">情志调理</Text>
            </View>
            <Text className="text-xs text-foreground">{hour.emotion}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
