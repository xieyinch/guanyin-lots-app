import { View, Text } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

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

  const today = new Date();
  const gregorianDate = `${today.getMonth() + 1}/${today.getDate()}`;
  const lunarDate = `${lunarInfo.lunarMonth}月${lunarInfo.lunarDay}`;

  return (
    <View
      className="rounded-3xl overflow-hidden mb-6"
      style={{
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
      }}
    >
      <LinearGradient
        colors={[colors.surface, colors.surfaceElevated]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="p-5 gap-4"
      >
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-row items-center gap-3 flex-1">
            <View 
              className="w-12 h-12 rounded-2xl items-center justify-center"
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <Text className="text-2xl">{lunarInfo.zodiac}</Text>
            </View>
            <View className="flex-1 gap-0.5">
              <View className="flex-row items-baseline gap-2">
                <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
                  {gregorianDate}
                </Text>
                <Text className="text-sm" style={{ color: colors.muted }}>公历</Text>
              </View>
              <Text className="text-xs" style={{ color: colors.foregroundSecondary }}>
                农历{lunarDate} · {lunarInfo.stem}{lunarInfo.branch}
              </Text>
            </View>
          </View>
          
          {moonPhase && (
            <View 
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.backgroundSecondary }}
            >
              <Text className="text-xl">{moonPhase.emoji}</Text>
            </View>
          )}
        </View>

        <View className="flex-row gap-2">
          <View className="flex-1 p-3 rounded-2xl" style={{ backgroundColor: colors.backgroundSecondary }}>
            <View className="flex-row items-center gap-1.5 mb-1.5">
              <MaterialCommunityIcons name="yin-yang" size={14} color={colors.primary} />
              <Text className="text-xs font-semibold" style={{ color: colors.foreground }}>五行</Text>
            </View>
            <Text className="text-sm font-bold" style={{ color: colors.foreground }}>{lunarInfo.fiveElements}</Text>
          </View>
          <View className="flex-1 p-3 rounded-2xl" style={{ backgroundColor: colors.backgroundSecondary }}>
            <View className="flex-row items-center gap-1.5 mb-1.5">
              <MaterialIcons name="access-time" size={14} color={colors.primary} />
              <Text className="text-xs font-semibold" style={{ color: colors.foreground }}>时辰</Text>
            </View>
            <Text className="text-sm font-bold" style={{ color: colors.foreground }}>{hour.hour}</Text>
          </View>
        </View>

        {moonPhase && (
          <View 
            className="p-3 rounded-2xl"
            style={{ backgroundColor: colors.primary + '10' }}
          >
            <Text className="text-xs font-medium mb-1" style={{ color: colors.foregroundSecondary }}>
              月相：{moonPhase.name} ({moonPhase.illumination}%)
            </Text>
            <Text className="text-xs leading-relaxed" style={{ color: colors.foregroundSecondary }}>
              {moonPhase.influence}
            </Text>
          </View>
        )}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: elementColors[hour.element] || colors.primary }}
            />
            <Text className="text-sm font-bold" style={{ color: colors.foreground }}>{hour.element}时</Text>
          </View>
          <Text className="text-xs" style={{ color: colors.muted }}>{hour.time}</Text>
        </View>

        <View className="flex-row gap-4 pt-1">
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5 mb-2">
              <MaterialIcons name="check-circle" size={14} color={colors.success} />
              <Text className="text-xs font-semibold" style={{ color: colors.success }}>宜</Text>
            </View>
            <View className="flex-wrap flex-row gap-1.5">
              {hour.dos.slice(0, 3).map((item: string, index: number) => (
                <View
                  key={index}
                  className="px-2 py-1 rounded-lg"
                  style={{ backgroundColor: colors.success + '15' }}
                >
                  <Text className="text-xs" style={{ color: colors.success }}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5 mb-2">
              <MaterialIcons name="cancel" size={14} color={colors.error} />
              <Text className="text-xs font-semibold" style={{ color: colors.error }}>忌</Text>
            </View>
            <View className="flex-wrap flex-row gap-1.5">
              {hour.donts.slice(0, 3).map((item: string, index: number) => (
                <View
                  key={index}
                  className="px-2 py-1 rounded-lg"
                  style={{ backgroundColor: colors.error + '15' }}
                >
                  <Text className="text-xs" style={{ color: colors.error }}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
