import { useState, useEffect } from 'react';
import { View, Text, Animated, FlatList, Pressable, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useCoinFlip, CoinResult } from '@/hooks/use-coin-flip';
import { useColors } from '@/hooks/use-colors';
import { CoinFlipCard } from '@/components/coin-flip-card';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

export default function CoinScreen() {
  const colors = useColors();
  const { flipCoin, history, clearHistory, getStatistics } = useCoinFlip();
  
  const [currentResult, setCurrentResult] = useState<CoinResult | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [spinValue] = useState(new Animated.Value(0));

  const stats = getStatistics();

  const handleFlip = async () => {
    if (isFlipping) return;

    setIsFlipping(true);
    setShowHistory(false);

    // Spin animation
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Simulate flip delay
    setTimeout(async () => {
      const result = await flipCoin();
      setCurrentResult(result);
      
      // Success haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsFlipping(false);
    }, 1500);
  };

  const handleClearHistory = () => {
    Alert.alert(
      '清空硬币抛掷历史',
      '确定要清空所有硬币抛掷记录吗？此操作无法撤销。',
      [
        { text: '取消', onPress: () => {}, style: 'cancel' },
        {
          text: '清空',
          onPress: async () => {
            await clearHistory();
            setCurrentResult(null);
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

  const renderHistoryItem = ({ item }: any) => (
    <View
      className="mx-4 my-2 p-4 rounded-lg flex-row items-center justify-between"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{
            backgroundColor:
              item.result === 'heads' ? colors.success : colors.warning,
          }}
        >
          <MaterialIcons
            name={item.result === 'heads' ? 'check-circle' : 'cancel'}
            size={24}
            color="white"
          />
        </View>
        <View>
          <Text className="text-base font-semibold text-foreground">
            {item.result === 'heads' ? '正面' : '反面'}
          </Text>
          <Text className="text-xs text-muted">
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (showHistory && history.length > 0) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 pt-4">
            <Text className="text-2xl font-bold text-foreground">
              抛硬币历史
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

          {/* Statistics */}
          <View className="px-4 gap-2">
            <View
              className="p-4 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-sm text-muted mb-3">统计信息</Text>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-foreground">正面次数</Text>
                  <Text className="font-semibold text-foreground">
                    {stats.headsCount} ({stats.headsPercentage}%)
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-foreground">反面次数</Text>
                  <Text className="font-semibold text-foreground">
                    {stats.tailsCount} ({stats.tailsPercentage}%)
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-foreground">总次数</Text>
                  <Text className="font-semibold text-foreground">
                    {stats.total}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* History List */}
          <FlatList
            data={history}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          />

          {/* Back Button */}
          <Pressable
            onPress={() => setShowHistory(false)}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                marginHorizontal: 16,
                marginBottom: 16,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-center font-semibold text-white">
              返回
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="items-center justify-center p-6">
      <View className="gap-8 items-center flex-1 justify-center">
        {/* Title */}
        <View className="items-center gap-2">
          <Text className="text-4xl font-bold text-foreground">
            抛硬币占卜
          </Text>
          <Text className="text-base text-muted">
            正面为吉，反面需谨慎
          </Text>
        </View>

        {/* Coin Flip Card */}
        <CoinFlipCard
          result={currentResult}
          isFlipping={isFlipping}
          onFlip={handleFlip}
          spinValue={spinValue}
        />

        {/* History Button */}
        {history.length > 0 && (
          <Pressable
            onPress={() => setShowHistory(true)}
            style={({ pressed }) => [
              {
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: colors.primary,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="history" size={18} color={colors.primary} />
              <Text className="font-semibold" style={{ color: colors.primary }}>
                查看历史 ({history.length})
              </Text>
            </View>
          </Pressable>
        )}
      </View>
    </ScreenContainer>
  );
}
