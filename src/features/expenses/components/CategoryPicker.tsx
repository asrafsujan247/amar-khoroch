import { View } from 'react-native';

import { Chip, Text } from '@/components/ui';
import { DAILY_CATEGORIES, MONTHLY_CATEGORIES, type CategoryMeta } from '@/constants/categories';
import { spacing } from '@/theme';
import { type CategoryId } from '@/types/expense';

export type CategoryPickerProps = {
  /** Currently selected category, or `null` while the form is incomplete. */
  value: CategoryId | null;
  /** Called with the category id when a chip is selected. */
  onChange: (id: CategoryId) => void;
  /** Error message shown below the groups. */
  error?: string;
  /** Field label rendered above the groups. Default `'Category'`. */
  label?: string;
};

/**
 * Category selector for the add/edit expense form. Renders the fixed category
 * set as wrapped chip groups — daily spend first, then monthly commitments —
 * so the whole set is visible at once without scrolling or a modal.
 */
export function CategoryPicker({
  value,
  onChange,
  error,
  label = 'Category',
}: CategoryPickerProps) {
  const renderGroup = (heading: string, categories: readonly CategoryMeta[]) => (
    <View>
      <Text variant="overline" color="tertiary" style={{ marginBottom: spacing.sm }}>
        {heading}
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {categories.map((cat) => (
          <Chip
            key={cat.id}
            label={cat.label}
            leftIcon={cat.icon}
            selected={value === cat.id}
            onPress={() => onChange(cat.id)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View>
      <Text variant="label" color="secondary" style={{ marginBottom: 6 }}>
        {label}
      </Text>

      <View style={{ gap: spacing.md }}>
        {renderGroup('DAILY', DAILY_CATEGORIES)}
        {renderGroup('MONTHLY', MONTHLY_CATEGORIES)}
      </View>

      {error ? (
        <Text variant="caption" color="danger" style={{ marginTop: 6 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
