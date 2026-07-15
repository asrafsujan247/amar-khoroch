import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card, IconButton, Screen, Text } from '@/components/ui';
import { CURRENCIES } from '@/constants/currencies';
import { SettingsRow } from '@/features/settings/components/SettingsRow';
import { useSettingsStore } from '@/store/settingsStore';
import { colors } from '@/theme';

/**
 * Currency picker — presented as a modal from Settings.
 *
 * The list is driven entirely by the `CURRENCIES` registry, so adding a
 * currency there makes it appear here with no changes to this screen.
 */
export default function CurrencyScreen() {
  const currencyCode = useSettingsStore((state) => state.currencyCode);
  const setCurrencyCode = useSettingsStore((state) => state.setCurrencyCode);

  return (
    <Screen edges={['top', 'bottom']}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 8,
        }}
      >
        <Text variant="h2">Currency</Text>
        <IconButton
          icon="close"
          accessibilityLabel="Close"
          variant="soft"
          onPress={() => router.back()}
        />
      </View>

      <Text variant="caption" color="secondary" style={{ marginTop: 4 }}>
        Amounts are re-labelled instantly. Existing values are never converted.
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16 }}
      >
        <Card padded={false} style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
          {CURRENCIES.map((currency) => {
            const selected = currency.code === currencyCode;
            return (
              <SettingsRow
                key={currency.code}
                icon="cash-outline"
                label={`${currency.symbol}  ${currency.name}`}
                description={currency.code}
                showChevron={false}
                onPress={() => {
                  setCurrencyCode(currency.code);
                  router.back();
                }}
                rightElement={
                  selected ? (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary[600]} />
                  ) : undefined
                }
              />
            );
          })}
        </Card>
      </ScrollView>
    </Screen>
  );
}
