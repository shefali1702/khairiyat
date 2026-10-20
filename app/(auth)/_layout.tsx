import { Stack } from 'expo-router';

import { useTheme } from '../../lib/theme';

export default function AuthLayout() {
  const { color } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.bg },
        // Each step rises gently into place.
        animation: 'fade_from_bottom',
      }}
    />
  );
}
