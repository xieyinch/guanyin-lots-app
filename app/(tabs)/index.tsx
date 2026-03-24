import { useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, Animated } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useLots, Lot } from '@/hooks/use-lots';
import { useHistory } from '@/hooks/use-history';
import { useColors } from '@/hooks/use-colors';
import { LotCard } from '@/components/lot-card';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { useFavorites } from '@/hooks/use-favorites';

export default function HomeScreen() {
  const colors = useColors();
  const { lots, isLoading: lotsLoading, getRandomLot } = useLots();
  const { addRecord } = useHistory();
  const { isFavorited, toggleFavorite } = useFavorites();
  
  const [currentLot, setCurrentLot] = useState<Lot | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [spinValue] = useState(new Animated.Value(0));

  // Initialize with a random lot on first load
  useEffect(() => {
    if (!lotsLoading && lots.length > 0 && !currentLot) {
      const randomLot = getRandomLot();
      if (randomLot) {
        setCurrentLot(randomLot);
      }
    }
  }, [lotsLoading, lots]);

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
      const newLot = getRandomLot();
      if (newLot) {
        setCurrentLot(newLot);
        await addRecord(newLot);
        
        // Success haptic
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowDetail(true);
      }
      setIsDrawing(false);
    }, 1500);
  };

  const handleFavoritePress = async () => {
    if (currentLot) {
      await toggleFavorite(currentLot.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSharePress = async () => {
    if (currentLot) {
      try {
        const message = `观音灵签 - 第${currentLot.id}签 ${currentLot.name}\n\n签诗：\n${currentLot.poem}\n\n诗意：${currentLot.meaning}`;
        const uri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(message);
        await Sharing.shareAsync(uri, {
          mimeType: 'text/plain',
          UTI: 'public.plain-text',
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (lotsLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-muted">加载中...</Text>
      </ScreenContainer>
    );
  }

  if (showDetail && currentLot) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1">
          <LotCard
            lot={currentLot}
            isFavorited={isFavorited(currentLot.id)}
            onFavoritePress={handleFavoritePress}
            onSharePress={handleSharePress}
          />
          <Pressable
            onPress={() => setShowDetail(false)}
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
            观音灵签
          </Text>
          <Text className="text-base text-muted">
            点击下方按钮开始抽签
          </Text>
        </View>

        {/* Current Lot Preview */}
        {currentLot && (
          <View
            className="w-full rounded-2xl p-6 gap-4"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="items-center gap-2">
              <Text className="text-sm font-semibold text-muted">
                上次抽签
              </Text>
              <Text className="text-3xl font-bold text-foreground">
                {currentLot.name}
              </Text>
              <View
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor:
                    currentLot.grade === '上签'
                      ? colors.success
                      : currentLot.grade === '中签'
                      ? colors.warning
                      : colors.error,
                }}
              >
                <Text className="text-sm font-bold text-white">
                  {currentLot.grade}
                </Text>
              </View>
            </View>
            <Text className="text-sm text-foreground text-center leading-relaxed">
              {currentLot.poem}
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
            <MaterialIcons
              name="casino"
              size={48}
              color="white"
            />
          </Animated.View>
        </Pressable>

        {/* Button Label */}
        <Text className="text-lg font-semibold text-foreground">
          {isDrawing ? '抽签中...' : '点击抽签'}
        </Text>

        {/* Info Text */}
        <Text className="text-sm text-muted text-center">
          观音灵签共有100支，每支都蕴含着深刻的人生智慧
        </Text>
      </View>
    </ScreenContainer>
  );
}
