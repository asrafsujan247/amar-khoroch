import { useState } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, Switch, View } from 'react-native';
import Constants from 'expo-constants';

import { Screen, Text } from '@/components/ui';
import { SettingsRow } from '@/features/settings/components/SettingsRow';
import { SettingsSection } from '@/features/settings/components/SettingsSection';
import { useCurrency } from '@/hooks/useMoney';
import { BackupError } from '@/services/backupFormat';
import { exportBackupToFile, importBackupFromFile } from '@/services/backupFile';
import { resetAllData } from '@/services/backup';
import { useAppHydrated } from '@/store/hydration';
import { colors } from '@/theme';

/** Surface a BackupError's message; fall back to a generic one for anything else. */
function reportError(title: string, error: unknown) {
  const message =
    error instanceof BackupError ? error.message : 'Something went wrong. Please try again.';
  Alert.alert(title, message);
}

/**
 * Settings — currency, data backup and app info.
 *
 * Export/import delegate to the backup service (which owns validation), so this
 * screen only handles user confirmation and error presentation.
 */
export default function SettingsScreen() {
  const hydrated = useAppHydrated();
  const currency = useCurrency();
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    setBusy(true);
    try {
      const result = await exportBackupToFile();
      if (result.status === 'unavailable') {
        Alert.alert('Backup saved', `Sharing isn't available on this device.\n\n${result.uri}`);
      }
    } catch (error) {
      reportError('Export failed', error);
    } finally {
      setBusy(false);
    }
  };

  const handleImport = () => {
    Alert.alert(
      'Import data?',
      'This replaces all current salary and expense data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Choose file',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            try {
              const imported = await importBackupFromFile();
              if (imported) Alert.alert('Import complete', 'Your data has been restored.');
            } catch (error) {
              reportError('Import failed', error);
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset app?',
      'This permanently deletes every expense and salary record, and restores default settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset everything',
          style: 'destructive',
          onPress: () => {
            resetAllData();
            Alert.alert('App reset', 'All data has been cleared.');
          },
        },
      ],
    );
  };

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
    <Screen padded={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 28, gap: 20 }}
      >
        <Text variant="h1">Settings</Text>

        <SettingsSection title="Preferences">
          <SettingsRow
            icon="cash-outline"
            label="Currency"
            value={`${currency.symbol} ${currency.code}`}
            onPress={() => router.push('/currency')}
          />
          <SettingsRow
            icon="moon-outline"
            label="Dark Mode"
            description="Coming in a future version"
            rightElement={<Switch value={false} disabled />}
          />
        </SettingsSection>

        <SettingsSection title="Data">
          <SettingsRow
            icon="download-outline"
            label="Export Data"
            description="Save a backup file you can keep or share"
            onPress={handleExport}
            disabled={busy}
          />
          <SettingsRow
            icon="cloud-upload-outline"
            label="Import Data"
            description="Restore from a backup file"
            onPress={handleImport}
            disabled={busy}
          />
          <SettingsRow
            icon="trash-outline"
            label="Reset App"
            description="Delete all data and start over"
            destructive
            onPress={handleReset}
            disabled={busy}
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsRow
            icon="information-circle-outline"
            label="Version"
            value={Constants.expoConfig?.version ?? '1.0.0'}
            showChevron={false}
          />
          <SettingsRow
            icon="wallet-outline"
            label="Salary Expense Tracker"
            description="Track your monthly salary and spending, privately on your device."
            showChevron={false}
          />
        </SettingsSection>
      </ScrollView>
    </Screen>
  );
}
