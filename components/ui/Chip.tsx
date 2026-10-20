import Animated from 'react-native-reanimated';

import { layout, motion, radius, space, touch, useTheme } from '../../lib/theme';
import { Pressy } from './Pressy';
import { Text } from './Text';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

/**
 * Time chips toggle on tap. Never open a time-picker dialog per row — that
 * friction is what makes the add-medication screen fail.
 *
 * Selection cross-fades rather than snapping, so a row of chips being toggled
 * reads as one calm gesture.
 */
export const Chip = ({ label, selected, onPress }: Props) => {
  const { color } = useTheme();

  return (
    <Pressy
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{ borderRadius: radius.full }}
    >
      <Animated.View
        style={{
          minHeight: touch.min,
          justifyContent: 'center',
          paddingHorizontal: space[4],
          borderRadius: radius.full,
          borderWidth: layout.hairline,
          backgroundColor: selected ? color.accentSurface : color.surfaceRaised,
          borderColor: selected ? color.accent : color.border,
          transitionProperty: ['backgroundColor', 'borderColor'],
          transitionDuration: motion.colorMs,
        }}
      >
        <Text variant="label" color={selected ? 'accent' : 'textSecondary'}>
          {label}
        </Text>
      </Animated.View>
    </Pressy>
  );
};
