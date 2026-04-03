import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface DashboardStats {
  totalPatients: number;
  todayOPD: number;
  todayIPD: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  maintenanceBeds: number;
  todayRevenue: number;
  monthlyRevenue: number;
  pendingBills: number;
  emergencyCases: number;
  surgeriesToday: number;
  labTestsPending: number;
  criticalPatients: number;
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;

  setStats: (stats: DashboardStats | null) => void;
  fetchStats: () => Promise<void>;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  immer((set) => ({
    stats: null,
    isLoading: false,
    error: null,

    setStats: (stats) =>
      set((state) => {
        state.stats = stats;
      }),

    fetchStats: async () => {
      set((state) => {
        state.isLoading = true;
      });

      try {
        const res = await fetch('/api/dashboard/stats');
        if (!res.ok) throw new Error('Failed to fetch statistics');

        const data = await res.json();
        set((state) => {
          state.stats = data;
        });
      } catch (err) {
        set((state) => {
          state.error = (err as Error).message;
        });
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },

    reset: () =>
      set((state) => {
        state.stats = null;
        state.isLoading = false;
        state.error = null;
      }),
  }))
);
