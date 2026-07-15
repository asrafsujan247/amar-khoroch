import { Fragment, isValidElement, type ReactNode, Children } from 'react';
import { View } from 'react-native';

import { Card, Divider, Text } from '@/components/ui';
import { spacing } from '@/theme';

export type SettingsSectionProps = {
  /** Group heading, rendered as an uppercase overline above the card. */
  title: string;
  /** `SettingsRow`s (or any nodes) to render, hairline-separated in order. */
  children: ReactNode;
};

/**
 * A titled group of settings rows: an overline heading followed by one Card
 * holding the rows, separated by hairline dividers.
 *
 * The Card owns the horizontal padding (16) and the rows own their vertical
 * padding, so dividers stop level with the row content instead of running into
 * the card's rounded corners. The Card's vertical padding is trimmed to 4 so
 * that it plus a row's own 12 lands back on the same 16 as the sides, keeping
 * the group optically square.
 */
export function SettingsSection({ title, children }: SettingsSectionProps) {
  const items = Children.toArray(children);

  return (
    <View>
      <Text variant="overline" color="tertiary" style={{ marginBottom: spacing.sm }}>
        {title}
      </Text>

      <Card padded={false} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.xs }}>
        {items.map((child, index) => {
          const key =
            isValidElement(child) && child.key !== null ? child.key : `settings-item-${index}`;

          return (
            <Fragment key={key}>
              {index > 0 ? <Divider inset={0} /> : null}
              {child}
            </Fragment>
          );
        })}
      </Card>
    </View>
  );
}
