import { View, Text, Pressable, Switch } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useColors } from '@/hooks/use-colors';
import { useThemeContext } from '@/lib/theme-provider';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

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
      <View className="flex-1 gap-4">
        {/* Header */}
        <View className="px-4 pt-4">
          <Text className="text-2xl font-bold text-foreground">
            设置
          </Text>
        </View>

        {/* Settings Items */}
        <View className="gap-2 px-4">
          {/* Theme Setting */}
          <View
            className="p-4 rounded-lg flex-row items-center justify-between"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row items-center gap-3">
              <MaterialIcons
                name={colorScheme === 'dark' ? 'dark-mode' : 'light-mode'}
                size={24}
                color={colors.primary}
              />
              <View>
                <Text className="text-base font-semibold text-foreground">
                  深色模式
                </Text>
                <Text className="text-xs text-muted">
                  {colorScheme === 'dark' ? '已启用' : '已禁用'}
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

          {/* About Section */}
          <View className="mt-4">
            <Text className="text-xs font-semibold text-muted uppercase px-4 mb-2">
              关于
            </Text>
            <View
              className="p-4 rounded-lg gap-3"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">
                  应用版本
                </Text>
                <Text className="text-sm text-muted">
                  1.0.0
                </Text>
              </View>
              <View
                className="h-px"
                style={{ backgroundColor: colors.border }}
              />
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-foreground">
                  灵签数量
                </Text>
                <Text className="text-sm text-muted">
                  100 支
                </Text>
              </View>
            </View>
          </View>

          {/* Info Section */}
          <View className="mt-6 px-4 gap-2">
            <Text className="text-sm text-muted leading-relaxed">
              观音灵签是中国传统文化中的经典占卜工具，蕴含着深刻的人生智慧。每一支签文都代表着不同的人生境遇和指引。
            </Text>
            <Text className="text-xs text-muted">
              © 2026 观音灵签抽签软件
            </Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
