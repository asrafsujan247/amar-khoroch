import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { Card, ProgressBar, Screen, Text } from '@/components/ui';
import { StatTile } from '@/features/dashboard/components';
import { CategoryBreakdown } from '@/features/statistics/components/CategoryBreakdown';
import { CategoryDonut } from '@/features/statistics/components/CategoryDonut';
import { DailySpendingChart } from '@/features/statistics/components/DailySpendingChart';
import { MonthStepper } from '@/features/statistics/components/MonthStepper';
import { useStatisticsData } from '@/features/statistics/useStatisticsData';
import { useAppHydrated } from '@/store/hydration';
import { colors } from '@/theme';
import { formatCurrency } from '@/utils/currency';
import { getCurrentMonthKey, getMonthKey, getPreviousMonthKey, monthKeyToDate } from '@/utils/date';
import { addMonths } from 'date-fns';

/** Budget colour thresholds, matching the dashboard's progress card. */
function budgetColor(percentUsed: number): string {
  if (percentUsed < 75) return colors.primary[500];
  if (percentUsed < 90) return colors.warning.DEFAULT;
  return colors.danger.DEFAULT;
}

/**
 * Statistics — everything computed from expense records for one month.
 *
 * A month stepper lets past months be reviewed; the calculation engine already
 * takes a month key, so nothing here is current-month specific.
 */
export default function StatisticsScreen() {
  const [month, setMonth] = useState(getCurrentMonthKey);
  const hydrated = useAppHydrated();
  const data = useStatisticsData(month);

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
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 28, gap: 16 }}
      >
        <Text variant="h1">Statistics</Text>

        <MonthStepper
          monthLabel={data.monthLabel}
          canGoNext={data.canGoNext}
          onPrev={() => setMonth((current) => getPreviousMonthKey(current))}
          onNext={() => setMonth((current) => getMonthKey(addMonths(monthKeyToDate(current), 1)))}
        />

        {/* Headline figures — a number, not a chart. */}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <StatTile
              label="Monthly Spending"
              value={formatCurrency(data.monthlyTotal)}
              icon="calendar-outline"
              iconColor="#2A78D6"
              iconBgColor="#DBEAFE"
            />
          </View>
          <View style={{ flex: 1 }}>
            <StatTile
              label="Average Daily"
              value={formatCurrency(data.dailyAverage)}
              icon="speedometer-outline"
              iconColor={colors.primary[700]}
              iconBgColor={colors.primary[50]}
            />
          </View>
        </View>

        {/* Highest spending category */}
        <Card>
          <Text variant="title">Highest Spending Category</Text>
          {data.highest ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: `${data.highest.color}1F`,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text variant="subtitle" style={{ color: data.highest.color }}>
                  {Math.round(data.highest.percent)}%
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="h2">{data.highest.label}</Text>
                <Text variant="caption" color="secondary">
                  {formatCurrency(data.highest.total)} of {formatCurrency(data.monthlyTotal)}
                </Text>
              </View>
            </View>
          ) : (
            <Text variant="body" color="secondary" style={{ marginTop: 8 }}>
              No spending recorded this month.
            </Text>
          )}
        </Card>

        {/* Budget progress */}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text variant="title">Budget Progress</Text>
            <Text variant="label" color="secondary">
              {data.isSalarySet ? `${data.budgetPercentUsed}% used` : 'No salary set'}
            </Text>
          </View>
          <ProgressBar
            progress={data.monthlyProgress}
            fillColor={budgetColor(data.budgetPercentUsed)}
            style={{ marginTop: 12 }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
            <Text variant="caption" color="secondary">
              Spent {formatCurrency(data.monthlyTotal)}
            </Text>
            <Text variant="caption" color="secondary">
              Salary {formatCurrency(data.salary)}
            </Text>
          </View>
        </Card>

        <DailySpendingChart data={data.dailySeries} />

        <CategoryDonut slices={data.slices} total={data.monthlyTotal} />

        <CategoryBreakdown slices={data.slices} />
      </ScrollView>
    </Screen>
  );
}
