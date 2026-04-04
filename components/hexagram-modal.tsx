import { View, Text, Modal, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { Hexagram } from '@/hooks/use-random-hexagram';

interface HexagramModalProps {
  visible: boolean;
  hexagram: Hexagram | null;
  onClose: () => void;
}

export function HexagramModal({ visible, hexagram, onClose }: HexagramModalProps) {
  const colors = useColors();

  if (!hexagram) {
    return null;
  }

  const fortuneColors: Record<string, string> = {
    '大吉': '#22C55E',
    '吉': '#3B82F6',
    '中吉': '#F59E0B',
    '凶': '#EF4444',
  };

  const fortuneColor = fortuneColors[hexagram.fortune] || colors.primary;

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <View
          className="rounded-3xl p-6 gap-4 mx-6 max-w-sm"
          style={{
            backgroundColor: colors.surface,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* Header */}
          <View className="items-center gap-2">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="auto-awesome" size={24} color={colors.primary} />
              <Text className="text-lg font-bold text-foreground">随机卦象</Text>
            </View>
            <Text className="text-4xl">{hexagram.symbol}</Text>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: colors.border }} />

          {/* Hexagram Info */}
          <View className="gap-3">
            {/* Name and Meaning */}
            <View className="gap-1">
              <Text className="text-2xl font-bold text-foreground">{hexagram.name}</Text>
              <Text className="text-sm text-muted">{hexagram.meaning}</Text>
            </View>

            {/* Description */}
            <View
              className="p-3 rounded-2xl"
              style={{ backgroundColor: colors.primary + '10' }}
            >
              <Text className="text-sm text-foreground leading-relaxed">
                {hexagram.description}
              </Text>
            </View>

            {/* Advice */}
            <View
              className="p-3 rounded-2xl"
              style={{ backgroundColor: colors.warning + '15' }}
            >
              <View className="flex-row items-center gap-1 mb-1">
                <MaterialIcons name="lightbulb" size={16} color={colors.warning} />
                <Text className="text-xs font-semibold text-foreground">建议</Text>
              </View>
              <Text className="text-sm text-foreground leading-relaxed">
                {hexagram.advice}
              </Text>
            </View>

            {/* Fortune */}
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-foreground">运势</Text>
              <View
                className="px-4 py-2 rounded-full"
                style={{ backgroundColor: fortuneColor }}
              >
                <Text className="text-sm font-bold text-white">{hexagram.fortune}</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: colors.border }} />

          {/* Close Button */}
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="py-3 rounded-2xl items-center"
          >
            <Text className="text-white font-semibold">知道了</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
