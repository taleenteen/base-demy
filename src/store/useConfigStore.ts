import { create } from "zustand";
import { WEBVIEW_URL } from "../constants";

interface ConfigState {
  currentUrl: string;
  setUrl: (url: string) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  currentUrl: WEBVIEW_URL,
  setUrl: (url: string) => set({ currentUrl: url }),
}));
