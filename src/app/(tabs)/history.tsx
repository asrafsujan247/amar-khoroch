import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { Screen, Text } from '@/components/ui';
import { type DateRangeFilter } from '@/features/expenses/calculations';
import { HistoryFilterBar } from '@/features/history/components/HistoryFilterBar';
import { HistoryList } from '@/features/history/components/HistoryList';
import { HistorySearchInput } from '@/features/history/components/HistorySearchInput';
import { useHistoryData } from '@/features/history/useHistoryData';
import { useAppHydrated } from '@/store/hydration';
import { colors } from '@/theme';

/**
 * History — every expense, newest first, with search and date-range filters.
 *
 * Tapping a row opens the edit modal, which also owns deletion, so this screen
 * stays a pure list. The controls ride in the list header so they scroll away
 * and leave the full screen to the results.
 */
export default function HistoryScreen() {
  const [filter, setFilter] = useState<DateRangeFilter>('all');
  const [query, setQuery] = useState('');

  const hydrated = useAppHydrated();
  const { items, total, isEmpty, hasNoMatches } = useHistoryData(filter, query);

  // Memoized so typing in the search field doesn't remount the header (which
  // would drop the keyboard focus on every keystroke).
  const header = useMemo(
    () => (
      <View style={{ gap: 12, paddingBottom: 12 }}>
        <HistorySearchInput value={query} onChangeText={setQuery} />
        <HistoryFilterBar value={filter} onChange={setFilter} />
      </View>
    ),
    [query, filter],
  );

  if (!hydrated) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary[500]} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text variant="h1" style={{ marginTop: 8, marginBottom: 12 }}>
        History
      </Text>

      <HistoryList
        items={items}
        total={total}
        isEmpty={isEmpty}
        hasNoMatches={hasNoMatches}
        onPressItem={(id) => router.push({ pathname: '/expense/[id]', params: { id } })}
        ListHeaderComponent={header}
      />
    </Screen>
  );
}
