import { create } from 'zustand';
import {
  fetchJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from '@/lib/services/journalService';

export const useJournalStore = create((set) => ({
  journalEntries: [],
  loading: false,
  error: null,

  loadJournalEntries: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchJournalEntries();
      set({ journalEntries: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  addJournalEntry: async (entryData) => {
    set({ loading: true, error: null });
    try {
      const newEntry = await createJournalEntry(entryData);
      set((state) => ({
        journalEntries: [newEntry, ...state.journalEntries],
        loading: false,
      }));
      return newEntry;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  editJournalEntry: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updated = await updateJournalEntry(id, updates);
      set((state) => ({
        journalEntries: state.journalEntries.map((e) =>
          e.id === id ? updated : e
        ),
        loading: false,
      }));
      return updated;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  removeJournalEntry: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteJournalEntry(id);
      set((state) => ({
        journalEntries: state.journalEntries.filter((e) => e.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },
}));