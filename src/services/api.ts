import { API_BASE_URL } from "../constants";
import { getToken } from "../utils/storage";

export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: headers as any,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // JSON parse error or no body
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
