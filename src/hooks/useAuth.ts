import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../services/auth";
import { useAuthStore } from "../store/useAuthStore";

export const useAuth = () => {
  const loginAction = useAuthStore((state) => state.login);
  const logoutAction = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) => {
      console.log("🔐 [useAuth] Starting login for:", credentials.email);
      return loginApi(credentials.email, credentials.password);
    },
    onSuccess: async (data) => {
      console.log(
        "✅ [useAuth] Login success! User:",
        data.user?.name ?? data.user?.email,
      );
      console.log(
        "🎫 [useAuth] Token received:",
        data.token?.substring(0, 30) + "...",
      );
      await loginAction(data.token, data.user);
      console.log("💾 [useAuth] Token & user saved to store");
    },
    onError: (error: any) => {
      console.log("❌ [useAuth] Login failed:", error.message);
    },
  });

  return {
    user,
    isAuthenticated,
    isStoreLoading: isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout: logoutAction,
  };
};
