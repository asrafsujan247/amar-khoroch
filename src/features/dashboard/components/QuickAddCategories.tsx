import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '@/components/ui';
import { spacing } from '@/theme';
import type { QuickCategory } from '@/features/dashboard/types';

export type QuickAddCategoriesProps = {
  /** Quick-add category shortcuts to render as tiles. */
  categories: QuickCategory[];
  /** Called with the category key when a tile is selected. */
  onSelect: (key: string) => void;
};

/**
 * The "Quick Add" dashboard section: a horizontally scrolling strip of
 * category tiles, each a soft category-tinted icon circle above its label.
 * Tapping a tile starts a new expense for that category.
 */
export function QuickAddCategories({ categories, onSelect }: QuickAddCategoriesProps) {
  return (
    <View>
      <Text variant="title" style={{ marginBottom: spacing.md }}>
        Quick Add
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
      >
        {categories.map((cat) => (
          <Pressable
            key={cat.key}
            onPress={() => onSelect(cat.key)}
            accessibilityRole="button"
            accessibilityLabel={cat.label}
            style={({ pressed }) => ({
              width: 72,
              alignItems: 'center',
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: `${cat.color}1F`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={cat.icon} size={24} color={cat.color} />
            </View>
            <Text variant="caption" numberOfLines={1} center style={{ marginTop: 6 }}>
              {cat.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
