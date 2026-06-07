import { View, Text, Pressable, Switch } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useColors } from '@/hooks/use-colors';
import { useThemeContext } from '@/lib/theme-provider';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const { setColorScheme } = useThemeContext();

  const handleThemeToggle = () => {
    const newScheme = colorScheme === 'dark' ? 'light' : 'dark';
    setColorScheme(newScheme);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1">
        <View className="px-5 pt-4 pb-6 gap-6">
          <View className="pt-2">
            <Text className="text-3xl font-bold" style={{ color: colors.foreground }}>
              设置
            </Text>
          </View>

          <View className="gap-3">
            <View 
              className="p-5 rounded-2xl flex-row items-center justify-between"
              style={{ 
                backgroundColor: colors.surface,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center gap-4 flex-1">
                <View 
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  style={{ backgroundColor: colors.primary + '20' }}
                >
                  <MaterialIcons
                    name={colorScheme === 'dark' ? 'dark-mode' : 'light-mode'}
                    size={26}
                    color={colors.primary}
                  />
                </View>
                <View className="flex-1 gap-1">
                  <Text className="text-base font-bold" style={{ color: colors.foreground }}>
                    深色模式
                  </Text>
                  <Text className="text-xs" style={{ color: colors.muted }}>
                    {colorScheme === 'dark' ? '已启用深色主题' : '当前为浅色主题'}
                  </Text>
                </View>
              </View>
              <Switch
                value={colorScheme === 'dark'}
                onValueChange={handleThemeToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-xs font-semibold px-2" style={{ color: colors.muted }}>
              关于应用
            </Text>
            <View 
              className="p-5 rounded-2xl gap-4"
              style={{ 
                backgroundColor: colors.surface,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <MaterialCommunityIcons name="application" size={20} color={colors.primary} />
                  <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                    应用版本
                  </Text>
                </View>
                <Text className="text-sm" style={{ color: colors.muted }}>
                  1.0.0
                </Text>
              </View>
              
              <View style={{ height: 0.5, backgroundColor: colors.border }} />
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <MaterialCommunityIcons name="book-open-page-variant" size={20} color={colors.primary} />
                  <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                    灵签数量
                  </Text>
                </View>
                <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
                  100 支
                </Text>
              </View>
              
              <View style={{ height: 0.5, backgroundColor: colors.border }} />
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <MaterialIcons name="stacked-line-chart" size={20} color={colors.primary} />
                  <Text className="text-sm font-medium" style={{ color: colors.foreground }}>
                    占卜方式
                  </Text>
                </View>
                <Text className="text-sm" style={{ color: colors.muted }}>
                  4 种
                </Text>
              </View>
            </View>
          </View>

          <View 
            className="p-5 rounded-2xl gap-3"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row items-center gap-2 mb-1">
              <MaterialCommunityIcons name="information-outline" size={18} color={colors.primary} />
              <Text className="text-sm font-bold" style={{ color: colors.foreground }}>关于观音灵签</Text>
            </View>
            <Text className="text-sm leading-relaxed" style={{ color: colors.foregroundSecondary }}>
              观音灵签是中国传统文化中的经典占卜工具，蕴含着深刻的人生智慧。每一支签文都代表着不同的人生境遇和指引，帮助我们在迷茫时找到方向。
            </Text>
          </View>

          <View className="items-center pt-4 pb-8">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialCommunityIcons name="heart" size={16} color={colors.error} />
              <Text className="text-xs" style={{ color: colors.muted }}>
                传承千年智慧
              </Text>
            </View>
            <Text className="text-xs" style={{ color: colors.muted }}>
              © 2026 观音灵签抽签
            </Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
