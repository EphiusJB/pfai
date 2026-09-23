'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Zap, Flame, TrendingUp, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

// Import Zustand stores
import { useAuthStore } from '@/lib/store/AuthStore';
import { useGoalsStore } from '@/lib/store/useGoalsStore';
import { useFinanceStore } from '@/lib/store/useFinanceStore';
import { useJournalStore } from '@/lib/store/useJournalStore';

export default function DashboardPage() {
  // Consume individual Zustand stores
  const { user } = useAuthStore();
  const { goals, loading: loadingGoals, loadGoals } = useGoalsStore();
  const { transactions, loading: loadingFinance, loadTransactions } = useFinanceStore();
  const { journalEntries, loading: loadingJournal, loadJournalEntries } = useJournalStore();

  // Fetch data from endpoints on component mount
  useEffect(() => {
    loadGoals();
    loadTransactions();
    loadJournalEntries();
  }, [loadGoals, loadTransactions, loadJournalEntries]);

  // Fallbacks for user profile metadata
  const profile = {
    level: user?.user_metadata?.level ?? 1,
    totalXP: user?.user_metadata?.total_xp ?? 0,
    currentStreak: user?.user_metadata?.current_streak ?? 0,
  };

  // Safe Data Calculations
  const completedGoalsCount = goals?.filter((g) => g.status === 'completed').length || 0;
  const activeGoals = goals?.filter((g) => g.status !== 'completed') || [];

  const totalIncome = (transactions || [])
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const totalExpenses = (transactions || [])
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const stats = [
    {
      label: 'Level',
      value: profile.level.toLocaleString(),
      icon: Zap,
      color: 'bg-primary/20 text-primary',
      href: '/dashboard',
    },
    {
      label: 'Total XP',
      value: profile.totalXP.toLocaleString(),
      icon: Flame,
      color: 'bg-accent/20 text-accent',
      href: '/dashboard',
    },
    {
      label: 'Current Streak',
      value: `${profile.currentStreak} days`,
      icon: TrendingUp,
      color: 'bg-destructive/20 text-destructive',
      href: '/goals',
    },
    {
      label: 'Goals Completed',
      value: completedGoalsCount,
      icon: Target,
      color: 'bg-primary/20 text-primary',
      href: '/goals',
    },
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <PageHeader
          title={`Welcome back${user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!`}
          description="Here's your life at a glance."
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardHeader className="pb-1 sm:pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="min-w-0 text-xs sm:text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </CardTitle>
                      <div className={`shrink-0 p-1.5 sm:p-2 rounded-lg ${stat.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Access Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Active Goals */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Goals</CardTitle>
                <Link href="/goals" className="text-primary text-sm hover:underline py-2 pl-3 -my-2">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {activeGoals.length > 0 ? (
                <div className="space-y-3">
                  {activeGoals.slice(0, 3).map((goal) => {
                    const milestones = goal.milestones || [];
                    const completedTasks = milestones.reduce(
                      (sum, m) => sum + (m.tasks?.filter((t) => t.status === 'completed').length || 0),
                      0
                    );
                    const totalTasks = milestones.reduce(
                      (sum, m) => sum + (m.tasks?.length || 0),
                      0
                    );
                    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                    return (
                      <div key={goal.id} className="border border-border rounded-lg p-3">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="min-w-0">
                            <h3 className="font-medium text-foreground break-words">{goal.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {milestones.length} milestones
                            </p>
                          </div>
                          <span className="shrink-0 text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            {goal.xp || 0} XP
                          </span>
                        </div>
                        <div className="w-full bg-card rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  {loadingGoals ? 'Loading goals...' : 'No active goals. Start by creating one!'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 sm:space-y-4 sm:gap-0">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Income</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary [overflow-wrap:anywhere]">K{totalIncome.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                  <p className="text-xl sm:text-2xl font-bold text-destructive [overflow-wrap:anywhere]">K{totalExpenses.toFixed(2)}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Net</p>
                <p
                  className={`text-xl sm:text-2xl font-bold [overflow-wrap:anywhere] ${
                    totalIncome - totalExpenses >= 0 ? 'text-primary' : 'text-destructive'
                  }`}
                >
                  K{(totalIncome - totalExpenses).toFixed(2)}
                </p>
              </div>
              <Link href="/finance" className="text-primary text-sm hover:underline block py-2">
                View details →
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Journal Entries */}
        <Card className="mt-4 sm:mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Recent Journal Entries
              </CardTitle>
              <Link href="/journal" className="text-primary text-sm hover:underline py-2 pl-3 -my-2">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {journalEntries?.length > 0 ? (
              <div className="space-y-3">
                {journalEntries.slice(0, 3).map((entry) => {
                  const tags = entry.tags || [];
                  const entryDate = entry.date || entry.created_at;

                  return (
                    <div key={entry.id} className="border border-border rounded-lg p-3">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="min-w-0 font-medium text-foreground break-words">{entry.title}</h3>
                        {entryDate && (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {new Date(entryDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                      {tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {loadingJournal ? 'Loading journal...' : 'No journal entries yet. Start reflecting!'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}