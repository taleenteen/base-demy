import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "../constants";

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
};

export const deleteToken = async () => {
  await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
};
