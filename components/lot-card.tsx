import { View, Text, ScrollView, Pressable } from 'react-native';
import { Lot } from '@/hooks/use-lots';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

interface LotCardProps {
  lot: Lot;
  isFavorited?: boolean;
  onFavoritePress?: () => void;
  onSharePress?: () => void;
}

/**
 * Component to display a single lot with all its information
 */
export function LotCard({
  lot,
  isFavorited = false,
  onFavoritePress,
  onSharePress,
}: LotCardProps) {
  const colors = useColors();

  // Determine grade color
  const getGradeColor = () => {
    switch (lot.grade) {
      case '上签':
        return colors.success;
      case '中签':
        return colors.warning;
      case '下签':
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const handleFavoritePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onFavoritePress?.();
  };

  const handleSharePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSharePress?.();
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-4 p-4">
        {/* Header with lot number and grade */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-muted">
              第 {lot.id} 签
            </Text>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: getGradeColor() }}
            >
              <Text className="text-xs font-bold text-white">
                {lot.grade}
              </Text>
            </View>
          </View>
          <Text className="text-3xl font-bold text-foreground">
            {lot.name}
          </Text>
        </View>

        {/* Poem Section */}
        <View
          className="p-4 rounded-lg gap-2"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-xs font-semibold text-muted uppercase">
            签诗
          </Text>
          <Text className="text-base leading-relaxed text-foreground">
            {lot.poem}
          </Text>
        </View>

        {/* Meaning Section */}
        <View
          className="p-4 rounded-lg gap-2"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-xs font-semibold text-muted uppercase">
            诗意
          </Text>
          <Text className="text-sm leading-relaxed text-foreground">
            {lot.meaning}
          </Text>
        </View>

        {/* Interpretation Section */}
        <View
          className="p-4 rounded-lg gap-2"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-xs font-semibold text-muted uppercase">
            解曰
          </Text>
          <Text className="text-sm leading-relaxed text-foreground">
            {lot.interpretation}
          </Text>
        </View>

        {/* Details Section */}
        <View
          className="p-4 rounded-lg gap-2"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-xs font-semibold text-muted uppercase">
            仙机
          </Text>
          <Text className="text-sm leading-relaxed text-foreground">
            {lot.details}
          </Text>
        </View>

        {/* Story Section */}
        <View
          className="p-4 rounded-lg gap-2"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-xs font-semibold text-muted uppercase">
            典故
          </Text>
          <Text className="text-sm leading-relaxed text-foreground">
            {lot.story}
          </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 pt-4">
          <Pressable
            onPress={handleFavoritePress}
            style={({ pressed }) => [
              {
                flex: 1,
                backgroundColor: colors.primary,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View className="flex-row items-center justify-center gap-2">
              <MaterialIcons
                name={isFavorited ? 'favorite' : 'favorite-border'}
                size={20}
                color="white"
              />
              <Text className="font-semibold text-white">
                {isFavorited ? '已收藏' : '收藏'}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={handleSharePress}
            style={({ pressed }) => [
              {
                flex: 1,
                backgroundColor: colors.primary,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View className="flex-row items-center justify-center gap-2">
              <MaterialIcons name="share" size={20} color="white" />
              <Text className="font-semibold text-white">分享</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
