import { Stack } from 'expo-router';

import { useTheme } from '../../lib/theme';

export default function SimpleLayout() {
  const { color } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.bg },
        // Calm, not spatial — the parent's app has nowhere to navigate to.
        animation: 'fade',
      }}
    />
  );
}
