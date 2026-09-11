import { StyleSheet } from "react-native";
import type { ColorValue } from "react-native";
import { Tabs } from "expo-router";
import { useTheme } from "@/theme/ThemeContext";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type IconName = keyof typeof MaterialIcons.glyphMap;

function tabIcon(name: IconName, focused: boolean, color: ColorValue) {
  return <MaterialIcons name={name} size={focused ? 26 : 24} color={color} />;
}

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: theme.surface + "cc",
          borderTopColor: theme.surfaceGlassBorder,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        sceneStyle: { backgroundColor: theme.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "占卜",
          tabBarIcon: ({ color, focused }) => tabIcon("spa", focused, color),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "历史",
          tabBarIcon: ({ color, focused }) => tabIcon("history", focused, color),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "设置",
          tabBarIcon: ({ color, focused }) => tabIcon("settings", focused, color),
        }}
      />
    </Tabs>
  );
}