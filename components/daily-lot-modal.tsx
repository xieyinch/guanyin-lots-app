import React from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { useDailyLot } from '@/hooks/use-daily-lot';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

interface DailyLotModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DailyLotModal({ visible, onClose }: DailyLotModalProps) {
  const colors = useColors();
  const { dailyLot, checkedIn, streak, checkIn } = useDailyLot();

  const handleCheckIn = async () => {
    await checkIn();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (!dailyLot) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <View
          className="rounded-t-3xl p-6 gap-4"
          style={{ backgroundColor: colors.background }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-bold text-foreground">每日一签</Text>
            <Pressable
              onPress={onClose}
              className="p-2"
              style={{ opacity: 0.6 }}
            >
              <MaterialIcons name="close" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Daily Lot Content */}
          <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
            {/* Lot Number and Name */}
            <View className="gap-2 mb-4">
              <Text
                className="text-lg font-semibold"
                style={{ color: colors.muted }}
              >
                第 {dailyLot.id} 签
              </Text>
              <Text className="text-3xl font-bold text-foreground">
                {dailyLot.name}
              </Text>
            </View>

            {/* Lot Grade */}
            <View className="mb-4 p-3 rounded-lg" style={{ backgroundColor: colors.surface }}>
              <Text
                className="text-sm font-semibold"
                style={{
                  color:
                    dailyLot.grade === '上签'
                      ? '#22C55E'
                      : dailyLot.grade === '中签'
                        ? '#F59E0B'
                        : '#EF4444',
                }}
              >
                {dailyLot.grade}
              </Text>
            </View>

            {/* Poem */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-muted mb-2">签诗</Text>
              <Text className="text-base leading-relaxed text-foreground">
                {dailyLot.poem}
              </Text>
            </View>

            {/* Meaning */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-muted mb-2">诗意</Text>
              <Text className="text-base leading-relaxed text-foreground">
                {dailyLot.meaning}
              </Text>
            </View>

            {/* Interpretation */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-muted mb-2">解曰</Text>
              <Text className="text-base leading-relaxed text-foreground">
                {dailyLot.interpretation}
              </Text>
            </View>

            {/* Story */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-muted mb-2">典故</Text>
              <Text className="text-base leading-relaxed text-foreground">
                {dailyLot.story}
              </Text>
            </View>
          </ScrollView>

          {/* Check In Button */}
          <Pressable
            onPress={handleCheckIn}
            disabled={checkedIn}
            className="p-4 rounded-xl items-center justify-center flex-row gap-2"
            style={{
              backgroundColor: checkedIn ? colors.muted : colors.primary,
              opacity: checkedIn ? 0.6 : 1,
            }}
          >
            <Text className="text-lg">{checkedIn ? '✓' : '🔥'}</Text>
            <Text className="text-base font-semibold text-white">
              {checkedIn ? `已打卡 (${streak}天)` : '今日打卡'}
            </Text>
          </Pressable>

          {/* Close Button */}
          <Pressable
            onPress={onClose}
            className="p-3 rounded-lg items-center"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-base font-semibold text-foreground">关闭</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
