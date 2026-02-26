import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "../constants";

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
};

export const saveUser = async (user: object) => {
  await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getUser = async () => {
  const data = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
};

export const clearAuth = async () => {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
};
