import { memo, useCallback, useMemo, type ReactElement } from 'react';
import { FlatList, View, type ListRenderItem, type ViewStyle } from 'react-native';

import { Divider, EmptyState, Text } from '@/components/ui';
import { spacing } from '@/theme';
import { ExpenseRow } from '@/features/expenses/components/ExpenseRow';
import { type ExpenseListItem } from '@/features/expenses/types';
import { useMoney } from '@/hooks/useMoney';

type RowProps = {
  /** The expense to render. */
  item: ExpenseListItem;
  /** Stable handler from the list; receives the expense id. */
  onPressItem: (id: string) => void;
};

/**
 * Adapts an `ExpenseListItem` to the shared `ExpenseRow`'s zero-arg `onPress`.
 *
 * Exists purely so the press handler can be memoized per row: `ExpenseRow` is
 * `memo`ized, so handing it a fresh inline closure on every list render would
 * defeat that. Both of this component's props are referentially stable, so a
 * row only re-renders when its own expense changes.
 */
const Row = memo(function Row({ item, onPressItem }: RowProps) {
  const handlePress = useCallback(() => onPressItem(item.id), [onPressItem, item.id]);

  return <ExpenseRow expense={item} onPress={handlePress} />;
});

/** Module-level so the reference never changes between renders. */
const keyExtractor = (item: ExpenseListItem): string => item.id;

/** Module-level: a changing component identity would remount every separator. */
const Separator = () => <Divider inset={0} />;

/** `flexGrow` lets the empty state fill the viewport so it centres vertically. */
const contentContainerStyle: ViewStyle = {
  flexGrow: 1,
  paddingBottom: spacing['2xl'],
};

const summaryStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: spacing.md,
};

export type HistoryListProps = {
  /** Filtered + searched expenses, newest first (presentation-ready). */
  items: ExpenseListItem[];
  /** Sum of the visible items, shown in the summary row. */
  total: number;
  /** True when the user has no expenses at all. */
  isEmpty: boolean;
  /** True when expenses exist but filters/search hid them all. */
  hasNoMatches: boolean;
  /** Called with the expense id when a row is pressed. */
  onPressItem: (id: string) => void;
  /** Search + filter controls, rendered above the summary so they scroll away. */
  ListHeaderComponent?: ReactElement;
};

/**
 * The History screen's expense list: the caller's search/filter controls, a
 * count + total summary, then the expense rows separated by thin dividers.
 *
 * A `FlatList` rather than a mapped ScrollView because the history grows
 * unbounded — windowing keeps memory flat as the user accumulates expenses.
 * Distinguishes "no expenses yet" from "nothing matched" so the empty state
 * tells the user what to actually do next.
 */
export function HistoryList({
  items,
  total,
  isEmpty,
  hasNoMatches,
  onPressItem,
  ListHeaderComponent,
}: HistoryListProps) {
  const money = useMoney();

  const renderItem = useCallback<ListRenderItem<ExpenseListItem>>(
    ({ item }) => <Row item={item} onPressItem={onPressItem} />,
    [onPressItem],
  );

  const header = useMemo(
    () => (
      <View>
        {ListHeaderComponent}

        {items.length > 0 ? (
          <View style={summaryStyle}>
            <Text variant="caption" color="secondary">
              {`${items.length} ${items.length === 1 ? 'expense' : 'expenses'}`}
            </Text>
            <Text variant="subtitle">{money(total)}</Text>
          </View>
        ) : null}
      </View>
    ),
    [ListHeaderComponent, items.length, total, money],
  );

  const empty = useMemo(() => {
    if (isEmpty) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState
            icon="receipt-outline"
            title="No expenses yet"
            description="Tap the + button to add your first expense."
          />
        </View>
      );
    }

    if (hasNoMatches) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState
            icon="search-outline"
            title="No matches"
            description="Try a different search or filter."
          />
        </View>
      );
    }

    return null;
  }, [isEmpty, hasNoMatches]);

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      ItemSeparatorComponent={Separator}
      contentContainerStyle={contentContainerStyle}
      removeClippedSubviews
      initialNumToRender={12}
      maxToRenderPerBatch={10}
      windowSize={11}
      updateCellsBatchingPeriod={50}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    />
  );
}
