import { type ComponentProps } from 'react';
import { type Ionicons } from '@expo/vector-icons';

/** Type-safe Ionicons glyph name. Single source of truth for icon-name props. */
export type IoniconName = ComponentProps<typeof Ionicons>['name'];
