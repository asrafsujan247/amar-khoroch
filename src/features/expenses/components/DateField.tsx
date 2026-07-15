import { useState } from 'react';
import { View } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { subDays } from 'date-fns';

import { Chip, Text } from '@/components/ui';
import { spacing } from '@/theme';
import {
  dateKeyToDate,
  formatDateLabel,
  formatRelativeDate,
  getDateKey,
  getTodayKey,
  type DateKey,
} from '@/utils/date';

export type DateFieldProps = {
  /** Currently selected calendar day, `yyyy-MM-dd`. */
  value: DateKey;
  /** Called with the new date key when the selection changes. */
  onChange: (date: DateKey) => void;
  /** Field label rendered above the chips. Default `'Date'`. */
  label?: string;
  /** Error message shown below the chips (replaces the date label). */
  error?: string;
};

/**
 * Date selector for the add/edit expense form. Optimizes for the common case —
 * Today / Yesterday are one tap — while any older day is reachable through the
 * native picker. Future dates are not selectable, and the resolved date is
 * always spelled out below the chips so the choice is unambiguous.
 */
export function DateField({ value, onChange, label = 'Date', error }: DateFieldProps) {
  const [show, setShow] = useState(false);

  const todayKey = getTodayKey();
  const yesterdayKey = getDateKey(subDays(new Date(), 1));

  const isToday = value === todayKey;
  const isYesterday = value === yesterdayKey;
  const isCustom = !isToday && !isYesterday;

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    // Close on both `set` and `dismissed` — on Android the dialog stays up otherwise.
    setShow(false);
    if (event.type === 'set' && selected) onChange(getDateKey(selected));
  };

  return (
    <View>
      <Text variant="label" color="secondary" style={{ marginBottom: 6 }}>
        {label}
      </Text>

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Chip label="Today" selected={isToday} onPress={() => onChange(todayKey)} />
        <Chip label="Yesterday" selected={isYesterday} onPress={() => onChange(yesterdayKey)} />
        <Chip
          label={formatRelativeDate(value)}
          leftIcon="calendar-outline"
          selected={isCustom}
          onPress={() => setShow(true)}
        />
      </View>

      {error ? (
        <Text variant="caption" color="danger" style={{ marginTop: 6 }}>
          {error}
        </Text>
      ) : (
        <Text variant="caption" color="secondary" style={{ marginTop: 6 }}>
          {formatDateLabel(value)}
        </Text>
      )}

      {show && (
        <DateTimePicker
          value={dateKeyToDate(value)}
          mode="date"
          maximumDate={new Date()}
          onChange={handleChange}
        />
      )}
    </View>
  );
}
