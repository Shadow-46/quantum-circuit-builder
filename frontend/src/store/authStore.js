import { create } from 'zustand';
import { authService } from '../services/authService';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  register: async (email, username, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(email, username, password);
      // After registration, log them in
      await authService.login(email, password);
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.login(email, password);
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  loadUser: async () => {
    if (!authService.isAuthenticated()) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },

  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.updateProfile(updates);
      set({ user, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
