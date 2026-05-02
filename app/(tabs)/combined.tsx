import { useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useCombinedDivination, DivinationType } from '@/hooks/use-combined-divination';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

export default function CombinedDivinationScreen() {
  const colors = useColors();
  const {
    selectedTypes,
    toggleType,
    results,
    interpretation,
    isLoading,
    generateCombinedReading,
    reset,
  } = useCombinedDivination();

  const divinationTypes: { id: DivinationType; label: string; icon: string }[] = [
    { id: 'lots', label: '灵签', icon: '🎯' },
    { id: 'coin', label: '硬币', icon: '💰' },
    { id: 'bagua', label: '八卦', icon: '☯️' },
    { id: 'tarot', label: '塔罗', icon: '🎴' },
  ];

  const handleToggleType = (type: DivinationType) => {
    toggleType(type);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleGenerateReading = async () => {
    await generateCombinedReading();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleReset = () => {
    reset();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (results.length > 0 && interpretation) {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
            <Text className="text-3xl font-bold text-foreground">组合占卜</Text>
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <MaterialIcons name="refresh" size={24} color={colors.primary} />
            </Pressable>
          </View>

          {/* Results Cards */}
          <View className="mx-4 mb-4 gap-3">
            {results.map((result, index) => (
              <View
                key={index}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                <View className="flex-row items-center gap-3 mb-2">
                  <Text className="text-2xl">{result.icon}</Text>
                  <Text className="text-sm font-semibold text-muted">
                    {result.label}
                  </Text>
                </View>

                {result.type === 'lots' && (
                  <View className="gap-1">
                    <Text className="text-lg font-bold text-foreground">
                      {result.data.name}
                    </Text>
                    <Text className="text-xs text-muted">
                      第 {result.data.id} 签 · {result.data.grade}
                    </Text>
                  </View>
                )}

                {result.type === 'coin' && (
                  <View className="gap-1">
                    <Text className="text-lg font-bold text-foreground">
                      {result.data === 'heads' ? '正面' : '反面'}
                    </Text>
                    <Text className="text-xs text-muted">
                      {result.data === 'heads' ? '吉祥如意' : '需要谨慎'}
                    </Text>
                  </View>
                )}

                {result.type === 'bagua' && (
                  <View className="gap-1">
                    <Text className="text-lg font-bold text-foreground">
                      {result.data.name}
                    </Text>
                    <Text className="text-xs text-muted">{result.data.meaning}</Text>
                  </View>
                )}

                {result.type === 'tarot' && (
                  <View className="gap-1">
                    <Text className="text-lg font-bold text-foreground">
                      {result.data.name}
                      {result.data.isReversed && ' (逆位)'}
                    </Text>
                    <Text className="text-xs text-muted">
                      {result.data.isReversed
                        ? result.data.reversed
                        : result.data.meaning}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Interpretation */}
          <View className="mx-4 mb-6 gap-4">
            {/* Summary */}
            <View
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-sm font-semibold text-white mb-2">
                综合解读
              </Text>
              <Text className="text-base text-white leading-relaxed">
                {interpretation.summary}
              </Text>
            </View>

            {/* Analysis */}
            <View
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-sm font-semibold text-foreground mb-2">
                详细分析
              </Text>
              <Text className="text-sm text-foreground leading-relaxed">
                {interpretation.analysis}
              </Text>
            </View>

            {/* Advice */}
            <View
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-sm font-semibold text-foreground mb-2">
                建议
              </Text>
              <Text className="text-sm text-foreground leading-relaxed">
                {interpretation.advice}
              </Text>
            </View>

            {/* Harmony */}
            <View
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-sm font-semibold text-foreground mb-2">
                和谐度
              </Text>
              <Text className="text-sm text-foreground leading-relaxed">
                {interpretation.harmony}
              </Text>
            </View>
          </View>

          {/* Reset Button */}
          <View className="mx-4 mb-6">
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => [
                {
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.8 : 1,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text className="text-center text-base font-semibold text-foreground">
                重新占卜
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-3xl font-bold text-foreground">组合占卜</Text>
          <Text className="text-sm text-muted mt-1">
            选择多种占卜方式，获得综合解读
          </Text>
        </View>

        {/* Selection Grid */}
        <View className="mx-4 my-6 gap-3">
          <Text className="text-sm font-semibold text-foreground">
            选择占卜方式（至少选择2种）
          </Text>

          <View className="gap-2">
            {divinationTypes.map((type) => (
              <Pressable
                key={type.id}
                onPress={() => handleToggleType(type.id)}
                style={({ pressed }) => [
                  {
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    backgroundColor: selectedTypes.includes(type.id)
                      ? colors.primary
                      : colors.surface,
                    opacity: pressed ? 0.8 : 1,
                    borderWidth: selectedTypes.includes(type.id) ? 0 : 1,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-2xl">{type.icon}</Text>
                  <Text
                    className="text-base font-semibold"
                    style={{
                      color: selectedTypes.includes(type.id)
                        ? 'white'
                        : colors.foreground,
                    }}
                  >
                    {type.label}
                  </Text>
                  {selectedTypes.includes(type.id) && (
                    <View className="flex-1 items-end">
                      <MaterialIcons name="check-circle" size={20} color="white" />
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Info Card */}
        <View
          className="mx-4 mb-6 p-4 rounded-lg"
          style={{ backgroundColor: colors.surface }}
        >
          <View className="flex-row gap-3">
            <MaterialIcons name="info" size={20} color={colors.primary} />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground mb-1">
                如何使用
              </Text>
              <Text className="text-xs text-muted leading-relaxed">
                选择2种或以上的占卜方式，系统将为您进行多维度占卜，并根据各占卜方式的结果进行综合解读，帮助您获得更全面的参考。
              </Text>
            </View>
          </View>
        </View>

        {/* Generate Button */}
        <View className="mx-4 mb-6">
          <Pressable
            onPress={handleGenerateReading}
            disabled={selectedTypes.length < 2 || isLoading}
            style={({ pressed }) => [
              {
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor:
                  selectedTypes.length < 2 ? colors.muted : colors.primary,
                opacity: pressed && selectedTypes.length >= 2 ? 0.9 : 1,
              },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center text-base font-bold text-white">
                {selectedTypes.length < 2
                  ? '请至少选择2种占卜方式'
                  : '开始组合占卜'}
              </Text>
            )}
          </Pressable>
        </View>

        {/* Tips */}
        <View className="mx-4 mb-6 p-4 rounded-lg bg-opacity-10" style={{ backgroundColor: colors.primary }}>
          <Text className="text-xs text-foreground leading-relaxed">
            💡 提示：组合占卜可以从多个角度分析问题，帮助您做出更明智的决定。不同占卜方式的结果相互印证，增强了参考价值。
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
