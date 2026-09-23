import { create } from 'zustand';
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/lib/services/financeService';

export const useFinanceStore = create((set, get) => ({
  transactions: [],
  loading: false,
  error: null,

  loadTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchTransactions();
      set({ transactions: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addTransaction: async (transactionData) => {
    set({ loading: true, error: null });
    try {
      const newTransaction = await createTransaction(transactionData);
      set((state) => ({
        transactions: [newTransaction, ...state.transactions],
        loading: false,
      }));
      return newTransaction;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  editTransaction: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateTransaction(id, updates);
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? updated : t
        ),
        loading: false,
      }));
      return updated;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  removeTransaction: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteTransaction(id);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));