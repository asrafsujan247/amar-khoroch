import { ScrollView } from 'react-native';

import { Chip } from '@/components/ui';
import { type DateRangeFilter } from '@/features/expenses/calculations';
import { spacing } from '@/theme';

export type HistoryFilterBarProps = {
  /** Currently active date range. */
  value: DateRangeFilter;
  /** Called with the tapped range. */
  onChange: (filter: DateRangeFilter) => void;
};

/**
 * The selectable ranges, in display order. Labels and order live here so the
 * bar stays the single place they are defined; the values map 1:1 onto
 * `DateRangeFilter`, so adding a range to that type surfaces here as a type error.
 */
const FILTERS: { value: DateRangeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

/**
 * Date-range filter for the History screen. Renders the fixed range set as a
 * single row of chips that scrolls horizontally, so the row never wraps or
 * clips on a narrow phone regardless of how many ranges exist.
 */
export function HistoryFilterBar({ value, onChange }: HistoryFilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: spacing.sm }}
      // The search field sits directly above: without this, the first tap on a
      // chip is swallowed by dismissing the keyboard instead of filtering.
      keyboardShouldPersistTaps="handled"
    >
      {FILTERS.map((filter) => (
        <Chip
          key={filter.value}
          label={filter.label}
          selected={value === filter.value}
          onPress={() => onChange(filter.value)}
          size="sm"
        />
      ))}
    </ScrollView>
  );
}
