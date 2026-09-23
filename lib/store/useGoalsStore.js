import { create } from 'zustand';
import {
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '@/lib/services/goalsService';

export const useGoalsStore = create((set) => ({
  goals: [],
  loading: false,
  error: null,

  loadGoals: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchGoals();
      set({ goals: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addGoal: async (goalData) => {
    set({ loading: true, error: null });
    try {
      const newGoal = await createGoal(goalData);
      set((state) => ({
        goals: [newGoal, ...state.goals],
        loading: false,
      }));
      return newGoal;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  editGoal: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateGoal(id, updates);
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? updated : g)),
        loading: false,
      }));
      return updated;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  removeGoal: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteGoal(id);
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));