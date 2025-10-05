import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Models } from 'appwrite';

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  isAnonymous: boolean;
  isLoading: boolean;
  setUser: (user: Models.User<Models.Preferences> | null) => void;
  setAnonymous: (isAnonymous: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAnonymous: false,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setAnonymous: (isAnonymous) => set({ isAnonymous }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAnonymous: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAnonymous: state.isAnonymous }),
    }
  )
);

interface UIState {
  isAuthModalOpen: boolean;
  isSidebarOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAuthModalOpen: false,
  isSidebarOpen: false,
  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
}));
