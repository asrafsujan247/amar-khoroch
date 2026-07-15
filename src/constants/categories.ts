import { type CategoryGroup, type CategoryId } from '@/types/expense';
import { type IoniconName } from '@/types/icon';

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
  { id: 'breakfast', label: 'Breakfast', group: 'daily', icon: 'cafe-outline', color: '#F59E0B' },
  { id: 'lunch', label: 'Lunch', group: 'daily', icon: 'restaurant-outline', color: '#00B89A' },
  { id: 'dinner', label: 'Dinner', group: 'daily', icon: 'pizza-outline', color: '#8B5CF6' },
  { id: 'travel', label: 'Travel', group: 'daily', icon: 'car-outline', color: '#3B82F6' },
  { id: 'extra', label: 'Extra', group: 'daily', icon: 'pricetag-outline', color: '#EC4899' },
  { id: 'room-rent', label: 'Room Rent', group: 'monthly', icon: 'home-outline', color: '#14B8A6' },
  { id: 'bazar', label: 'Bazar', group: 'monthly', icon: 'basket-outline', color: '#F97316' },
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
