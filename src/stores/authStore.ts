import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Role } from '@/generated/prisma/client';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  role: Role | null;
  isLoading: boolean;
  setUser: (user: User | null, role: Role | null) => void;
  clearAuth: () => void;
  hydrateFromCookie: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    role: null,
    isLoading: true,
    setUser: (user, role) =>
      set((state) => {
        state.user = user;
        state.role = role;
        state.isLoading = false;
      }),
    clearAuth: () =>
      set((state) => {
        state.user = null;
        state.role = null;
        state.isLoading = false;
      }),
    hydrateFromCookie: async () => {
      set((state) => {
        state.isLoading = true;
      });
      try {
        // Quick hint from non-HttpOnly cookie if available
        if (typeof document !== 'undefined') {
          const roleCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('role='))
            ?.split('=')[1];

          if (roleCookie) {
            set((state) => {
              state.role = roleCookie as Role;
            });
          }
        }

        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const { user, role } = await res.json();
          set((state) => {
            state.user = user;
            state.role = role;
          });
        } else {
          // If auth/me fails, clear everything (invalid token)
          set((state) => {
            state.user = null;
            state.role = null;
          });
        }
      } catch (error) {
        console.error('Hydration error:', error);
      } finally {
        set((state) => {
          state.isLoading = false;
        });
      }
    },
  }))
);
