import { View, Text, Animated, ScrollView, Pressable, Platform, Easing } from 'react-native';
import { useState, useEffect, useRef } from 'react';
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
import { Ionicons } from '@expo/vector-icons/Ionicons';


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
  const [dailyLotModalVisible, setDailyLotModalVisible] = useState(false);

  // 多动画值
  const spinValue = useRef(new Animated.Value(0)).current;
  const coinFlipValue = useRef(new Animated.Value(0)).current;
  const baguaScaleValue = useRef(new Animated.Value(0)).current;
  const tarotShuffleValue = useRef(new Animated.Value(0)).current;
  const particlesOpacity = useRef(new Animated.Value(0)).current;

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

  // 动画插值
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1080deg'],
  });

  const coinFlip = coinFlipValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '180deg', '360deg'],
  });

  const baguaScale = baguaScaleValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.2, 1],
  });

  const baguaRotate = baguaScaleValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ['0deg', '90deg', '180deg', '270deg', '360deg'],
  });

  const tarotShuffle = tarotShuffleValue.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [-15, 15, -15, 15, 0],
  });

  const particle1 = particlesOpacity.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: [0, 1, 0.5, 0],
  });

  const particle2 = particlesOpacity.interpolate({
    inputRange: [0, 0.3, 0.6, 1],
    outputRange: [0, 0.5, 1, 0],
  });

  const handleDraw = async () => {
    if (isDrawing) return;

    setIsDrawing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // 重置动画值
    spinValue.setValue(0);
    coinFlipValue.setValue(0);
    baguaScaleValue.setValue(0);
    tarotShuffleValue.setValue(0);
    particlesOpacity.setValue(0);

    // 根据当前标签页播放不同动画
    if (activeTab === 'lots') {
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }).start();
    } else if (activeTab === 'coin') {
      Animated.sequence([
        Animated.delay(100),
        Animated.parallel([
          Animated.timing(coinFlipValue, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(particlesOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else if (activeTab === 'bagua') {
      Animated.parallel([
        Animated.timing(baguaScaleValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.elastic(1.5),
          useNativeDriver: true,
        }),
      ]).start();
    } else if (activeTab === 'tarot') {
      Animated.timing(tarotShuffleValue, {
        toValue: 1,
        duration: 1800,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start();
    }

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
    }, 1800);
  };

  const renderLotsContent = () => {
    const scaleAnimation = {
      transform: [{ scale: currentLot ? new Animated.Value(1) : new Animated.Value(0.9) }],
    };

    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4 pb-6">
          {currentLot ? (
            <Animated.View className="gap-4" style={scaleAnimation}>
              <View
                className="rounded-2xl p-6 gap-3"
                style={{ backgroundColor: colors.surface }}
              >
                <View className="flex-row justify-between items-center">
                  <View className="flex-1 gap-1">
                    <Text className="text-xs font-medium" style={{ color: colors.muted }}>第 {currentLot.id} 签</Text>
                    <Text className="text-2xl font-bold" style={{ color: colors.foreground }}>
                      {currentLot.name}
                    </Text>
                  </View>
                  <Ionicons name="ribbon" size={32} color={colors.primary} />
                </View>
                <View style={{ height: 1, backgroundColor: colors.border }} />
                <View className="flex-row justify-between items-center">
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
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.4,
                      shadowRadius: 6,
                      elevation: 6,
                    }}
                  >
                    <View className="flex-row items-center gap-1.5">
                      <Ionicons 
                        name={currentLot.grade === '上签' ? 'trophy' : currentLot.grade === '中签' ? 'star' : 'alert-circle'} 
                        size={16} 
                        color="white" 
                      />
                      <Text className="text-sm font-bold text-white">
                        {currentLot.grade}
                      </Text>
                    </View>
                  </View>
                  {isDrawing && (
                    <MaterialCommunityIcons name="sparkles" size={24} color={colors.primary} />
                  )}
                </View>
              </View>

              <View className="rounded-2xl p-5 gap-3" style={{ backgroundColor: colors.surface }}>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="reader-outline" size={20} color={colors.primary} />
                  <Text className="text-sm font-bold" style={{ color: colors.foreground }}>签诗</Text>
                </View>
                <View className="border-l-4 pl-4 py-2" style={{ borderLeftColor: colors.primary }}>
                  <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                    {currentLot.poem}
                  </Text>
                </View>
              </View>

              <View className="rounded-2xl p-5 gap-3" style={{ backgroundColor: colors.surface }}>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="bulb-outline" size={20} color={colors.primary} />
                  <Text className="text-sm font-bold" style={{ color: colors.foreground }}>解曰</Text>
                </View>
                <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                  {currentLot.interpretation}
                </Text>
              </View>

              <View className="rounded-2xl p-5 gap-3" style={{ backgroundColor: colors.surface }}>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                  <Text className="text-sm font-bold" style={{ color: colors.foreground }}>详解</Text>
                </View>
                <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                  {currentLot.details}
                </Text>
              </View>

              {currentLot.story && (
                <View className="rounded-2xl p-5 gap-3" style={{ backgroundColor: colors.surface }}>
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="book-outline" size={20} color={colors.primary} />
                    <Text className="text-sm font-bold" style={{ color: colors.foreground }}>典故</Text>
                  </View>
                  <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                    {currentLot.story}
                  </Text>
                </View>
              )}
            </Animated.View>
          ) : (
            <View className="flex-1 items-center justify-center py-12 gap-4">
              <Animated.View
                style={{
                  transform: [{
                    rotate: isDrawing ? spin : '0deg'
                  }],
                }}
              >
                {isDrawing ? (
                  <View className="w-20 h-20 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                    <Ionicons name="leaf-outline" size={40} color={colors.primary} />
                  </View>
                ) : (
                  <View className="w-20 h-20 rounded-full items-center justify-center" style={{ backgroundColor: colors.surface }}>
                    <Ionicons name="leaf-outline" size={40} color={colors.muted} />
                  </View>
                )}
              </Animated.View>
              <Text className="text-base text-center" style={{ color: colors.muted }}>
                {isDrawing ? '求签中...' : '点击下方按钮开始求签'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderCoinContent = () => (
    <View className="flex-1 items-center justify-center gap-8 relative">
      {/* 粒子效果 */}
      {isDrawing && (
        <>
          <Animated.View 
            className="absolute top-10 left-10 w-2 h-2 rounded-full"
            style={{
              backgroundColor: colors.primary,
              opacity: particle1,
              transform: [{ translateX: particlesOpacity.interpolate({ inputRange: [0, 1], outputRange: [0, 50] }) }],
            }}
          />
          <Animated.View 
            className="absolute top-10 right-10 w-2 h-2 rounded-full"
            style={{
              backgroundColor: colors.warning,
              opacity: particle1,
              transform: [{ translateX: particlesOpacity.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) }],
            }}
          />
          <Animated.View 
            className="absolute bottom-10 left-10 w-2 h-2 rounded-full"
            style={{
              backgroundColor: colors.success,
              opacity: particle2,
              transform: [{ translateX: particlesOpacity.interpolate({ inputRange: [0, 1], outputRange: [0, 40] }) }],
            }}
          />
          <Animated.View 
            className="absolute bottom-10 right-10 w-2 h-2 rounded-full"
            style={{
              backgroundColor: colors.accent,
              opacity: particle2,
              transform: [{ translateX: particlesOpacity.interpolate({ inputRange: [0, 1], outputRange: [0, -40] }) }],
            }}
          />
        </>
      )}

      {/* 硬币 */}
      <View
        className="w-48 h-48 rounded-full items-center justify-center"
        style={{
          backgroundColor: colors.surface,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 24,
          elevation: 12,
        }}
      >
        <Animated.View
          style={{
            transform: [{ rotateY: isDrawing ? coinFlip : '0deg' }],
          }}
        >
          <LinearGradient
            colors={
              coinResult === 'heads'
                ? [colors.primary, '#F59E0B']
                : coinResult === 'tails'
                ? [colors.warning, '#FBBF24']
                : [colors.border, colors.muted]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-48 h-48 rounded-full items-center justify-center"
          >
            <View className="w-40 h-40 rounded-full items-center justify-center" style={{ backgroundColor: colors.background + '30', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' }}>
              {coinResult === 'heads' ? (
                <View className="items-center gap-2">
                  <Ionicons name="checkmark-circle" size={64} color="white" />
                  <Text className="text-lg font-bold text-white">正面</Text>
                </View>
              ) : coinResult === 'tails' ? (
                <View className="items-center gap-2">
                  <Ionicons name="close-circle" size={64} color="white" />
                  <Text className="text-lg font-bold text-white">反面</Text>
                </View>
              ) : (
                <View className="items-center gap-2">
                  <View className="w-16 h-16 rounded-full items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <MaterialCommunityIcons name="yin-yang" size={48} color={colors.muted} />
                  </View>
                </View>
              )}
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      {coinResult && (
        <Animated.View 
          className="items-center gap-3"
          style={{
            opacity: coinResult ? new Animated.Value(1) : new Animated.Value(0),
          }}
        >
          <View className="flex-row items-center gap-3 px-6 py-3 rounded-full" style={{ backgroundColor: colors.surface }}>
            <Ionicons 
              name={coinResult === 'heads' ? 'sparkles' : 'alert-circle-outline'} 
              size={20} 
              color={coinResult === 'heads' ? colors.success : colors.warning} 
            />
            <Text
              className="text-xl font-bold"
              style={{ color: coinResult === 'heads' ? colors.success : colors.warning }}
            >
              {coinResult === 'heads' ? '正面 · 吉祥如意' : '反面 · 需要谨慎'}
            </Text>
          </View>
        </Animated.View>
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
            <Animated.View 
              className="items-center gap-4 p-8 rounded-2xl" 
              style={{ 
                backgroundColor: colors.surface,
                transform: [{ scale: baguaScale }],
              }}
            >
              <Animated.View
                style={{
                  transform: [{ rotate: baguaRotate }],
                }}
              >
                <View 
                  className="w-32 h-32 rounded-full items-center justify-center"
                  style={{ 
                    backgroundColor: colors.primary + '15',
                    borderWidth: 3,
                    borderColor: colors.primary,
                  }}
                >
                  <Text className="text-6xl">{currentBagua.symbol}</Text>
                </View>
              </Animated.View>
              <View className="items-center gap-1">
                <Text className="text-xs font-medium uppercase tracking-widest" style={{ color: colors.muted }}>Bagua</Text>
                <Text className="text-3xl font-bold" style={{ color: colors.foreground }}>
                  {currentBagua.name}
                </Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <Ionicons name="flash" size={16} color={colors.primary} />
                  <Text className="text-sm" style={{ color: colors.foregroundSecondary }}>{currentBagua.element}</Text>
                </View>
              </View>
            </Animated.View>

            <View className="p-5 rounded-2xl gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>含义</Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentBagua.meaning}
              </Text>
            </View>

            <View className="p-5 rounded-2xl gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <Ionicons name="bulb-outline" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>解释</Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentBagua.interpretation}
              </Text>
            </View>

            <View className="p-5 rounded-2xl gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <Ionicons name="trail-sign-outline" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>建议</Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentBagua.advice}
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-12 gap-4">
            <Animated.View
              style={{
                transform: [{
                  rotate: isDrawing ? spin : '0deg'
                }],
              }}
            >
              {isDrawing ? (
                <View className="w-20 h-20 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                  <MaterialCommunityIcons name="yin-yang" size={40} color={colors.primary} />
                </View>
              ) : (
                <View className="w-20 h-20 rounded-full items-center justify-center" style={{ backgroundColor: colors.surface }}>
                  <MaterialCommunityIcons name="yin-yang" size={40} color={colors.muted} />
                </View>
              )}
            </Animated.View>
            <Text className="text-base text-center" style={{ color: colors.muted }}>
              {isDrawing ? '起卦中...' : '点击下方按钮开始起卦'}
            </Text>
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
              <Animated.View
                style={{
                  transform: [{ rotateZ: isDrawing ? tarotShuffle : '0deg' }],
                }}
              >
                <View className="w-28 h-40 rounded-xl items-center justify-center" style={{ 
                    background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)`,
                    borderWidth: 2,
                    borderColor: colors.primary,
                  }}>
                  {isDrawing ? (
                    <MaterialCommunityIcons name="cards" size={64} color={colors.primary} />
                  ) : (
                    <Text className="text-7xl">🃏</Text>
                  )}
                </View>
              </Animated.View>
              <View className="items-center gap-2">
                <View className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.backgroundSecondary }}>
                  <Text className="text-xs font-medium uppercase tracking-wider" style={{ color: colors.muted }}>{currentTarot.suit}</Text>
                </View>
                <Text className="text-2xl font-bold text-center" style={{ color: colors.foreground }}>
                  {currentTarot.name}
                </Text>
                {currentTarot.isReversed && (
                  <View className="px-3 py-1 rounded-full" style={{ backgroundColor: colors.warning }}>
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="arrow-up-outline" size={14} color="white" />
                      <Text className="text-xs font-bold text-white">逆位</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            <View className="p-5 rounded-2xl gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>描述</Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentTarot.description}
              </Text>
            </View>

            <View className="p-5 rounded-2xl gap-3" style={{ backgroundColor: colors.surface }}>
              <View className="flex-row items-center gap-2">
                <Ionicons name="sparkles" size={20} color={colors.primary} />
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
                <Ionicons name="trail-sign-outline" size={20} color={colors.primary} />
                <Text className="text-sm font-bold" style={{ color: colors.foreground }}>建议</Text>
              </View>
              <Text className="text-base leading-relaxed" style={{ color: colors.foregroundSecondary }}>
                {currentTarot.advice}
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-12 gap-4">
            {isDrawing ? (
              <Animated.View
                style={{
                  transform: [{ rotate: spin }],
                }}
              >
                <MaterialIcons name="auto-fix" size={64} color={colors.primary} />
              </Animated.View>
            ) : (
              <View className="w-20 h-20 rounded-2xl items-center justify-center" style={{ backgroundColor: colors.surface, transform: [{ rotate: '45deg' }] }}>
                <Text className="text-5xl">🎴</Text>
              </View>
            )}
            <Text className="text-base text-center" style={{ color: colors.muted }}>
              {isDrawing ? '洗牌抽牌中...' : '点击下方按钮抽取塔罗牌'}
            </Text>
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
              <View className="flex-row items-center gap-2">
                <Text className="text-3xl font-bold" style={{ color: colors.foreground }}>观音灵签</Text>
                {isDrawing && (
                  <Animated.View className="flex-row items-center gap-1">
                    <MaterialCommunityIcons name="sparkles" size={20} color={colors.primary} />
                  </Animated.View>
                )}
              </View>
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
              <Ionicons name="calendar-outline" size={22} color={colors.primary} />
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
            className="rounded-2xl overflow-hidden"
            style={({ pressed }) => ({
              opacity: pressed || isDrawing ? 0.9 : 1,
              transform: pressed ? [{ scale: 0.98 }] : [],
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 16,
              elevation: 10,
            })}
          >
            <LinearGradient
              colors={isDrawing ? [colors.primary, colors.accent] : [colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl py-4 px-6"
            >
              <View className="flex-row items-center justify-center gap-3">
                {isDrawing ? (
                  <>
                    <Animated.View
                      style={{
                        transform: [{ rotate: spin }],
                      }}
                    >
                      <MaterialCommunityIcons name="magic-staff" size={24} color="white" />
                    </Animated.View>
                    <Text className="text-center font-bold text-white text-lg">
                      占卜中...
                    </Text>
                    <MaterialCommunityIcons name="sparkles" size={20} color="white" />
                  </>
                ) : (
                  <>
                    <Ionicons name="sparkles-outline" size={24} color="white" />
                    <Text className="text-center font-bold text-white text-lg">
                      开始占卜
                    </Text>
                    <Ionicons name="sparkles-outline" size={24} color="white" />
                  </>
                )}
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
