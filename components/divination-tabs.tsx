import { View, Text, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-colors';

export type DivinationType = 'lots' | 'coin' | 'bagua';

interface DivinationTabsProps {
  activeTab: DivinationType;
  onTabChange: (tab: DivinationType) => void;
}

export function DivinationTabs({ activeTab, onTabChange }: DivinationTabsProps) {
  const colors = useColors();

  const tabs: { id: DivinationType; label: string; icon: string }[] = [
    { id: 'lots', label: '灵签', icon: '🎰' },
    { id: 'coin', label: '硬币', icon: '🪙' },
    { id: 'bagua', label: '八卦', icon: '☯️' },
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
              paddingVertical: 12,
              paddingHorizontal: 8,
              borderRadius: 8,
              backgroundColor:
                activeTab === tab.id ? colors.primary : colors.surface,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <View className="items-center gap-1">
            <Text className="text-xl">{tab.icon}</Text>
            <Text
              className="text-xs font-semibold"
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
