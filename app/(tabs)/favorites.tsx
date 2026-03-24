import { View, Text, FlatList, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useFavorites } from '@/hooks/use-favorites';
import { useLots } from '@/hooks/use-lots';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export default function FavoritesScreen() {
  const colors = useColors();
  const { favoriteIds, removeFavorite } = useFavorites();
  const { lots } = useLots();
  const [selectedLot, setSelectedLot] = useState(null);

  const favoriteLots = lots.filter(lot => favoriteIds.includes(lot.id));

  const getGradeColor = (grade: string) => {
    switch (grade) {
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

  const handleRemoveFavorite = async (lotId: number) => {
    await removeFavorite(lotId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const renderItem = ({ item }: any) => (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        className="mx-4 my-2 p-4 rounded-lg flex-row items-center justify-between"
        style={{ backgroundColor: colors.surface }}
      >
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-bold text-foreground">
              第 {item.id} 签
            </Text>
            <View
              className="px-2 py-1 rounded"
              style={{ backgroundColor: getGradeColor(item.grade) }}
            >
              <Text className="text-xs font-bold text-white">
                {item.grade}
              </Text>
            </View>
          </View>
          <Text className="text-base font-semibold text-foreground">
            {item.name}
          </Text>
        </View>
        <Pressable
          onPress={() => handleRemoveFavorite(item.id)}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <MaterialIcons name="favorite" size={24} color={colors.primary} />
        </Pressable>
      </View>
    </Pressable>
  );

  if (favoriteLots.length === 0) {
    return (
      <ScreenContainer className="items-center justify-center">
        <View className="items-center gap-4">
          <MaterialIcons name="favorite-border" size={48} color={colors.muted} />
          <Text className="text-lg font-semibold text-foreground">
            暂无收藏
          </Text>
          <Text className="text-sm text-muted">
            收藏喜欢的签文，方便随时查看
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 gap-4">
        {/* Header */}
        <View className="px-4 pt-4">
          <Text className="text-2xl font-bold text-foreground">
            我的收藏
          </Text>
          <Text className="text-sm text-muted mt-1">
            共 {favoriteLots.length} 个收藏
          </Text>
        </View>

        {/* Favorites List */}
        <FlatList
          data={favoriteLots}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </ScreenContainer>
  );
}
