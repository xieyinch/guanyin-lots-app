import { View, Text, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-colors';

export type DivinationType = 'lots' | 'coin' | 'bagua' | 'tarot';

interface DivinationTabsProps {
  activeTab: DivinationType;
  onTabChange: (tab: DivinationType) => void;
}

export function DivinationTabs({ activeTab, onTabChange }: DivinationTabsProps) {
  const colors = useColors();

  const tabs: { id: DivinationType; label: string; icon: string }[] = [
    { id: 'lots', label: '灵签', icon: '🎯' },
    { id: 'coin', label: '硬币', icon: '💰' },
    { id: 'bagua', label: '八卦', icon: '☯️' },
    { id: 'tarot', label: '塔罗', icon: '🎴' },
  ];

  return (
    <View className="flex-row gap-2 px-2 mb-4">
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          className="flex-1 items-center"
          style={({ pressed }) => ({
            paddingVertical: 12,
            paddingHorizontal: 6,
            borderRadius: 16,
            backgroundColor: activeTab === tab.id ? colors.primary : colors.surface,
            opacity: pressed ? 0.85 : 1,
            transform: pressed ? [{ scale: 0.95 }] : [],
            shadowColor: activeTab === tab.id ? colors.primary : 'transparent',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: activeTab === tab.id ? 0.3 : 0,
            shadowRadius: 4,
            elevation: activeTab === tab.id ? 4 : 0,
          })}
        >
          <View className="items-center gap-1.5">
            <Text className="text-xl">{tab.icon}</Text>
            <Text
              className="text-xs font-bold tracking-wide"
              style={{
                color: activeTab === tab.id ? 'white' : colors.foregroundSecondary,
              }}
            >
              {tab.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
