// Imported from the colors module directly rather than the `@/theme` barrel:
// the barrel pulls in `shadows.ts` (which imports react-native), and this file
// must stay free of native dependencies so it remains portable and testable.
import { colors } from '@/theme/colors';
import { type CategoryGroup, type CategoryId } from '@/types/expense';
import { type IoniconName } from '@/types/icon';

/**
 * Category colors come from the validated categorical palette, one per slot in
 * order. The slot order was chosen for colour-vision safety — see the notes on
 * `colors.categorical` before changing any of this.
 */
const [YELLOW, GREEN, MAGENTA, BLUE, AQUA, VIOLET, ORANGE] = colors.categorical;

/** Presentation metadata for a category. */
export type CategoryMeta = {
  id: CategoryId;
  label: string;
  group: CategoryGroup;
  icon: IoniconName;
  /** Accent color used for icon chips, tags and charts. */
  color: string;
};

/**
 * The app's fixed category set — 5 daily categories and 2 monthly commitments.
 * This is the single source of truth for category labels, icons and colors,
 * used by the expense form, dashboard, history and statistics.
 */
export const CATEGORIES: readonly CategoryMeta[] = [
  { id: 'breakfast', label: 'Breakfast', group: 'daily', icon: 'cafe-outline', color: YELLOW },
  { id: 'lunch', label: 'Lunch', group: 'daily', icon: 'restaurant-outline', color: GREEN },
  { id: 'dinner', label: 'Dinner', group: 'daily', icon: 'pizza-outline', color: MAGENTA },
  { id: 'travel', label: 'Travel', group: 'daily', icon: 'car-outline', color: BLUE },
  { id: 'extra', label: 'Extra', group: 'daily', icon: 'pricetag-outline', color: AQUA },
  { id: 'room-rent', label: 'Room Rent', group: 'monthly', icon: 'home-outline', color: VIOLET },
  { id: 'bazar', label: 'Bazar', group: 'monthly', icon: 'basket-outline', color: ORANGE },
];

export const CATEGORY_MAP: Record<CategoryId, CategoryMeta> = CATEGORIES.reduce(
  (map, category) => {
    map[category.id] = category;
    return map;
  },
  {} as Record<CategoryId, CategoryMeta>,
);

export const CATEGORY_IDS: readonly CategoryId[] = CATEGORIES.map((category) => category.id);

export const DAILY_CATEGORIES: readonly CategoryMeta[] = CATEGORIES.filter(
  (category) => category.group === 'daily',
);

export const MONTHLY_CATEGORIES: readonly CategoryMeta[] = CATEGORIES.filter(
  (category) => category.group === 'monthly',
);

/** Runtime type guard for persisted / user-supplied category values. */
export function isCategoryId(value: string): value is CategoryId {
  return CATEGORY_IDS.includes(value as CategoryId);
}
