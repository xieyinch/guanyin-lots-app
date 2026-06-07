import { View, Text, Pressable, Animated } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { Ionicons } from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export type DivinationType = 'lots' | 'coin' | 'bagua' | 'tarot';

interface DivinationTabsProps {
  activeTab: DivinationType;
  onTabChange: (tab: DivinationType) => void;
}

export function DivinationTabs({ activeTab, onTabChange }: DivinationTabsProps) {
  const colors = useColors();

  const tabs: { 
    id: DivinationType; 
    label: string; 
    icon: string;
    gradientIcon: React.ReactNode;
  }[] = [
    { 
      id: 'lots', 
      label: '灵签', 
      icon: 'leaf',
      gradientIcon: <Ionicons name="leaf" size={24} color="white" />
    },
    { 
      id: 'coin', 
      label: '硬币', 
      icon: 'cash-outline',
      gradientIcon: <Ionicons name="cash" size={24} color="white" />
    },
    { 
      id: 'bagua', 
      label: '八卦', 
      icon: 'body-outline',
      gradientIcon: <MaterialCommunityIcons name="yin-yang" size={22} color="white" />
    },
    { 
      id: 'tarot', 
      label: '塔罗', 
      icon: 'diamond-outline',
      gradientIcon: <Ionicons name="diamond" size={24} color="white" />
    },
  ];

  return (
    <View className="flex-row gap-2 px-2 mb-4 py-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            className="flex-1"
            style={({ pressed }) => ({
              paddingVertical: 10,
              paddingHorizontal: 4,
              borderRadius: 16,
              backgroundColor: isActive ? colors.primary : colors.surface,
              opacity: pressed ? 0.85 : 1,
              transform: pressed ? [{ scale: 0.95 }] : [],
              shadowColor: isActive ? colors.primary : 'transparent',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: isActive ? 0.4 : 0,
              shadowRadius: 6,
              elevation: isActive ? 6 : 0,
            })}
          >
            <View className="items-center gap-1.5">
              <View 
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ 
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : colors.backgroundSecondary,
                  transform: [{ scale: isActive ? 1.1 : 1 }],
                }}
              >
                {isActive ? tab.gradientIcon : (
                  <Ionicons 
                    name={tab.icon as any} 
                    size={20} 
                    color={colors.foregroundSecondary} 
                  />
                )}
              </View>
              <Text
                className="text-xs font-bold tracking-wide"
                style={{
                  color: isActive ? 'white' : colors.foregroundSecondary,
                }}
              >
                {tab.label}
              </Text>
              {isActive && (
                <View className="flex-row items-center gap-0.5">
                  <View className="w-1 h-1 rounded-full bg-white" />
                  <View className="w-1 h-1 rounded-full bg-white opacity-60" />
                  <View className="w-1 h-1 rounded-full bg-white opacity-60" />
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
