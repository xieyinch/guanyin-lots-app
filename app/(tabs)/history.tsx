import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useLots } from '@/hooks/use-lots';
import { useCoinFlip } from '@/hooks/use-coin-flip';
import { useBagua } from '@/hooks/use-bagua';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

interface HistoryItem {
  id: string;
  type: 'lots' | 'coin' | 'bagua';
  data: any;
  timestamp: number;
}

export default function HistoryScreen() {
  const colors = useColors();
  const { history: lotsHistory, clearHistory: clearLotsHistory } = useLots();
  const { history: coinHistory, clearHistory: clearCoinHistory } = useCoinFlip();
  const { history: baguaHistory, clearHistory: clearBaguaHistory } = useBagua();

  const [allHistory, setAllHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const combined: HistoryItem[] = [
      ...lotsHistory.map((item) => ({
        id: item.id,
        type: 'lots' as const,
        data: item.lot,
        timestamp: item.timestamp,
      })),
      ...coinHistory.map((item) => ({
        id: item.id,
        type: 'coin' as const,
        data: item.result,
        timestamp: item.timestamp,
      })),
      ...baguaHistory.map((item) => ({
        id: item.id,
        type: 'bagua' as const,
        data: item.bagua,
        timestamp: item.timestamp,
      })),
    ].sort((a, b) => b.timestamp - a.timestamp);

    setAllHistory(combined);
  }, [lotsHistory, coinHistory, baguaHistory]);

  const handleClearAll = () => {
    Alert.alert(
      '清空所有历史记录',
      '确定要清空所有占卜历史吗？此操作无法撤销。',
      [
        { text: '取消', onPress: () => {}, style: 'cancel' },
        {
          text: '清空',
          onPress: async () => {
            await clearLotsHistory();
            await clearCoinHistory();
            await clearBaguaHistory();
            setAllHistory([]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {
      return '刚刚';
    }

    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}分钟前`;
    }

    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}小时前`;
    }

    return date.toLocaleDateString('zh-CN');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lots':
        return '灵签';
      case 'coin':
        return '硬币';
      case 'bagua':
        return '八卦';
      default:
        return '占卜';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lots':
        return '🎰';
      case 'coin':
        return '🪙';
      case 'bagua':
        return '☯️';
      default:
        return '✨';
    }
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    let title = '';
    let subtitle = '';

    if (item.type === 'lots') {
      title = item.data.name;
      subtitle = `第 ${item.data.id} 签 · ${item.data.grade}`;
    } else if (item.type === 'coin') {
      title = item.data === 'heads' ? '正面' : '反面';
      subtitle = item.data === 'heads' ? '吉祥如意' : '需要谨慎';
    } else if (item.type === 'bagua') {
      title = item.data.name;
      subtitle = item.data.meaning;
    }

    return (
      <View
        className="mx-4 my-2 p-4 rounded-lg flex-row items-center justify-between"
        style={{ backgroundColor: colors.surface }}
      >
        <View className="flex-row items-center gap-3 flex-1">
          <Text className="text-2xl">{getTypeIcon(item.type)}</Text>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-semibold text-muted">
                {getTypeLabel(item.type)}
              </Text>
            </View>
            <Text className="text-base font-semibold text-foreground">
              {title}
            </Text>
            <Text className="text-xs text-muted mt-1">
              {subtitle}
            </Text>
            <Text className="text-xs text-muted mt-1">
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (allHistory.length === 0) {
    return (
      <ScreenContainer className="items-center justify-center">
        <View className="items-center gap-4">
          <MaterialIcons name="history" size={48} color={colors.muted} />
          <Text className="text-lg font-semibold text-foreground">
            暂无占卜历史
          </Text>
          <Text className="text-sm text-muted text-center">
            开始占卜后，历史记录将显示在这里
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
          <View>
            <Text className="text-3xl font-bold text-foreground">
              占卜历史
            </Text>
            <Text className="text-sm text-muted">
              共 {allHistory.length} 条记录
            </Text>
          </View>
          <Pressable
            onPress={handleClearAll}
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
          data={allHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </View>
    </ScreenContainer>
  );
}
