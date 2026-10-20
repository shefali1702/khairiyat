import { type ReactNode, useEffect } from 'react';
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import { motion } from '../../lib/theme';

type Props = {
  children: ReactNode;
  /** Index in the list — staggers entry by 40ms per row. */
  index?: number;
};

/**
 * Rows fade, rise 12px and settle to full size on mount, staggered, on a soft
 * spring. Once — nothing loops, nothing pulses, nothing shimmers. When a row
 * above is added or removed, the rest glide to their new place instead of
 * jumping. Skipped entirely when reduced motion is on.
 */
export const FadeIn = ({ children, index = 0 }: Props) => {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = 1;
      return;
    }
    const delay = index * motion.rowStaggerMs;
    progress.value = withDelay(delay, withSpring(1, motion.spring));
  }, [progress, index, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    // The spring may overshoot a hair; opacity must not.
    opacity: Math.min(progress.value, 1),
    transform: [
      { translateY: (1 - progress.value) * motion.rowRisePx },
      { scale: motion.rowScaleFrom + (1 - motion.rowScaleFrom) * progress.value },
    ],
  }));

  if (reduceMotion) return <>{children}</>;

  return (
    <Animated.View style={style} layout={LinearTransition.springify().damping(motion.spring.damping)}>
      {children}
    </Animated.View>
  );
};
