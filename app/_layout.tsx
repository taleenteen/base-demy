import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/src/hooks/use-color-scheme";
import { useAuthStore } from "@/src/store/useAuthStore";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["SafeAreaView has been deprecated"]);

const queryClient = new QueryClient();

export const unstable_settings = {
  anchor: "(tabs)",
};

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "login";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments, router]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useProtectedRoute();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <PortalHost />
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
