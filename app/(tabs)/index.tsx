import { useState } from 'react';
import { View, Text, Animated, ScrollView, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { DivinationTabs, DivinationType } from '@/components/divination-tabs';
import { DailyLotCard } from '@/components/daily-lot-card';
import { useLots } from '@/hooks/use-lots';
import { useCoinFlip } from '@/hooks/use-coin-flip';
import { useBagua } from '@/hooks/use-bagua';
import { useDailyLot } from '@/hooks/use-daily-lot';
import { useLunarCalendar } from '@/hooks/use-lunar-calendar';
import { useColors } from '@/hooks/use-colors';
import { LunarCalendarCard } from '@/components/lunar-calendar-card';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const colors = useColors();
  const { getRandomLot } = useLots();
  const { flipCoin } = useCoinFlip();
  const { getRandomBagua } = useBagua();
  const { dailyLot, checkedIn, streak, checkIn, isLoading: dailyLoading } = useDailyLot();
  const { lunarInfo } = useLunarCalendar();

  const [activeTab, setActiveTab] = useState<DivinationType>('lots');
  const [isDrawing, setIsDrawing] = useState(false);
  const [spinValue] = useState(new Animated.Value(0));

  // Lots state
  const [currentLot, setCurrentLot] = useState<any>(null);

  // Coin state
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);

  // Bagua state
  const [currentBagua, setCurrentBagua] = useState<any>(null);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const handleDraw = async () => {
    if (isDrawing) return;

    setIsDrawing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    setTimeout(async () => {
      if (activeTab === 'lots') {
        const lot = await getRandomLot();
        setCurrentLot(lot);
      } else if (activeTab === 'coin') {
        const result = await flipCoin();
        setCoinResult(result);
      } else if (activeTab === 'bagua') {
        const bagua = await getRandomBagua();
        setCurrentBagua(bagua);
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsDrawing(false);
    }, 1500);
  };

  const renderLotsContent = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-4 pb-6">
        {currentLot ? (
          <>
            {/* Lot Number and Name */}
            <View
              className="rounded-2xl p-6 gap-3"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm text-muted">第 {currentLot.id} 签</Text>
                  <Text className="text-2xl font-bold text-foreground">
                    {currentLot.name}
                  </Text>
                </View>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      currentLot.grade === '上签'
                        ? colors.success
                        : currentLot.grade === '中签'
                        ? colors.warning
                        : colors.error,
                  }}
                >
                  <Text className="text-xs font-semibold text-white">
                    {currentLot.grade}
                  </Text>
                </View>
              </View>
            </View>

            {/* Lot Poem */}
            <View
              className="rounded-lg p-4 gap-2"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xs font-semibold text-muted uppercase">签诗</Text>
              <Text className="text-sm leading-relaxed text-foreground">
                {currentLot.poem}
              </Text>
            </View>

            {/* Lot Interpretation */}
            <View
              className="rounded-lg p-4 gap-2"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xs font-semibold text-muted uppercase">解曰</Text>
              <Text className="text-sm leading-relaxed text-foreground">
                {currentLot.interpretation}
              </Text>
            </View>

            {/* Lot Details */}
            <View
              className="rounded-lg p-4 gap-2"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xs font-semibold text-muted uppercase">详解</Text>
              <Text className="text-sm leading-relaxed text-foreground">
                {currentLot.details}
              </Text>
            </View>

            {/* Lot Story */}
            {currentLot.story && (
              <View
                className="rounded-lg p-4 gap-2"
                style={{ backgroundColor: colors.surface }}
              >
                <Text className="text-xs font-semibold text-muted uppercase">典故</Text>
                <Text className="text-sm leading-relaxed text-foreground">
                  {currentLot.story}
                </Text>
              </View>
            )}
          </>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted text-center">点击下方按钮抽签</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderCoinContent = () => (
    <View className="flex-1 items-center justify-center gap-6">
      <View
        className="w-32 h-32 rounded-full items-center justify-center"
        style={{ backgroundColor: colors.surface }}
      >
        <Animated.View
          style={{
            transform: [{ rotateY: isDrawing ? spin : '0deg' }],
          }}
        >
          <View
            className="w-32 h-32 rounded-full items-center justify-center"
            style={{
              backgroundColor:
                coinResult === 'heads'
                  ? colors.primary
                  : coinResult === 'tails'
                  ? colors.warning
                  : colors.border,
            }}
          >
            {coinResult === 'heads' ? (
              <MaterialIcons name="check-circle" size={64} color="white" />
            ) : coinResult === 'tails' ? (
              <MaterialIcons name="cancel" size={64} color="white" />
            ) : (
              <MaterialIcons name="help" size={64} color={colors.muted} />
            )}
          </View>
        </Animated.View>
      </View>

      {coinResult && (
        <View className="items-center gap-2">
          <Text
            className="text-2xl font-bold"
            style={{
              color:
                coinResult === 'heads' ? colors.success : colors.warning,
            }}
          >
            {coinResult === 'heads' ? '正面' : '反面'}
          </Text>
          <Text className="text-sm text-muted">
            {coinResult === 'heads' ? '吉祥如意' : '需要谨慎'}
          </Text>
        </View>
      )}
    </View>
  );

  const renderBaguaContent = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-4 pb-6">
        {currentBagua ? (
          <>
            {/* Bagua Symbol and Name */}
            <View className="items-center gap-3">
              <Text className="text-6xl">{currentBagua.symbol}</Text>
              <Text className="text-2xl font-bold text-foreground">
                {currentBagua.name}
              </Text>
            </View>

            {/* Bagua Meaning */}
            <View
              className="p-4 rounded-lg gap-2"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xs font-semibold text-muted uppercase">含义</Text>
              <Text className="text-sm leading-relaxed text-foreground">
                {currentBagua.meaning}
              </Text>
            </View>

            {/* Bagua Interpretation */}
            <View
              className="p-4 rounded-lg gap-2"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xs font-semibold text-muted uppercase">解释</Text>
              <Text className="text-sm leading-relaxed text-foreground">
                {currentBagua.interpretation}
              </Text>
            </View>

            {/* Bagua Advice */}
            <View
              className="p-4 rounded-lg gap-2"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-xs font-semibold text-muted uppercase">建议</Text>
              <Text className="text-sm leading-relaxed text-foreground">
                {currentBagua.advice}
              </Text>
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted text-center">点击下方按钮占卜</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <ScreenContainer className="p-0">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="px-4 pt-4 pb-4 gap-4">
          {/* Title */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">观音灵签</Text>
            <Text className="text-sm text-muted">选择占卜方式</Text>
          </View>

          {/* Daily Lot Card */}
          {dailyLot && (
            <DailyLotCard
              lot={dailyLot}
              checkedIn={checkedIn}
              streak={streak}
              onCheckIn={checkIn}
              isLoading={dailyLoading}
            />
          )}

          {/* Lunar Calendar Card */}
          <LunarCalendarCard lunarInfo={lunarInfo} />

          {/* Divination Type Tabs */}
          <DivinationTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content Area */}
          <View className="min-h-96">
            {activeTab === 'lots' && renderLotsContent()}
            {activeTab === 'coin' && renderCoinContent()}
            {activeTab === 'bagua' && renderBaguaContent()}
          </View>

          {/* Draw Button */}
          <Pressable
            onPress={handleDraw}
            disabled={isDrawing}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 8,
                opacity: pressed || isDrawing ? 0.8 : 1,
              },
            ]}
          >
            <Text className="text-center font-semibold text-white text-base">
              {isDrawing ? '占卜中...' : '开始占卜'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
