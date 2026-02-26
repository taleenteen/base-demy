import { LoginResponse, SsoCodeResponse } from "../types/auth";
import { fetchApi } from "./api";

export const generateSsoCode = async (): Promise<SsoCodeResponse> => {
  return fetchApi<SsoCodeResponse>("/auth/generate-code", {
    method: "POST",
  });
};

export const loginApi = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  // Using the actual DEMY API endpoint
  // Note: Since backend might not be ready, this will try to call the real API.
  // If you need to revert to mock, you can uncomment the delay logic below.
  return fetchApi<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  /*
  // MOCK fallback if needed
  return new Promise<LoginResponse>((resolve) => {
    setTimeout(() => {
      resolve({
        token: `mock-jwt-token-${Date.now()}`,
        user: { 
          id: "1", 
          email, 
          name: "SuperAdmin", 
          isActive: true, 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString(), 
          tenants: [] 
        },
      });
    }, 1000);
  });
  */
};
