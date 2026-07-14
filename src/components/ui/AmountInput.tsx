import { useState } from 'react';
import { View } from 'react-native';

import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { colors, typography } from '@/theme';
import { CURRENCY_SYMBOL, formatCurrency, parseAmount } from '@/utils/currency';

export type AmountInputProps = {
  /** Current numeric value, or `null` when empty. */
  value: number | null;
  /** Emitted on every edit with the parsed value (`null` when empty/invalid). */
  onChangeValue: (value: number | null) => void;
  /** Field label rendered above the input. */
  label?: string;
  /** Error message; turns the border danger and shows below the field. */
  error?: string;
  /** Helper text shown below the field (hidden when `error` is set). */
  helperText?: string;
  /** Focus the field on mount. */
  autoFocus?: boolean;
  /** Placeholder shown when empty. Default `'0'`. */
  placeholder?: string;
};

/** Vertical space the label occupies above the field (line height + margin). */
const LABEL_OFFSET = (typography.label.lineHeight ?? 16) + 6;

/**
 * A money field built on top of `Input`. Renders the ৳ symbol as a large left
 * prefix and keeps an internal string so partial input like "12." survives.
 * Each edit parses to a number via `parseAmount`; the display only re-syncs
 * when `value` changes externally, so it never fights the user while typing.
 */
export function AmountInput({
  value,
  onChangeValue,
  label,
  error,
  helperText,
  autoFocus,
  placeholder = '0',
}: AmountInputProps) {
  const [text, setText] = useState<string>(() =>
    value == null ? '' : formatCurrency(value, { showSymbol: false }),
  );

  // Re-sync the displayed string when `value` changes from the outside to
  // something the current text doesn't already represent. Uses React's
  // "adjust state during render" pattern (guarded by the previous value)
  // instead of an effect, so there is no extra commit / cascading render.
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== parseAmount(text)) {
      setText(value == null ? '' : formatCurrency(value, { showSymbol: false }));
    }
  }

  const handleChangeText = (next: string) => {
    setText(next);
    onChangeValue(parseAmount(next));
  };

  return (
    <View style={{ position: 'relative' }}>
      <Input
        label={label}
        error={error}
        helperText={helperText}
        value={text}
        onChangeText={handleChangeText}
        keyboardType="decimal-pad"
        autoFocus={autoFocus}
        placeholder={placeholder}
        accessibilityLabel={label ?? 'Amount'}
        style={[typography.h2, { color: colors.ink[900], paddingLeft: 24 }]}
      />

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 16,
          top: label ? LABEL_OFFSET : 0,
          height: 52,
          justifyContent: 'center',
        }}
      >
        <Text variant="h2" weight="bold" color="secondary">
          {CURRENCY_SYMBOL}
        </Text>
      </View>
    </View>
  );
}
