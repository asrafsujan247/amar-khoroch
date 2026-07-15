import { View } from 'react-native';

import { IconButton, Input } from '@/components/ui';
import { colors, spacing } from '@/theme';

export type HistorySearchInputProps = {
  /** Current query text. */
  value: string;
  /** Called on every keystroke, and with `''` when the clear button is pressed. */
  onChangeText: (text: string) => void;
  /** Placeholder shown while the query is empty. Default `'Search expenses'`. */
  placeholder?: string;
};

/**
 * Height of the field row inside `Input`. Mirrored here so the overlaid clear
 * button can be centered on the row rather than on the whole container.
 */
const FIELD_HEIGHT = 52;

/** Diameter of the clear button. `IconButton` pads this out to a ~48px target. */
const CLEAR_SIZE = 32;

/**
 * Reserve enough room on the right of the text so a long query scrolls under
 * the caret instead of running beneath the clear button.
 */
const CLEAR_TEXT_INSET = 28;

/**
 * Search field for the History screen. Wraps the `Input` primitive and, once
 * there is a query to clear, overlays a pressable clear button on the right.
 *
 * The overlay exists because `Input`'s `rightIcon` takes an Ionicons name and
 * renders it as decoration only — it has no press handling — so a tappable
 * affordance has to be layered on top rather than passed in.
 */
export function HistorySearchInput({
  value,
  onChangeText,
  placeholder = 'Search expenses',
}: HistorySearchInputProps) {
  const showClear = value.length > 0;

  return (
    <View>
      <Input
        leftIcon="search-outline"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Search expenses"
        // `style` passes through to the inner TextInput.
        style={showClear ? { paddingRight: CLEAR_TEXT_INSET } : undefined}
      />

      {showClear ? (
        <IconButton
          icon="close-circle"
          onPress={() => onChangeText('')}
          accessibilityLabel="Clear search"
          size={CLEAR_SIZE}
          iconSize={18}
          variant="ghost"
          color={colors.ink[400]}
          style={{
            position: 'absolute',
            right: spacing.sm,
            top: (FIELD_HEIGHT - CLEAR_SIZE) / 2,
          }}
        />
      ) : null}
    </View>
  );
}
