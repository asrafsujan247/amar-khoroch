import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Screen } from '@/components/ui';
import {
  BalanceCard,
  GreetingHeader,
  MonthlyProgressCard,
  QuickAddCategories,
  RecentExpenses,
  SalaryCard,
  StatTile,
} from '@/features/dashboard/components';
import { useDashboardData } from '@/features/dashboard/useDashboardData';
import { formatCurrency } from '@/utils/currency';

/**
 * Dashboard — the app's home screen.
 *
 * Milestone 4 composes the card library over a mock view model
 * (`useDashboardData`). Milestones 5–7 replace the hook's internals with the
 * real Zustand store + calculations; this screen stays unchanged.
 */
export default function DashboardScreen() {
  const data = useDashboardData();

  return (
    <Screen padded={false}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 28, gap: 16 }}
      >
        <GreetingHeader
          greeting={data.greeting}
          userName={data.userName}
          monthLabel={data.monthLabel}
          onPressSettings={() => router.push('/settings')}
        />

        <BalanceCard remaining={data.remaining} salary={data.salary} spent={data.monthlyExpense} />

        <SalaryCard salary={data.salary} monthLabel={data.monthLabel} />

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <StatTile
              label="Today's Expense"
              value={formatCurrency(data.todayExpense)}
              icon="today-outline"
              iconColor="#EF4444"
              iconBgColor="#FEE2E2"
            />
          </View>
          <View style={{ flex: 1 }}>
            <StatTile
              label="Monthly Expense"
              value={formatCurrency(data.monthlyExpense)}
              icon="calendar-outline"
              iconColor="#3B82F6"
              iconBgColor="#DBEAFE"
            />
          </View>
        </View>

        <MonthlyProgressCard
          progress={data.monthlyProgress}
          budgetPercentUsed={data.budgetPercentUsed}
          dailyAverage={data.dailyAverage}
          remaining={data.remaining}
        />

        <QuickAddCategories
          categories={data.quickCategories}
          onSelect={() => router.push('/add-expense')}
        />

        <RecentExpenses
          expenses={data.recentExpenses}
          onSeeAll={() => router.push('/history')}
          onPressExpense={() => router.push('/history')}
        />
      </ScrollView>
    </Screen>
  );
}
