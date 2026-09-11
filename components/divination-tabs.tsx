import { View, Text, Pressable } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type DivinationType = 'lots' | 'coin' | 'bagua' | 'tarot';

interface DivinationTabsProps {
  activeTab: DivinationType;
  onTabChange: (tab: DivinationType) => void;
}

const TAB_ICONS: Record<DivinationType, keyof typeof MaterialIcons.glyphMap> = {
  lots: 'auto-awesome',
  coin: 'monetization-on',
  bagua: 'blur-circular',
  tarot: 'style',
};

export function DivinationTabs({ activeTab, onTabChange }: DivinationTabsProps) {
  const colors = useColors();

  const tabs: { id: DivinationType; label: string }[] = [
    { id: 'lots', label: '灵签' },
    { id: 'coin', label: '硬币' },
    { id: 'bagua', label: '八卦' },
    { id: 'tarot', label: '塔罗' },
  ];

  return (
    <View className="flex-row gap-2 px-4 mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            style={({ pressed }) => [
              {
                flex: 1,
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderRadius: 14,
                backgroundColor: isActive ? colors.primary : colors.surface,
                opacity: pressed ? 0.75 : 1,
                borderWidth: isActive ? 0 : 1,
                borderColor: colors.border,
                shadowColor: isActive ? colors.primary : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isActive ? 0.3 : 0,
                shadowRadius: 5,
                elevation: isActive ? 3 : 0,
              },
            ]}
          >
            <View className="items-center gap-1.5">
              <MaterialIcons
                name={TAB_ICONS[tab.id]}
                size={22}
                color={isActive ? 'white' : colors.foreground}
              />
              <Text
                className="text-xs font-semibold leading-tight"
                style={{
                  color: isActive ? 'white' : colors.foreground,
                }}
              >
                {tab.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}