import Animated from 'react-native-reanimated';

import { layout, motion, radius, useTheme } from '../../lib/theme';
import { Text } from './Text';

type Props = {
  name: string;
  size?: number;
  selected?: boolean;
};

const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();

export const Avatar = ({ name, size = 48, selected = false }: Props) => {
  const { color } = useTheme();

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: selected ? color.accent : color.surfaceRaised,
        borderColor: selected ? color.accent : color.border,
        borderWidth: layout.hairline,
        transitionProperty: ['backgroundColor', 'borderColor'],
        transitionDuration: motion.colorMs,
      }}
    >
      <Text variant="label" color={selected ? 'onAccent' : 'textSecondary'}>
        {initials(name)}
      </Text>
    </Animated.View>
  );
};
