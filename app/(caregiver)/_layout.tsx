import { Stack } from 'expo-router';

import { useTheme } from '../../lib/theme';

export default function CaregiverLayout() {
  const { color } = useTheme();

  // Pages slide in over the dashboard with it drifting back behind them.
  // Deciding what happened to a dose is a sheet — it rises from below and
  // leaves the dashboard where it was.
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.bg },
        animation: 'ios_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="resolve" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="scan" options={{ animation: 'fade_from_bottom' }} />
    </Stack>
  );
}
