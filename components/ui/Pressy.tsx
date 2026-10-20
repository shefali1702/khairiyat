import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { motion } from '../../lib/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style' | 'children'> & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Resting and pressed backgrounds, already resolved from the theme. When
   *  both are set the press cross-fades between them. */
  bg?: string;
  pressedBg?: string;
  /** Dim instead of recolouring — for the accent-filled primary button. */
  pressedOpacity?: number;
  /** Opacity at rest — a disabled button is already dimmed. */
  restOpacity?: number;
};

/**
 * The one way anything is pressable in this app. It sinks a few percent under
 * the finger and springs back on release, so every tap gets the same quiet,
 * physical answer. Under reduced motion it only recolours.
 */
export const Pressy = ({
  children,
  style,
  bg,
  pressedBg,
  pressedOpacity = 1,
  restOpacity = 1,
  onPressIn,
  onPressOut,
  ...rest
}: Props) => {
  const reduceMotion = useReducedMotion();
  const pressed = useSharedValue(0);

  const animated = useAnimatedStyle(() => {
    const scale = reduceMotion ? 1 : 1 - pressed.value * (1 - motion.pressScale);

    return {
      transform: [{ scale }],
      opacity: restOpacity * (1 - pressed.value * (1 - pressedOpacity)),
      ...(bg && pressedBg
        ? { backgroundColor: interpolateColor(pressed.value, [0, 1], [bg, pressedBg]) }
        : null),
    };
  });

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(event) => {
        pressed.value = withTiming(1, { duration: motion.pressInMs });
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        pressed.value = withSpring(0, motion.spring);
        onPressOut?.(event);
      }}
      style={[style, animated]}
    >
      {children}
    </AnimatedPressable>
  );
};
