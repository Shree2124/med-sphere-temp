import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { patients as mockPatients } from '@/lib/mock-data';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  bloodGroup: string;
  status: string;
  lastVisit: string;
  department: string;
  address: string;
  email: string;
  idProof: string;
}

interface FilterState {
  search: string;
  status: string;
  department: string;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface PatientState {
  patients: Patient[];
  selected: Patient | null;
  filters: FilterState;
  pagination: PaginationState;
  isLoading: boolean;
  error: string | null;

  setPatients: (patients: Patient[]) => void;
  selectPatient: (id: string | null) => void;
  updateFilter: (filter: Partial<FilterState>) => void;
  setPage: (page: number) => void;
  updatePatientImmer: (id: string, updates: Partial<Patient>) => void;
  fetchPatients: () => Promise<void>;
}

export const usePatientStore = create<PatientState>()(
  immer((set, get) => ({
    patients: [],
    selected: null,
    filters: {
      search: '',
      status: 'All',
      department: 'All',
    },
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
    },
    isLoading: false,
    error: null,

    setPatients: (patients) =>
      set((state) => {
        state.patients = patients;
      }),

    selectPatient: (id) =>
      set((state) => {
        state.selected = state.patients.find((p) => p.id === id) || null;
      }),

    updateFilter: (filter) =>
      set((state) => {
        state.filters = { ...state.filters, ...filter };
        state.pagination.page = 1; // Reset page on filter change
      }),

    setPage: (page) =>
      set((state) => {
        state.pagination.page = page;
      }),

    updatePatientImmer: (id, updates) =>
      set((state) => {
        const index = state.patients.findIndex((p) => p.id === id);
        if (index !== -1) {
          state.patients[index] = { ...state.patients[index], ...updates };
        }
        if (state.selected?.id === id) {
          state.selected = { ...state.selected, ...updates };
        }
      }),

    fetchPatients: async () => {
      set((state) => {
        state.isLoading = true;
      });

      const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

      try {
        if (useMock) {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));
          set((state) => {
            state.patients = mockPatients as Patient[];
            state.pagination.total = mockPatients.length;
          });
        } else {
          const { search, status, department } = get().filters;
          const { page, pageSize } = get().pagination;

          const params = new URLSearchParams({
            search,
            status,
            department,
            page: page.toString(),
            pageSize: pageSize.toString(),
          });

          const res = await fetch(`/api/patients?${params}`);
          if (!res.ok) throw new Error('Failed to fetch patients');

          const data = await res.json();
          set((state) => {
            state.patients = data.patients;
            state.pagination.total = data.total;
          });
        }
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
  }))
);
