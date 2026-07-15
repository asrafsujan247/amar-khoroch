import { View } from 'react-native';

import { IconButton, Text } from '@/components/ui';

export type MonthStepperProps = {
  /** Month label, e.g. "July 2026". */
  monthLabel: string;
  /** False when already on the current month — stepping into the future is blocked. */
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

/**
 * Previous / next month control for the Statistics screen. Forward stepping is
 * disabled on the current month so the user can never land on a future month
 * with no data.
 */
export function MonthStepper({ monthLabel, canGoNext, onPrev, onNext }: MonthStepperProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <IconButton
        icon="chevron-back"
        accessibilityLabel="Previous month"
        variant="soft"
        onPress={onPrev}
      />
      <Text variant="subtitle">{monthLabel}</Text>
      <IconButton
        icon="chevron-forward"
        accessibilityLabel="Next month"
        variant="soft"
        onPress={onNext}
        disabled={!canGoNext}
      />
    </View>
  );
}
