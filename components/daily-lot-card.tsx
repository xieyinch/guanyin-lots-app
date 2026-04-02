import { View, Text, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

interface DailyLotCardProps {
  lot: any;
  checkedIn: boolean;
  streak: number;
  onCheckIn: () => void;
  isLoading?: boolean;
}

export function DailyLotCard({
  lot,
  checkedIn,
  streak,
  onCheckIn,
  isLoading,
}: DailyLotCardProps) {
  const colors = useColors();

  if (!lot) {
    return null;
  }

  const handleCheckIn = () => {
    if (!checkedIn) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onCheckIn();
    }
  };

  return (
    <View className="px-0 mb-6 gap-3">
      {/* Daily Lot Header */}
      <View className="flex-row items-center justify-between px-4">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="today" size={20} color={colors.primary} />
          <Text className="text-sm font-semibold text-primary">每日一签</Text>
        </View>
        {streak > 0 && (
          <View className="flex-row items-center gap-1 px-3 py-1 rounded-full" style={{ backgroundColor: colors.warning }}>
            <Text className="text-sm">🔥</Text>
            <Text className="text-xs font-bold text-white">{streak}天</Text>
          </View>
        )}
      </View>

      {/* Daily Lot Card */}
      <View
        className="rounded-3xl p-6 gap-4 mx-4"
        style={{ 
          backgroundColor: colors.surface,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        {/* Lot Info */}
        <View className="gap-2">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-sm text-muted">第 {lot.id} 签</Text>
              <Text className="text-xl font-bold text-foreground mt-1">
                {lot.name}
              </Text>
            </View>
            <View
              className="px-3 py-1 rounded-full"
              style={{
                backgroundColor:
                  lot.grade === '上签'
                    ? colors.success
                    : lot.grade === '中签'
                    ? colors.warning
                    : colors.error,
              }}
            >
              <Text className="text-xs font-semibold text-white">
                {lot.grade}
              </Text>
            </View>
          </View>

          {/* Lot Poem */}
          <Text className="text-sm leading-relaxed text-muted italic">
            {lot.poem}
          </Text>

          {/* Lot Meaning */}
          <View className="pt-2 border-t" style={{ borderTopColor: colors.border }}>
            <Text className="text-xs font-semibold text-muted mb-1">含义</Text>
            <Text className="text-sm text-foreground">
              {lot.meaning}
            </Text>
          </View>
        </View>

        {/* Check In Button */}
        <Pressable
          onPress={handleCheckIn}
          disabled={checkedIn || isLoading}
          style={({ pressed }) => ({
            backgroundColor: checkedIn ? colors.success : colors.primary,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            opacity: pressed || checkedIn ? 0.85 : 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            shadowColor: checkedIn ? colors.success : colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 2,
          })}
        >
          <MaterialIcons
            name={checkedIn ? 'check-circle' : 'done'}
            size={18}
            color="white"
          />
          <Text className="text-center font-bold text-white text-base">
            {checkedIn ? '已打卡' : '今日打卡'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
