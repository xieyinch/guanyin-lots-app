import { useState, useEffect } from 'react';
import { View, Text, Animated, FlatList, Pressable, Alert, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useBagua, Bagua } from '@/hooks/use-bagua';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

export default function BaguaScreen() {
  const colors = useColors();
  const { getRandomBagua, history, clearHistory } = useBagua();
  
  const [currentBagua, setCurrentBagua] = useState<Bagua | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [spinValue] = useState(new Animated.Value(0));

  const handleDraw = async () => {
    if (isDrawing) return;

    setIsDrawing(true);
    setShowDetail(false);

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Spin animation
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    // Simulate drawing delay
    setTimeout(async () => {
      const bagua = await getRandomBagua();
      if (bagua) {
        setCurrentBagua(bagua);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowDetail(true);
      }
      setIsDrawing(false);
    }, 1500);
  };

  const handleClearHistory = () => {
    Alert.alert(
      '清空八卦占卜历史',
      '确定要清空所有八卦占卜记录吗？此操作无法撤销。',
      [
        { text: '取消', onPress: () => {}, style: 'cancel' },
        {
          text: '清空',
          onPress: async () => {
            await clearHistory();
            setCurrentBagua(null);
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

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderHistoryItem = ({ item }: any) => (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        className="mx-4 my-2 p-4 rounded-lg"
        style={{ backgroundColor: colors.surface }}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-3">
            <Text className="text-3xl">{item.bagua.symbol}</Text>
            <View>
              <Text className="text-lg font-bold text-foreground">
                {item.bagua.name}
              </Text>
              <Text className="text-xs text-muted">
                {formatTime(item.timestamp)}
              </Text>
            </View>
          </View>
        </View>
        <Text className="text-sm text-muted">
          {item.bagua.meaning}
        </Text>
      </View>
    </Pressable>
  );

  if (showDetail && currentBagua) {
    return (
      <ScreenContainer className="bg-background">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4 p-4">
            {/* Bagua Symbol and Name */}
            <View className="items-center gap-3">
              <Text className="text-6xl">{currentBagua.symbol}</Text>
              <Text className="text-3xl font-bold text-foreground">
                {currentBagua.name}
              </Text>
            </View>

            {/* Meaning Section */}
            <View
              className="p-4 rounded-lg gap-2"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xs font-semibold text-muted uppercase">
                含义
              </Text>
              <Text className="text-sm leading-relaxed text-foreground">
                {currentBagua.meaning}
              </Text>
            </View>

            {/* Interpretation Section */}
            <View
              className="p-4 rounded-lg gap-2"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xs font-semibold text-muted uppercase">
                解释
              </Text>
              <Text className="text-sm leading-relaxed text-foreground">
                {currentBagua.interpretation}
              </Text>
            </View>

            {/* Advice Section */}
            <View
              className="p-4 rounded-lg gap-2"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xs font-semibold text-muted uppercase">
                建议
              </Text>
              <Text className="text-sm leading-relaxed text-foreground">
                {currentBagua.advice}
              </Text>
            </View>

            {/* Back Button */}
            <Pressable
              onPress={() => setShowDetail(false)}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-center font-semibold text-white">
                返回
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (showHistory && history.length > 0) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 gap-4">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 pt-4">
            <Text className="text-2xl font-bold text-foreground">
              八卦占卜历史
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
            八卦占卜
          </Text>
          <Text className="text-base text-muted">
            古老的智慧指引
          </Text>
        </View>

        {/* Current Bagua Preview */}
        {currentBagua && (
          <View
            className="w-full rounded-2xl p-6 gap-4 items-center"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="items-center gap-3">
              <Text className="text-sm font-semibold text-muted">
                上次占卜
              </Text>
              <Text className="text-5xl">{currentBagua.symbol}</Text>
              <Text className="text-2xl font-bold text-foreground">
                {currentBagua.name}
              </Text>
            </View>
            <Text className="text-sm text-foreground text-center leading-relaxed">
              {currentBagua.meaning}
            </Text>
          </View>
        )}

        {/* Draw Button */}
        <Pressable
          onPress={handleDraw}
          disabled={isDrawing}
          style={({ pressed }) => [
            {
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed || isDrawing ? 0.8 : 1,
              transform: [
                {
                  scale: pressed || isDrawing ? 0.95 : 1,
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={{
              transform: [{ rotate: isDrawing ? spin : '0deg' }],
            }}
          >
            <Text className="text-5xl">☯</Text>
          </Animated.View>
        </Pressable>

        {/* Button Label */}
        <Text className="text-lg font-semibold text-foreground">
          {isDrawing ? '占卜中...' : '点击占卜'}
        </Text>

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

        {/* Info Text */}
        <Text className="text-sm text-muted text-center">
          八卦是中国古代的占卜工具，代表自然界的八种现象
        </Text>
      </View>
    </ScreenContainer>
  );
}
