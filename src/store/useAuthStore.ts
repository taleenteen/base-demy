import { create } from "zustand";
import { User } from "../types/auth";
import {
  clearAuth,
  getToken,
  getUser,
  saveToken,
  saveUser,
} from "../utils/storage";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true, // starts loading to check secure storage

  login: async (token: string, user: User) => {
    await saveToken(token);
    await saveUser(user);
    set({ token, user, isAuthenticated: true });
  },

  logout: async () => {
    await clearAuth();
    set({ token: null, user: null, isAuthenticated: false });
  },

  initialize: async () => {
    try {
      const token = await getToken();
      const user = await getUser();

      if (token && user) {
        set({
          token,
          user: user as User,
          isAuthenticated: true,
        });
      }
    } catch (e) {
      console.error("Failed to initialize auth", e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
