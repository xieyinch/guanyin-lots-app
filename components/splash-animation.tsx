import React, { useEffect, useRef } from 'react';
import { Animated, View, Easing } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useColors } from '@/hooks/use-colors';

interface SplashAnimationProps {
  onAnimationComplete: () => void;
}

export function SplashAnimation({ onAnimationComplete }: SplashAnimationProps) {
  const colors = useColors();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const runAnimation = async () => {
      // Keep splash screen visible during animation
      await SplashScreen.preventAutoHideAsync();

      // Animate in the logo and text
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // Wait before fading out
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }).start(async () => {
          // Hide splash screen and trigger callback
          await SplashScreen.hideAsync();
          onAnimationComplete();
        });
      }, 1200);
    };

    runAnimation();
  }, [fadeAnim, scaleAnim, translateYAnim, onAnimationComplete]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        opacity: fadeAnim,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <Animated.View
        style={{
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        }}
      >
        <View className="items-center gap-4">
          {/* Logo */}
          <View
            className="w-24 h-24 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-5xl">🙏</Text>
          </View>

          {/* App Name */}
          <View className="items-center gap-2">
            <Text className="text-3xl font-bold text-foreground">观音灵签</Text>
            <Text className="text-sm text-muted">灵验卜卦 指点迷津</Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

import { Text } from 'react-native';
