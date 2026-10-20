import { router } from 'expo-router';

import { space, touch } from '../../lib/theme';
import { Pressy } from './Pressy';
import { Text } from './Text';

/**
 * Caregiver screens have no header, so this is the only visible way back.
 * Simple Mode never uses it — the parent's app has no navigation at all.
 */
export const BackLink = ({ label = 'Back' }: { label?: string }) => (
  <Pressy
    accessibilityRole="button"
    onPress={() => router.back()}
    hitSlop={space[3]}
    pressedOpacity={0.6}
    style={{ minHeight: touch.min, justifyContent: 'center', alignSelf: 'flex-start' }}
  >
    <Text variant="label" color="accent">
      ‹ {label}
    </Text>
  </Pressy>
);
