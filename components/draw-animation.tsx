import React, { useRef, useEffect } from 'react';
import { Animated, View, Easing } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface DrawAnimationProps {
  isDrawing: boolean;
  type: 'lots' | 'coin' | 'bagua' | 'tarot';
}

export function DrawAnimation({ isDrawing, type }: DrawAnimationProps) {
  const colors = useColors();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isDrawing) {
      // Reset animations
      rotateAnim.setValue(0);
      scaleAnim.setValue(1);
      bounceAnim.setValue(0);

      // Continuous rotation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Bounce effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop animations when done
      rotateAnim.setValue(0);
      scaleAnim.setValue(1);
      bounceAnim.setValue(0);
    }
  }, [isDrawing, rotateAnim, scaleAnim, bounceAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  const getIcon = () => {
    switch (type) {
      case 'lots':
        return '📜';
      case 'coin':
        return '🪙';
      case 'bagua':
        return '☯️';
      case 'tarot':
        return '🎴';
      default:
        return '✨';
    }
  };

  if (!isDrawing) return null;

  return (
    <View className="absolute inset-0 items-center justify-center pointer-events-none">
      {/* Outer rotating ring */}
      <Animated.View
        style={{
          transform: [{ rotate: spin }],
        }}
      >
        <View
          className="w-32 h-32 rounded-full border-4 border-transparent"
          style={{
            borderTopColor: colors.primary,
            borderRightColor: colors.primary,
          }}
        />
      </Animated.View>

      {/* Center bouncing icon */}
      <Animated.View
        style={{
          position: 'absolute',
          transform: [{ translateY: bounce }],
        }}
      >
        <View className="w-16 h-16 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary }}>
          <Text className="text-4xl">{getIcon()}</Text>
        </View>
      </Animated.View>

      {/* Particle effects */}
      {[0, 1, 2, 3].map((index) => (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [`${index * 90}deg`, `${index * 90 + 360}deg`],
                }),
              },
              {
                translateX: 60,
              },
            ],
          }}
        >
          <View
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.primary, opacity: 0.6 }}
          />
        </Animated.View>
      ))}
    </View>
  );
}

import { Text } from 'react-native';
