import { View, Text, ScrollView } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface TCMHoursCardProps {
  hour: {
    hour: string;
    time: string;
    organ: string;
    element: string;
    advice: string;
    dos: string[];
    donts: string[];
    food: string;
    emotion: string;
  } | null;
}

export function TCMHoursCard({ hour }: TCMHoursCardProps) {
  const colors = useColors();

  if (!hour) {
    return null;
  }

  const elementColors: Record<string, string> = {
    '木': '#22C55E',
    '火': '#EF4444',
    '土': '#D4A574',
    '金': '#F59E0B',
    '水': '#3B82F6',
  };

  return (
    <View
      className="rounded-3xl p-5 gap-4 mx-4 mb-6"
      style={{
        backgroundColor: colors.surface,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      {/* Header */}
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="schedule" size={20} color={colors.primary} />
            <Text className="text-sm font-semibold text-primary">当前时辰</Text>
          </View>
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: elementColors[hour.element] || colors.primary }}
          >
            <Text className="text-xs font-bold text-white">{hour.element}</Text>
          </View>
        </View>

        {/* Hour and Time */}
        <View>
          <Text className="text-2xl font-bold text-foreground">{hour.hour}</Text>
          <Text className="text-sm text-muted">{hour.time}</Text>
        </View>
      </View>

      {/* Organ and Advice */}
      <View className="gap-2 pt-2 border-t" style={{ borderTopColor: colors.border }}>
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="favorite" size={16} color={colors.error} />
          <Text className="text-sm font-semibold text-foreground">对应器官: {hour.organ}</Text>
        </View>
        <Text className="text-sm text-foreground leading-relaxed">{hour.advice}</Text>
      </View>

      {/* Dos and Donts */}
      <View className="gap-3">
        {/* Dos */}
        <View className="gap-1">
          <View className="flex-row items-center gap-2">
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.success }}
            />
            <Text className="text-xs font-semibold text-success">宜做</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {hour.dos.map((item, index) => (
              <View
                key={index}
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: colors.success + '20' }}
              >
                <Text className="text-xs text-success">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Donts */}
        <View className="gap-1">
          <View className="flex-row items-center gap-2">
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.error }}
            />
            <Text className="text-xs font-semibold text-error">忌做</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {hour.donts.map((item, index) => (
              <View
                key={index}
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: colors.error + '20' }}
              >
                <Text className="text-xs text-error">{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Food and Emotion */}
      <View className="gap-2 pt-2 border-t" style={{ borderTopColor: colors.border }}>
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="restaurant" size={16} color={colors.warning} />
          <Text className="text-xs font-semibold text-foreground">推荐食物</Text>
        </View>
        <Text className="text-sm text-foreground">{hour.food}</Text>

        <View className="flex-row items-center gap-2 mt-2">
          <MaterialIcons name="mood" size={16} color={colors.primary} />
          <Text className="text-xs font-semibold text-foreground">情志调理</Text>
        </View>
        <Text className="text-sm text-foreground">{hour.emotion}</Text>
      </View>
    </View>
  );
}
