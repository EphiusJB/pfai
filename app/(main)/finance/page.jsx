'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFinanceStore } from '@/lib/store/useFinanceStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingDown, TrendingUp, Loader2 } from 'lucide-react';
import { PageHeader, FabSpacer } from '@/components/page-header';
import { RowActions } from '@/components/row-actions';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
import { FinanceDialog } from '@/components/finance/finance-dialog';
import { FinanceChart } from '@/components/finance/finance-chart';

export default function FinancePage() {
  // Consume the Zustand finance store
  const {
    transactions,
    loading,
    loadTransactions,
    addTransaction,
    editTransaction,
    removeTransaction,
  } = useFinanceStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // Fetch transactions from the API on mount
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Safe calculations for totals
  const stats = useMemo(() => {
    const txList = transactions || [];
    const income = txList
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const expenses = txList
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    return {
      income,
      expenses,
      net: income - expenses,
    };
  }, [transactions]);

  // Safe categorization breakdown
  const transactionsByCategory = useMemo(() => {
    const grouped = {};
    const txList = transactions || [];
    txList.forEach((t) => {
      const category = t.category || 'Uncategorized';
      const amount = Number(t.amount) || 0;
      grouped[category] = (grouped[category] || 0) + (t.type === 'income' ? amount : -amount);
    });
    return Object.entries(grouped).map(([category, total]) => ({
      category,
      total,
    }));
  }, [transactions]);

  // Filter transactions list
  const filteredTransactions = useMemo(() => {
    const txList = transactions || [];
    return txList.filter((t) => {
      if (filterType === 'all') return true;
      return t.type === filterType;
    });
  }, [transactions, filterType]);

  // Async handlers connecting to backend API via Zustand
  const handleCreateTransaction = async (transactionData) => {
    try {
      await addTransaction(transactionData);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  const handleUpdateTransaction = async (transactionData) => {
    if (editingTransactionId) {
      try {
        await editTransaction(editingTransactionId, transactionData);
        setEditingTransactionId(null);
        setIsDialogOpen(false);
      } catch (error) {
        console.error('Failed to update transaction:', error);
      }
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await removeTransaction(id);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  return (
    <div>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <PageHeader
          title="Finance"
          description="Track your income and expenses"
          action={{
            label: 'New Transaction',
            icon: Plus,
            onClick: () => {
              setEditingTransactionId(null);
              setIsDialogOpen(true);
            },
          }}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Income
                </CardTitle>
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-3xl font-bold text-primary [overflow-wrap:anywhere]">K{stats.income.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {(transactions || []).filter((t) => t.type === 'income').length} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Expenses
                </CardTitle>
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xl sm:text-3xl font-bold text-destructive [overflow-wrap:anywhere]">K{stats.expenses.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {(transactions || []).filter((t) => t.type === 'expense').length} transactions
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-2 md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p
                className={`text-2xl sm:text-3xl font-bold [overflow-wrap:anywhere] ${
                  stats.net >= 0 ? 'text-primary' : 'text-destructive'
                }`}
              >
                K{stats.net.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {stats.net >= 0 ? 'Surplus' : 'Deficit'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <FinanceChart transactions={transactions || []} />
            </CardContent>
          </Card>

          {/* Categories Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>By Category</CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsByCategory.length > 0 ? (
                <div className="space-y-3">
                  {transactionsByCategory.map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{item.category}</span>
                      <span
                        className={`text-sm font-medium ${
                          item.total >= 0 ? 'text-primary' : 'text-destructive'
                        }`}
                      >
                        K{Math.abs(item.total).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No transactions yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted/30 p-1 sm:flex sm:gap-2 sm:bg-transparent sm:p-0">
                {['all', 'income', 'expense'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    aria-pressed={filterType === type}
                    className={`px-3 py-2 sm:py-1 text-sm sm:text-xs rounded transition-colors ${
                      filterType === type
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border text-foreground hover:border-primary/50'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <p className="text-sm">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-2 sm:space-y-3 sm:max-h-96 sm:overflow-y-auto">
                {filteredTransactions.map((transaction) => {
                  const amount = Number(transaction.amount) || 0;
                  const txDate = transaction.date || transaction.created_at;

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-2 sm:gap-3 p-3 bg-card/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-foreground">{transaction.description}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {transaction.category} •{' '}
                          {txDate ? new Date(txDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 font-bold tabular-nums ${
                          transaction.type === 'income'
                            ? 'text-primary'
                            : 'text-destructive'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}K
                        {amount.toFixed(2)}
                      </span>
                      <RowActions
                        label="transaction"
                        onEdit={() => {
                          setEditingTransactionId(transaction.id);
                          setIsDialogOpen(true);
                        }}
                        onDelete={() => setPendingDeleteId(transaction.id)}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">
                No transactions found
              </p>
            )}
          </CardContent>
        </Card>

        <FabSpacer />

        <ConfirmDeleteDialog
          open={pendingDeleteId !== null}
          onOpenChange={(open) => !open && setPendingDeleteId(null)}
          title="Delete this transaction?"
          description="This transaction will be permanently removed."
          onConfirm={() => {
            handleDeleteTransaction(pendingDeleteId);
            setPendingDeleteId(null);
          }}
        />

        {/* Finance Dialog */}
        <FinanceDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingTransactionId(null);
          }}
          onSave={
            editingTransactionId ? handleUpdateTransaction : handleCreateTransaction
          }
          initialTransaction={
            editingTransactionId
              ? (transactions || []).find((t) => t.id === editingTransactionId)
              : undefined
          }
        />
      </div>
    </div>
  );
}