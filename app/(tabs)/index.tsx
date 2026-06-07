import { View, Text, Animated, ScrollView, Pressable, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { DivinationTabs, DivinationType } from '@/components/divination-tabs';
import { useLots } from '@/hooks/use-lots';
import { useCoinFlip } from '@/hooks/use-coin-flip';
import { useBagua } from '@/hooks/use-bagua';
import { useTarot } from '@/hooks/use-tarot';
import { useDailyLot } from '@/hooks/use-daily-lot';
import { useLunarCalendar } from '@/hooks/use-lunar-calendar';
import { useColors } from '@/hooks/use-colors';
import { CalendarHoursCard } from '@/components/calendar-hours-card';
import { useTCMHours } from '@/hooks/use-tcm-hours';
import { useRandomHexagram } from '@/hooks/use-random-hexagram';
import { HexagramModal } from '@/components/hexagram-modal';
import { DailyLotModal } from '@/components/daily-lot-modal';
import { useMoonPhase } from '@/hooks/use-moon-phase';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';


export default function HomeScreen() {
  const colors = useColors();
  const { getRandomLot } = useLots();
  const { flipCoin } = useCoinFlip();
  const { getRandomBagua } = useBagua();
  const { getRandomTarot } = useTarot();
  const { dailyLot, checkedIn, isLoading: dailyLoading, shouldShowModal, setShouldShowModal, checkIn } = useDailyLot();
  const { lunarInfo } = useLunarCalendar();
  const { currentHour } = useTCMHours();
  const { hexagram, isVisible, closeHexagram } = useRandomHexagram();
  const moonPhase = useMoonPhase();

  const [activeTab, setActiveTab] = useState<DivinationType>('lots');
  const [isDrawing, setIsDrawing] = useState(false);
  const [spinValue] = useState(new Animated.Value(0));
  const [dailyLotModalVisible, setDailyLotModalVisible] = useState(false);

  useEffect(() => {
    if (shouldShowModal && !dailyLotModalVisible) {
      setDailyLotModalVisible(true);
      setShouldShowModal(false);
    }
  }, [shouldShowModal, dailyLotModalVisible, setShouldShowModal]);

  const [currentLot, setCurrentLot] = useState<any>(null);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [currentBagua, setCurrentBagua] = useState<any>(null);
  const [currentTarot, setCurrentTarot] = useState<any>(null);

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
      } else if (activeTab === 'tarot') {
        const tarot = await getRandomTarot();
        setCurrentTarot(tarot);
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
          <View className="gap-4">
            <View
              className="rounded-2xl p-6 gap-3"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-xs font-medium" style={{ color: colors.muted }}>第 {currentLot.id} 签</Text>
                  <Text className="text-2xl font-bold mt-1" style={{ color: colors.foreground }}>
                    {currentLot.name}
                  </Text>
                </View>
                <View
                  className="px-4 py-2 rounded-full"
                  style={{
                    backgroundColor:
                      currentLot.grade === '上签'
                        ? colors.success
                        : currentLot.grade === '中签'
                        ? colors.warning
                        : colors.error,
                    shadowColor: currentLot.grade === '上签' ? colors.success : colors.error,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <Text className="text-sm font-bold text-white">
                    {currentLot.grade}
                  </Text>
                </View>
              </View>
            </View>

            <View className="rounded-2xl p-5 gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons name="format-quote-open" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>签诗</Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentLot.poem}
              </Text>
            </View>

            <View className="rounded-2xl p-5 gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="lightbulb-outline" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>解曰</Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentLot.interpretation}
              </Text>
            </View>

            <View className="rounded-2xl p-5 gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="description" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>详解</Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentLot.details}
              </Text>
            </View>

            {currentLot.story && (
              <View className="rounded-2xl p-5 gap-3" style={{ backgroundColor: colors.surface }}>
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="auto-stories" size={20} color={colors.primary} />
                  <Text className="text-sm font-bold" style={{ color: colors.foreground }}>典故</Text>
                </View>
                <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                  {currentLot.story}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-12 gap-4">
            <MaterialCommunityIcons name="hand-back-left-outline" size={64} color={colors.muted} />
            <Text className="text-base text-center" style={{ color: colors.muted }}>点击下方按钮开始占卜</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderCoinContent = () => (
    <View className="flex-1 items-center justify-center gap-8">
      <View
        className="w-40 h-40 rounded-full items-center justify-center"
        style={{ 
          backgroundColor: colors.surface,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Animated.View
          style={{
            transform: [{ rotateY: isDrawing ? spin : '0deg' }],
          }}
        >
          <View
            className="w-40 h-40 rounded-full items-center justify-center"
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
              <MaterialIcons name="check-circle" size={80} color="white" />
            ) : coinResult === 'tails' ? (
              <MaterialIcons name="close" size={80} color="white" />
            ) : (
              <MaterialIcons name="help-outline" size={80} color={colors.muted} />
            )}
          </View>
        </Animated.View>
      </View>

      {coinResult && (
        <View className="items-center gap-3">
          <Text
            className="text-3xl font-bold"
            style={{ color: coinResult === 'heads' ? colors.success : colors.warning }}
          >
            {coinResult === 'heads' ? '正面' : '反面'}
          </Text>
          <Text className="text-base" style={{ color: colors.foregroundSecondary }}>
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
          <View className="gap-4">
            <View 
              className="items-center gap-4 p-8 rounded-2xl" 
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-7xl">{currentBagua.symbol}</Text>
              <Text className="text-3xl font-bold" style={{ color: colors.foreground }}>
                {currentBagua.name}
              </Text>
            </View>

            <View className="p-5 rounded-2xl gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="info-outline" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>含义</Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentBagua.meaning}
              </Text>
            </View>

            <View className="p-5 rounded-2xl gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="lightbulb-outline" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>解释</Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentBagua.interpretation}
              </Text>
            </View>

            <View className="p-5 rounded-2xl gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="tips-and-updates" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>建议</Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentBagua.advice}
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-12 gap-4">
            <MaterialCommunityIcons name="yin-yang" size={64} color={colors.muted} />
            <Text className="text-base text-center" style={{ color: colors.muted }}>点击下方按钮开始占卜</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderTarotContent = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-4 pb-6">
        {currentTarot ? (
          <View className="gap-4">
            <View
              className="rounded-2xl p-8 gap-4 items-center"
              style={{ 
                backgroundColor: colors.surface,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <View className="w-24 h-32 rounded-lg items-center justify-center" style={{ backgroundColor: colors.backgroundSecondary }}>
                <Text className="text-6xl">🃏</Text>
              </View>
              <View className="items-center gap-2">
                <Text className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>{currentTarot.suit}</Text>
                <Text className="text-2xl font-bold text-center" style={{ color: colors.foreground }}>
                  {currentTarot.name}
                </Text>
                {currentTarot.isReversed && (
                  <View className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.warning }}>
                    <Text className="text-xs font-bold text-white">逆位</Text>
                  </View>
                )}
              </View>
            </View>

            <View className="p-5 rounded-2xl gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="description" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>描述</Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentTarot.description}
              </Text>
            </View>

            <View className="p-5 rounded-2xl gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="psychology" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>
                  {currentTarot.isReversed ? '逆位含义' : '正位含义'}
                </Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentTarot.isReversed ? currentTarot.reversed : currentTarot.meaning}
              </Text>
            </View>

            <View className="p-5 rounded-2xl gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="tips-and-updates" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>建议</Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentTarot.advice}
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-12 gap-4">
            <Text className="text-6xl">🎴</Text>
            <Text className="text-base text-center" style={{ color: colors.muted }}>点击下方按钮抽牌</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <ScreenContainer className="p-0" containerClassName={{ backgroundColor: colors.background }}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="px-5 pt-4 pb-6 gap-6">
          <View className="flex-row justify-between items-center gap-3 pt-2">
            <View className="flex-1 gap-1">
              <Text className="text-3xl font-bold" style={{ color: colors.foreground }}>观音灵签</Text>
              <Text className="text-sm" style={{ color: colors.muted }}>选择占卜方式</Text>
            </View>
            <Pressable
              onPress={() => setDailyLotModalVisible(true)}
              style={({ pressed }) => [{
                opacity: pressed ? 0.6 : 1,
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 10,
              }]}
            >
              <MaterialIcons name="calendar-today" size={22} color={colors.primary} />
            </Pressable>
          </View>

          <CalendarHoursCard lunarInfo={lunarInfo} hour={currentHour} moonPhase={moonPhase} />

          <DivinationTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <View 
            className="min-h-96 rounded-2xl p-4" 
            style={{ backgroundColor: colors.backgroundSecondary }}
          >
            {activeTab === 'lots' && renderLotsContent()}
            {activeTab === 'coin' && renderCoinContent()}
            {activeTab === 'bagua' && renderBaguaContent()}
            {activeTab === 'tarot' && renderTarotContent()}
          </View>

          <Pressable
            onPress={handleDraw}
            disabled={isDrawing}
            className="rounded-2xl"
            style={({ pressed }) => ({
              opacity: pressed || isDrawing ? 0.9 : 1,
              transform: pressed ? [{ scale: 0.98 }] : [],
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            })}
          >
            <LinearGradient
              colors={isDrawing ? [colors.primary, colors.primary] : [colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl py-4 px-6"
            >
              <View className="flex-row items-center justify-center gap-3">
                <MaterialCommunityIcons 
                  name={isDrawing ? 'loading' : 'magic-staff'} 
                  size={24} 
                  color="white" 
                  style={isDrawing ? { transform: [{ rotate: '45deg' }] } : {}}
                />
                <Text className="text-center font-bold text-white text-lg">
                  {isDrawing ? '占卜中...' : '开始占卜'}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>

      <HexagramModal visible={isVisible} hexagram={hexagram} onClose={closeHexagram} />

      <DailyLotModal
        visible={dailyLotModalVisible}
        onClose={() => setDailyLotModalVisible(false)}
      />
    </ScreenContainer>
  );
}
