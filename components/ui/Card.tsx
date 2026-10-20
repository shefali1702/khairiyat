import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { layout, motion, radius, useTheme, type ColorToken } from '../../lib/theme';
import { Pressy } from './Pressy';

/** Amber and red are semantic only — unconfirmed and missed. Never decorative. */
export type CardTone = 'surface' | 'accent' | 'amber' | 'red';

const tones: Record<CardTone, { bg: ColorToken; border: ColorToken }> = {
  surface: { bg: 'surface', border: 'border' },
  accent: { bg: 'accentSurface', border: 'accentSurface' },
  amber: { bg: 'amberSurface', border: 'amberSurface' },
  red: { bg: 'redSurface', border: 'redSurface' },
};

type Props = {
  children: ReactNode;
  tone?: CardTone;
  onPress?: () => void;
  /** Layout only — never colour, size or radius. */
  style?: ViewStyle;
};

/**
 * No drop shadows anywhere in this app. Separation is by surface colour and a
 * 1px hairline border only — shadows are the fastest way to make a React
 * Native app look templated.
 *
 * A pressable card sinks under the finger and warms to the raised surface. A
 * card that changes tone — a dose coming in — cross-fades to its new colour.
 */
export const Card = ({ children, tone = 'surface', onPress, style }: Props) => {
  const { color } = useTheme();
  const palette = tones[tone];

  const base: ViewStyle = {
    backgroundColor: color[palette.bg],
    borderColor: color[palette.border],
    borderWidth: layout.hairline,
    borderRadius: radius.md,
    padding: layout.cardPad,
  };

  if (!onPress) {
    return (
      <Animated.View
        style={[
          base,
          {
            transitionProperty: ['backgroundColor', 'borderColor'],
            transitionDuration: motion.colorMs * 2,
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    );
  }

  return (
    <Pressy
      onPress={onPress}
      bg={color[palette.bg]}
      pressedBg={color.surfaceRaised}
      style={[base, style]}
    >
      {children}
    </Pressy>
  );
};
