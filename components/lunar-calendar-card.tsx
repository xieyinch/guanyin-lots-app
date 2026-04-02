import { View, Text, ScrollView } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { LunarInfo } from '@/hooks/use-lunar-calendar';

interface LunarCalendarCardProps {
  lunarInfo: LunarInfo | null;
}

export function LunarCalendarCard({ lunarInfo }: LunarCalendarCardProps) {
  const colors = useColors();

  if (!lunarInfo) {
    return null;
  }

  const today = new Date();
  const gregorianDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

  return (
    <View className="px-4 mb-4 gap-3">
      {/* Lunar Calendar Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="calendar-month" size={20} color={colors.primary} />
          <Text className="text-sm font-semibold text-primary">农历日历</Text>
        </View>
      </View>

      {/* Lunar Calendar Card */}
      <View
        className="rounded-2xl p-6 gap-4 border"
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        {/* Date Info */}
        <View className="gap-3">
          {/* Gregorian and Lunar Dates */}
          <View className="flex-row justify-between items-start gap-4">
            <View className="flex-1 gap-2">
              <Text className="text-xs font-semibold text-muted uppercase">公历</Text>
              <Text className="text-base font-bold text-foreground">{gregorianDate}</Text>
            </View>
            <View className="flex-1 gap-2">
              <Text className="text-xs font-semibold text-muted uppercase">农历</Text>
              <Text className="text-base font-bold text-primary">{lunarInfo.lunarDate}</Text>
            </View>
          </View>

          {/* Zodiac and Stem-Branch */}
          <View className="flex-row justify-between items-center pt-2 border-t" style={{ borderTopColor: colors.border }}>
            <View className="flex-1 gap-1">
              <Text className="text-xs text-muted">生肖</Text>
              <Text className="text-sm font-semibold text-foreground">{lunarInfo.zodiac}年</Text>
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-xs text-muted">干支</Text>
              <Text className="text-sm font-semibold text-foreground">{lunarInfo.stem}{lunarInfo.branch}</Text>
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-xs text-muted">五行</Text>
              <Text className="text-sm font-semibold text-foreground">{lunarInfo.fiveElements}</Text>
            </View>
          </View>
        </View>

        {/* Auspicious and Inauspicious */}
        <View className="gap-3 pt-2 border-t" style={{ borderTopColor: colors.border }}>
          {/* Auspicious */}
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <View className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }} />
              <Text className="text-xs font-semibold text-success uppercase">宜</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {lunarInfo.auspicious.map((item, index) => (
                <View
                  key={index}
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.success + '20' }}
                >
                  <Text className="text-xs text-success font-medium">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Inauspicious */}
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <View className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.error }} />
              <Text className="text-xs font-semibold text-error uppercase">忌</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {lunarInfo.inauspicious.map((item, index) => (
                <View
                  key={index}
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.error + '20' }}
                >
                  <Text className="text-xs text-error font-medium">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Lucky and Unlucky Gods */}
        <View className="gap-3 pt-2 border-t" style={{ borderTopColor: colors.border }}>
          <View className="flex-row justify-between gap-3">
            {/* Lucky Gods */}
            <View className="flex-1 gap-2">
              <Text className="text-xs font-semibold text-primary">吉神</Text>
              <View className="gap-1">
                {lunarInfo.luckyGods.map((god, index) => (
                  <Text key={index} className="text-xs text-primary">
                    {god}
                  </Text>
                ))}
              </View>
            </View>

            {/* Unlucky Gods */}
            <View className="flex-1 gap-2">
              <Text className="text-xs font-semibold text-error">凶神</Text>
              <View className="gap-1">
                {lunarInfo.unluckyGods.map((god, index) => (
                  <Text key={index} className="text-xs text-error">
                    {god}
                  </Text>
                ))}
              </View>
            </View>

            {/* Lucky Directions */}
            <View className="flex-1 gap-2">
              <Text className="text-xs font-semibold text-warning">吉方</Text>
              <View className="gap-1">
                {lunarInfo.luckyDirections.map((dir, index) => (
                  <Text key={index} className="text-xs text-warning">
                    {dir}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
