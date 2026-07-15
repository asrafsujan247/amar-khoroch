import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { Appear, Screen } from '@/components/ui';
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
import { useEnsureCurrentMonthSalary } from '@/features/salary/useSalary';
import { useAppHydrated } from '@/store/hydration';
import { colors } from '@/theme';
import { useMoney } from '@/hooks/useMoney';

/**
 * Dashboard — the app's home screen.
 *
 * Milestone 4 composes the card library over a mock view model
 * (`useDashboardData`). Milestones 5–7 replace the hook's internals with the
 * real Zustand store + calculations; this screen stays unchanged.
 */
export default function DashboardScreen() {
  useEnsureCurrentMonthSalary();
  const hydrated = useAppHydrated();
  const money = useMoney();
  const data = useDashboardData();

  // Wait for persisted data to load so the dashboard doesn't flash empty
  // totals or a "salary not set" state on launch.
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
        {/* Cards cascade in on mount; `Appear` is a no-op under reduce motion. */}
        <Appear index={0}>
          <GreetingHeader
            greeting={data.greeting}
            userName={data.userName}
            monthLabel={data.monthLabel}
            onPressSettings={() => router.push('/settings')}
          />
        </Appear>

        <Appear index={1}>
          <BalanceCard
            remaining={data.remaining}
            salary={data.salary}
            spent={data.monthlyExpense}
          />
        </Appear>

        <Appear index={2}>
          <SalaryCard
            salary={data.salary}
            isSet={data.isSalarySet}
            monthLabel={data.monthLabel}
            onEdit={() => router.push('/salary')}
          />
        </Appear>

        <Appear index={3} style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <StatTile
              label="Today's Expense"
              value={money(data.todayExpense)}
              icon="today-outline"
              iconColor="#EF4444"
              iconBgColor="#FEE2E2"
            />
          </View>
          <View style={{ flex: 1 }}>
            <StatTile
              label="Monthly Expense"
              value={money(data.monthlyExpense)}
              icon="calendar-outline"
              iconColor="#3B82F6"
              iconBgColor="#DBEAFE"
            />
          </View>
        </Appear>

        <Appear index={4}>
          <MonthlyProgressCard
            progress={data.monthlyProgress}
            budgetPercentUsed={data.budgetPercentUsed}
            dailyAverage={data.dailyAverage}
            remaining={data.remaining}
          />
        </Appear>

        <Appear index={5}>
          <QuickAddCategories
            categories={data.quickCategories}
            onSelect={(category) => router.push({ pathname: '/add-expense', params: { category } })}
          />
        </Appear>

        <Appear index={6}>
          <RecentExpenses
            expenses={data.recentExpenses}
            onSeeAll={() => router.push('/history')}
            onPressExpense={(id) => router.push({ pathname: '/expense/[id]', params: { id } })}
          />
        </Appear>
      </ScrollView>
    </Screen>
  );
}
