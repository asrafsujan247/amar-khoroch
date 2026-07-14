import { forwardRef, useState } from 'react';
import type React from 'react';
import { TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui/Text';
import { colors, radii } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export type InputProps = TextInputProps & {
  /** Field label rendered above the input. */
  label?: string;
  /** Error message. When set, the border turns danger and this text shows below. */
  error?: string;
  /** Helper text shown below the field (hidden when `error` is set). */
  helperText?: string;
  /** Leading Ionicons glyph. */
  leftIcon?: IoniconName;
  /** Trailing Ionicons glyph. */
  rightIcon?: IoniconName;
  /** Style for the outer container (label + field + helper). */
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * The single text-field primitive for the app. Screens pick a semantic
 * layout (label / error / helper) rather than restyling raw `TextInput`s.
 * Focus and error states drive the border color; `style` still passes through
 * to the inner `TextInput` (used by `AmountInput` to enlarge the text).
 */
export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    containerStyle,
    style,
    onFocus,
    onBlur,
    accessibilityLabel,
    accessibilityHint,
    editable = true,
    ...rest
  },
  ref,
) {
  const [focused, setFocused] = useState(false);

  // Derive the handler types from the props so they track React Native's
  // TextInput focus/blur event typing across versions (RN 0.86 uses FocusEvent).
  const handleFocus: NonNullable<TextInputProps['onFocus']> = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur: NonNullable<TextInputProps['onBlur']> = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const borderColor = error
    ? colors.danger.DEFAULT
    : focused
      ? colors.primary[500]
      : colors.ink[300];

  const iconColor = error ? colors.danger.DEFAULT : focused ? colors.primary[500] : colors.ink[400];

  return (
    <View style={containerStyle}>
      {label ? (
        <Text variant="label" color="secondary" style={{ marginBottom: 6 }}>
          {label}
        </Text>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          height: 52,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor,
          borderRadius: radii.lg,
          backgroundColor: colors.surface,
          opacity: editable ? 1 : 0.6,
        }}
      >
        {leftIcon ? <Ionicons name={leftIcon} size={20} color={iconColor} /> : null}

        <TextInput
          ref={ref}
          style={[{ flex: 1, padding: 0, fontSize: 16, color: colors.ink[900] }, style]}
          placeholderTextColor={colors.ink[400]}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint ?? error ?? helperText}
          {...rest}
        />

        {rightIcon ? <Ionicons name={rightIcon} size={20} color={iconColor} /> : null}
      </View>

      {error ? (
        <Text variant="caption" color="danger" style={{ marginTop: 6 }}>
          {error}
        </Text>
      ) : helperText ? (
        <Text variant="caption" color="tertiary" style={{ marginTop: 6 }}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
});
