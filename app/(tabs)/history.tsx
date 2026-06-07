import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Alert, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useLots } from '@/hooks/use-lots';
import { useCoinFlip } from '@/hooks/use-coin-flip';
import { useBagua } from '@/hooks/use-bagua';
import { useDivinationStats } from '@/hooks/use-divination-stats';
import { DivinationStatsCard } from '@/components/divination-stats-card';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
  const { stats, timeRange, setTimeRange, totalCount, divinationStats } = useDivinationStats();

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

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    let title = '';
    let subtitle = '';
    let grade = '';

    if (item.type === 'lots') {
      title = item.data.name;
      subtitle = `第 ${item.data.id} 签`;
      grade = item.data.grade;
    } else if (item.type === 'coin') {
      title = item.data === 'heads' ? '正面' : '反面';
      subtitle = item.data === 'heads' ? '吉祥如意' : '需要谨慎';
    } else if (item.type === 'bagua') {
      title = item.data.name;
      subtitle = item.data.meaning;
    }

    return (
      <View
        className="mx-4 mb-3 p-4 rounded-2xl"
        style={{ 
          backgroundColor: colors.surface,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center gap-3">
          <View 
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            <Text className="text-2xl">
              {item.type === 'lots' ? '🎯' : item.type === 'coin' ? '💰' : '☯️'}
            </Text>
          </View>
          <View className="flex-1 gap-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium" style={{ color: colors.muted }}>
                {getTypeLabel(item.type)} · {formatTime(item.timestamp)}
              </Text>
              {grade && (
                <View 
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: getGradeColor(grade) + '20' }}
                >
                  <Text className="text-xs font-bold" style={{ color: getGradeColor(grade) }}>
                    {grade}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-base font-bold" style={{ color: colors.foreground }}>
              {title}
            </Text>
            <Text className="text-xs" style={{ color: colors.foregroundSecondary }}>
              {subtitle}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (allHistory.length === 0) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 items-center justify-center gap-6 px-8">
          <View 
            className="w-24 h-24 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.surface }}
          >
            <MaterialIcons name="history" size={48} color={colors.muted} />
          </View>
          <View className="items-center gap-2">
            <Text className="text-xl font-bold text-center" style={{ color: colors.foreground }}>
              暂无占卜历史
            </Text>
            <Text className="text-sm text-center" style={{ color: colors.muted }}>
              开始占卜后，历史记录将显示在这里
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-5 pt-4 pb-6 gap-6">
          <View className="flex-row items-center justify-between pt-2">
            <View className="flex-1">
              <Text className="text-3xl font-bold" style={{ color: colors.foreground }}>
                占卜历史
              </Text>
              <Text className="text-sm mt-1" style={{ color: colors.muted }}>
                共 {allHistory.length} 条记录
              </Text>
            </View>
            <Pressable
              onPress={handleClearAll}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
                backgroundColor: colors.error + '15',
                padding: 10,
                borderRadius: 12,
              })}
            >
              <MaterialIcons name="delete-outline" size={22} color={colors.error} />
            </Pressable>
          </View>

          <DivinationStatsCard
            stats={divinationStats}
            totalCount={totalCount}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />

          <View className="pb-4">
            <FlatList
              data={allHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
