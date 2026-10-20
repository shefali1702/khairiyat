import { useState } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import Animated from 'react-native-reanimated';

import { layout, motion, radius, space, touch, typeScale, useTheme } from '../../lib/theme';
import { Text } from './Text';

type Props = Omit<TextInputProps, 'style' | 'placeholderTextColor'> & {
  label?: string;
  /** Shown under the field. Say what happened and what to do. */
  hint?: string;
  invalid?: boolean;
};

/** The border warms to the accent while typing, and fades back on the way out. */
export const Field = ({ label, hint, invalid = false, onFocus, onBlur, ...rest }: Props) => {
  const { color } = useTheme();
  const [focused, setFocused] = useState(false);

  const border = invalid ? color.red : focused ? color.accent : color.border;

  return (
    <View style={{ gap: space[2] }}>
      {label ? (
        <Text variant="label" color={focused ? 'accent' : 'textSecondary'}>
          {label}
        </Text>
      ) : null}

      <Animated.View
        style={{
          backgroundColor: focused ? color.surface : color.surfaceRaised,
          borderColor: border,
          borderWidth: layout.hairline,
          borderRadius: radius.sm,
          transitionProperty: ['backgroundColor', 'borderColor'],
          transitionDuration: motion.colorMs,
        }}
      >
        <TextInput
          {...rest}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={color.textMuted}
          cursorColor={color.accent}
          style={[
            typeScale.body,
            {
              color: color.textPrimary,
              paddingHorizontal: space[4],
              paddingVertical: space[3],
              minHeight: touch.min,
            },
          ]}
        />
      </Animated.View>

      {hint ? (
        <Text variant="caption" color={invalid ? 'red' : 'textMuted'}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
};
