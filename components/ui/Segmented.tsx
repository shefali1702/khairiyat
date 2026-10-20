import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { layout, motion, radius, space, touch, useTheme } from '../../lib/theme';
import { Pressy } from './Pressy';
import { Text } from './Text';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * One accent pill slides under the chosen option instead of each option
 * repainting itself — the eye follows the selection rather than hunting for it.
 */
export const Segmented = <T extends string>({ options, value, onChange }: Props<T>) => {
  const { color } = useTheme();
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);

  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const segment = width / options.length;

  const position = useSharedValue(index);
  const placed = useSharedValue(false);

  useEffect(() => {
    // The first placement jumps; only later changes travel.
    if (!placed.value || reduceMotion || segment === 0) {
      position.value = index;
      placed.value = segment > 0;
      return;
    }
    position.value = withSpring(index, motion.spring);
  }, [index, segment, reduceMotion, position, placed]);

  const indicator = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value * segment }],
  }));

  return (
    <View
      style={{
        backgroundColor: color.surfaceRaised,
        borderColor: color.border,
        borderWidth: layout.hairline,
        borderRadius: radius.full,
        padding: space[1],
      }}
    >
      <View
        style={{ flexDirection: 'row' }}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      >
        {segment > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: segment,
                borderRadius: radius.full,
                backgroundColor: color.accent,
              },
              indicator,
            ]}
          />
        ) : null}

        {options.map((option) => {
          const selected = option.value === value;

          return (
            <Pressy
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(option.value)}
              style={{
                flex: 1,
                minHeight: touch.min - space[2],
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: space[3],
                borderRadius: radius.full,
              }}
            >
              <Text variant="label" color={selected ? 'onAccent' : 'textSecondary'}>
                {option.label}
              </Text>
            </Pressy>
          );
        })}
      </View>
    </View>
  );
};
