import { create } from "zustand";
import { deleteToken, getToken, saveToken } from "../utils/storage";

export interface User {
  id: string;
  username: string;
  name?: string;
}

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
    set({ token, user, isAuthenticated: true });
  },

  logout: async () => {
    await deleteToken();
    set({ token: null, user: null, isAuthenticated: false });
  },

  initialize: async () => {
    try {
      const token = await getToken();
      if (token) {
        // Here we would typically validate the token with the backend and fetch the user profile.
        // For now, we mock a user since we skipped the backend phase.
        set({
          token,
          isAuthenticated: true,
          user: { id: "1", username: "mockuser", name: "Mock User" },
        });
      }
    } catch (e) {
      console.error("Failed to initialize auth", e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
