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
    <View className="flex-row gap-2 px-4 mb-6">
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          onPress={() => onTabChange(tab.id)}
          style={({ pressed }) => [
            {
              flex: 1,
              paddingVertical: 14,
              paddingHorizontal: 8,
              borderRadius: 12,
              backgroundColor:
                activeTab === tab.id ? colors.primary : colors.surface,
              opacity: pressed ? 0.75 : 1,
              borderWidth: activeTab === tab.id ? 0 : 1,
              borderColor: colors.border,
            },
          ]}
        >
          <View className="items-center gap-2">
            <Text className="text-2xl">{tab.icon}</Text>
            <Text
              className="text-xs font-semibold leading-tight"
              style={{
                color:
                  activeTab === tab.id ? 'white' : colors.foreground,
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
