import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useHistory } from '@/hooks/use-history';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function HistoryScreen() {
  const colors = useColors();
  const { history, clearHistory } = useHistory();
  const [refreshing, setRefreshing] = useState(false);

  // Reload history when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Reload history when screen is focused
    }, [])
  );

  const handleClearHistory = () => {
    Alert.alert(
      '清空历史记录',
      '确定要清空所有历史记录吗？此操作无法撤销。',
      [
        { text: '取消', onPress: () => {}, style: 'cancel' },
        {
          text: '清空',
          onPress: async () => {
            await clearHistory();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
          style: 'destructive',
        },
      ]
    );
  };

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

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    // Less than 1 minute
    if (diff < 60000) {
      return '刚刚';
    }

    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}分钟前`;
    }

    // Less than 1 day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}小时前`;
    }

    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}天前`;
    }

    // Format as date
    return date.toLocaleDateString('zh-CN');
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
              第 {item.lot.id} 签
            </Text>
            <View
              className="px-2 py-1 rounded"
              style={{ backgroundColor: getGradeColor(item.lot.grade) }}
            >
              <Text className="text-xs font-bold text-white">
                {item.lot.grade}
              </Text>
            </View>
          </View>
          <Text className="text-base font-semibold text-foreground">
            {item.lot.name}
          </Text>
          <Text className="text-xs text-muted">
            {formatTime(item.timestamp)}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
      </View>
    </Pressable>
  );

  if (history.length === 0) {
    return (
      <ScreenContainer className="items-center justify-center">
        <View className="items-center gap-4">
          <MaterialIcons name="history" size={48} color={colors.muted} />
          <Text className="text-lg font-semibold text-foreground">
            暂无历史记录
          </Text>
          <Text className="text-sm text-muted">
            开始抽签后，历史记录将显示在这里
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1 gap-4">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4">
          <Text className="text-2xl font-bold text-foreground">
            历史记录
          </Text>
          <Pressable
            onPress={handleClearHistory}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <MaterialIcons name="delete-outline" size={24} color={colors.error} />
          </Pressable>
        </View>

        {/* History List */}
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </ScreenContainer>
  );
}
