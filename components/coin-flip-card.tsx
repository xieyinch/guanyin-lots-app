import { View, Text, Pressable, Animated } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

interface CoinFlipCardProps {
  result: 'heads' | 'tails' | null;
  isFlipping: boolean;
  onFlip: () => void;
  spinValue?: Animated.Value;
}

/**
 * Component to display coin flip animation and result
 */
export function CoinFlipCard({
  result,
  isFlipping,
  onFlip,
  spinValue = new Animated.Value(0),
}: CoinFlipCardProps) {
  const colors = useColors();

  const handleFlip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onFlip();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const getResultText = () => {
    switch (result) {
      case 'heads':
        return '正面';
      case 'tails':
        return '反面';
      default:
        return '待抛硬币';
    }
  };

  const getResultColor = () => {
    switch (result) {
      case 'heads':
        return colors.success;
      case 'tails':
        return colors.warning;
      default:
        return colors.muted;
    }
  };

  const getResultDescription = () => {
    switch (result) {
      case 'heads':
        return '正面 - 吉祥如意';
      case 'tails':
        return '反面 - 需要谨慎';
      default:
        return '点击下方按钮开始抛硬币';
    }
  };

  return (
    <View className="gap-6 items-center">
      {/* Coin Display */}
      <View
        className="w-40 h-40 rounded-full items-center justify-center"
        style={{ backgroundColor: colors.surface }}
      >
        <Animated.View
          style={{
            transform: [{ rotateY: isFlipping ? spin : '0deg' }],
          }}
        >
          <View
            className="w-40 h-40 rounded-full items-center justify-center"
            style={{
              backgroundColor:
                result === 'heads'
                  ? colors.primary
                  : result === 'tails'
                  ? colors.warning
                  : colors.border,
            }}
          >
            {result === 'heads' ? (
              <MaterialIcons name="check-circle" size={80} color="white" />
            ) : result === 'tails' ? (
              <MaterialIcons name="cancel" size={80} color="white" />
            ) : (
              <MaterialIcons name="help" size={80} color={colors.muted} />
            )}
          </View>
        </Animated.View>
      </View>

      {/* Result Text */}
      <View className="items-center gap-2">
        <Text
          className="text-3xl font-bold"
          style={{ color: getResultColor() }}
        >
          {getResultText()}
        </Text>
        <Text className="text-sm text-muted text-center">
          {getResultDescription()}
        </Text>
      </View>

      {/* Flip Button */}
      <Pressable
        onPress={handleFlip}
        disabled={isFlipping}
        style={({ pressed }) => [
          {
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 8,
            backgroundColor: colors.primary,
            opacity: pressed || isFlipping ? 0.8 : 1,
          },
        ]}
      >
        <Text className="text-base font-semibold text-white">
          {isFlipping ? '抛硬币中...' : '抛硬币'}
        </Text>
      </Pressable>

      {/* Info Text */}
      <Text className="text-xs text-muted text-center max-w-xs">
        正面代表吉祥，反面需要谨慎。每次抛硬币的结果都会被记录。
      </Text>
    </View>
  );
}
