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
import { usePushNotifications } from "@/src/hooks/usePushNotifications";
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

    // @ts-ignore
    const inEserviceGroup = segments[0] === "(eservice)";

    if (!isAuthenticated && inEserviceGroup) {
      // If not authenticated and trying to access eservice, go to tabs (pre-login mode)
      router.replace("/(tabs)");
    } else if (isAuthenticated && !inEserviceGroup) {
      // If authenticated and nowhere near eservice, go to eservice home
      // @ts-ignore
      router.replace("/(eservice)");
    }
  }, [isAuthenticated, isLoading, segments, router]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useProtectedRoute();

  // 🔔 Initialize push notification registration at root level
  // This ensures registration happens once, regardless of which screen is shown.
  const { expoPushToken } = usePushNotifications();

  // Log token for debugging — can be viewed in terminal
  useEffect(() => {
    if (expoPushToken) {
      console.log("🔔 Push Token ready:", expoPushToken);
    }
  }, [expoPushToken]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(eservice)" options={{ headerShown: false }} />
          <Stack.Screen
            name="login"
            options={{ headerShown: false, presentation: "modal" }}
          />
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
