import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "琉璃占卜",
  slug: "glass-divination",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./src/assets/icon.png",
  scheme: "glassdiv",
  userInterfaceStyle: "automatic",
  android: {
    package: "space.glass.divination",
    adaptiveIcon: {
      backgroundColor: "#000000",
      foregroundImage: "./src/assets/icon.png",
    },
    permissions: [],
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "space.glass.divination",
  },
  web: {
    bundler: "metro",
    output: "static",
  },
  plugins: [
    "expo-router",
    "expo-system-ui",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#000000",
        image: "./src/assets/icon.png",
        imageWidth: 200,
      },
    ],
    "./plugins/with-dynamic-colors",
  ],
  experiments: {
    typedRoutes: false,
  },
};

export default config;