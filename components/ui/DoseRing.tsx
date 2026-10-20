import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { doseStateLabel } from '../../lib/doses';
import { motion, radius, useTheme } from '../../lib/theme';
import type { DoseState } from '../../lib/types';

/**
 * The signature element. One ring per dose, readable at a glance from arm's
 * length, encoding state in SHAPE as well as colour — hollow, filled, dotted,
 * slashed, dashed.
 *
 * Never rely on the colour alone. Older eyes and colour-blind judges both need
 * the shape, and the containing screen must still pair this with a text label.
 *
 * Geometry is authored in a 24-unit box and scaled by `size`, so the same
 * component serves the 12dp adherence grid cell, the dashboard row, the 64dp
 * Simple Mode cell and the full-screen confirmation.
 *
 * When the state changes while on screen — a caregiver watching Mum's dose
 * come in live — the ring springs into its new shape. Becoming taken is the
 * one celebratory moment: the disc lands, the check draws itself, and a single
 * halo leaves the ring. Once, never looping, and none of it under reduced
 * motion.
 */
type Props = {
  state: DoseState;
  size?: number;
  /**
   * What a screen reader says. Defaults to the same words the sighted label
   * uses, so the two can never drift apart.
   *
   * Pass a fuller sentence where the ring stands alone with no text beside it —
   * the fourteen-day adherence grid is the case that needs it, where every cell
   * is otherwise an unlabelled dot.
   */
  label?: string;
  /**
   * Set where a text label already sits next to the ring and would be read
   * twice. The shape still carries the state visually; it just stops being its
   * own stop in the screen reader's path.
   */
  decorative?: boolean;
  /** Play the arrival on mount too — the tap confirmation screen's hero. */
  animateIn?: boolean;
};

const BOX = 24;
const STROKE = 2;
const R = BOX / 2 - STROKE / 2;
const C = BOX / 2;

/** Length of the check path below, so its stroke can be drawn on. */
const CHECK = 15;

const AnimatedPath = Animated.createAnimatedComponent(Path);

const isTaken = (state: DoseState) => state === 'confirmed' || state === 'resolved_taken';

export const DoseRing = ({
  state,
  size = 20,
  label,
  decorative = false,
  animateIn = false,
}: Props) => {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();

  const arrive = animateIn && !reduceMotion;
  const pop = useSharedValue(arrive ? 0 : 1);
  const draw = useSharedValue(arrive ? 0 : 1);
  const halo = useSharedValue(1);
  const previous = useRef<DoseState | null>(animateIn ? null : state);

  useEffect(() => {
    if (previous.current === state) return;
    previous.current = state;

    if (reduceMotion) {
      pop.value = 1;
      draw.value = 1;
      return;
    }

    const taken = isTaken(state);
    pop.value = taken ? 0.35 : 0.7;
    pop.value = withSpring(1, taken ? motion.confirmSpring : motion.spring);

    draw.value = 0;
    draw.value = withDelay(
      motion.pressInMs,
      withTiming(1, { duration: motion.checkDrawMs, easing: Easing.out(Easing.cubic) }),
    );

    if (taken) {
      halo.value = 0;
      halo.value = withDelay(
        motion.pressInMs,
        withTiming(1, { duration: motion.haloMs, easing: Easing.out(Easing.quad) }),
      );
    }
  }, [state, reduceMotion, pop, draw, halo]);

  const ringStyle = useAnimatedStyle(() => ({
    opacity: Math.min(pop.value * 2, 1),
    transform: [{ scale: pop.value }],
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: (1 - halo.value) * 0.6,
    transform: [{ scale: 1 + halo.value * (motion.haloScaleTo - 1) }],
  }));

  const checkProps = useAnimatedProps(() => ({
    strokeDashoffset: CHECK * (1 - draw.value),
  }));

  const hollow = (stroke: string, dashed = false) => (
    <Circle
      cx={C}
      cy={C}
      r={R}
      stroke={stroke}
      strokeWidth={STROKE}
      fill="none"
      strokeDasharray={dashed ? '3 2.5' : undefined}
    />
  );

  const disc = (opacity = 1) => (
    <Circle cx={C} cy={C} r={BOX / 2} fill={color.accent} opacity={opacity} />
  );

  return (
    <View
      style={{ width: size, height: size }}
      accessible={!decorative}
      accessibilityRole={decorative ? 'none' : 'image'}
      accessibilityLabel={decorative ? undefined : (label ?? doseStateLabel(state))}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
    >
      {isTaken(state) ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: radius.full,
              borderWidth: Math.max((size * STROKE) / BOX, 1),
              borderColor: color.accent,
            },
            haloStyle,
          ]}
        />
      ) : null}

      <Animated.View style={ringStyle}>
        <Svg width={size} height={size} viewBox={`0 0 ${BOX} ${BOX}`}>
          {state === 'pending' && hollow(color.borderStrong)}

          {state === 'confirmed' && (
            <>
              {disc()}
              <AnimatedPath
                d="M7 12.5 L10.5 16 L17 8.5"
                stroke={color.onAccent}
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray={CHECK}
                animatedProps={checkProps}
              />
            </>
          )}

          {/* Taken, but not self-confirmed — a caregiver closed it out. */}
          {state === 'resolved_taken' && disc(0.45)}

          {state === 'unconfirmed' && (
            <>
              {hollow(color.amber)}
              <Circle cx={C} cy={C} r={3} fill={color.amber} />
            </>
          )}

          {state === 'resolved_missed' && (
            <>
              {hollow(color.red)}
              <Path
                d="M6.5 17.5 L17.5 6.5"
                stroke={color.red}
                strokeWidth={STROKE}
                strokeLinecap="round"
              />
            </>
          )}

          {state === 'resolved_unreachable' && hollow(color.textMuted, true)}
        </Svg>
      </Animated.View>
    </View>
  );
};
