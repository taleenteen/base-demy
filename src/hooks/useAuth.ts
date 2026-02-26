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
    mutationFn: (credentials: { email: string; password: string }) =>
      loginApi(credentials.email, credentials.password),
    onSuccess: async (data) => {
      await loginAction(data.token, data.user);
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
