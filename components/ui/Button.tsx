import { ActivityIndicator, View, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { motion, radius, space, touch, useTheme, type ColorToken } from '../../lib/theme';
import { Icon, type IconName } from './Icon';
import { Pressy } from './Pressy';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet';

type Props = {
  /** Buttons name the outcome: "Save medication", not "Submit". */
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  /** Simple Mode targets are 64dp and the text is 24pt. */
  simple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  full?: boolean;
  /** Sits before the label. Inherits the button's foreground colour. */
  icon?: IconName;
  style?: ViewStyle;
};

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  simple = false,
  disabled = false,
  loading = false,
  full = false,
  icon,
  style,
}: Props) => {
  const { color } = useTheme();

  const background: Record<ButtonVariant, ColorToken | 'transparent'> = {
    primary: 'accent',
    secondary: 'surfaceRaised',
    quiet: 'transparent',
  };

  const foreground: Record<ButtonVariant, ColorToken> = {
    primary: 'onAccent',
    secondary: 'textPrimary',
    quiet: 'accent',
  };

  const bg = background[variant];
  const inactive = disabled || loading;

  const base: ViewStyle = {
    minHeight: simple ? touch.simple : touch.min,
    paddingHorizontal: space[5],
    paddingVertical: simple ? space[4] : space[3],
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: full ? 'stretch' : 'flex-start',
  };

  /* Primary dims under the finger; the others take on a deeper surface. A
     quiet button rests as a fully transparent copy of the colour it fills to,
     so the fade has no muddy midpoint on any background it sits on. */
  const rest = bg === 'transparent' ? `${color.surfaceRaised}00` : color[bg];
  const pressedBg: Record<ButtonVariant, string> = {
    primary: rest,
    secondary: color.border,
    quiet: color.surfaceRaised,
  };

  return (
    <Pressy
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      bg={rest}
      pressedBg={pressedBg[variant]}
      pressedOpacity={variant === 'primary' ? 0.85 : 1}
      restOpacity={inactive ? 0.45 : 1}
      style={[base, style]}
    >
      {loading ? (
        <Animated.View
          key="loading"
          entering={FadeIn.duration(motion.colorMs)}
          exiting={FadeOut.duration(motion.pressInMs)}
          style={{ height: simple ? space[7] : space[6], justifyContent: 'center' }}
        >
          <ActivityIndicator color={color[foreground[variant]]} />
        </Animated.View>
      ) : (
        <Animated.View
          key="label"
          entering={FadeIn.duration(motion.colorMs)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: space[2] }}
        >
          {icon ? (
            <Icon name={icon} size={simple ? space[6] : space[5]} color={foreground[variant]} />
          ) : null}
          <Text variant={simple ? 'simpleBody' : 'label'} color={foreground[variant]}>
            {label}
          </Text>
        </Animated.View>
      )}
    </Pressy>
  );
};
