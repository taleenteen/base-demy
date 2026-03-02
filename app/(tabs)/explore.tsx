import { ThemedText } from "@/src/components/themed-text";
import { IconSymbol } from "@/src/components/ui/icon-symbol";
import { generateSsoCode } from "@/src/services/auth";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useConfigStore } from "@/src/store/useConfigStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TestUrl {
  name: string;
  url: string;
  description: string;
  /** If true, requires login and will generate SSO code via /auth/generate-code */
  requiresAuth?: boolean;
  /** The SSO path to append ?code= to (defaults to /sso) */
  ssoPath?: string;
}

const TEST_URLS: TestUrl[] = [
  {
    name: "CPN DEMY",
    url: "https://cpn.demyis.com",
    description: "API testing endpoint for cpn.demyis.com",
  },
  {
    name: "GovCenter Main",
    url: "https://govcenter.co",
    description: "Main landing page for GovCenter platform",
  },
  {
    name: "Point Exchange",
    url: "https://point-exchange.govcenter.co",
    description: "Reward points exchange module",
  },
  {
    name: "DEMY e-Service",
    url: "http://192.168.100.219:3001",
    description: "DEMY e-Service",
    requiresAuth: true,
    ssoPath: "/sso",
  },
];

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUrl, setUrl } = useConfigStore();
  const { isAuthenticated } = useAuthStore();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handleSelectUrl = async (item: TestUrl, index: number) => {
    if (item.requiresAuth) {
      // Check if user is logged in
      if (!isAuthenticated) {
        Alert.alert(
          "Login Required",
          "You need to login before accessing this e-Service.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Login", onPress: () => router.push("/login") },
          ],
        );
        return;
      }

      // Generate SSO code
      try {
        setLoadingIndex(index);
        const { code } = await generateSsoCode();
        const ssoPath = item.ssoPath || "/sso";
        const ssoUrl = `${item.url}${ssoPath}?code=${code}`;
        setUrl(ssoUrl);
        router.navigate("/(tabs)");
      } catch (error: any) {
        Alert.alert(
          "Error",
          error.message || "Failed to generate SSO code. Please try again.",
        );
      } finally {
        setLoadingIndex(null);
      }
    } else {
      // Normal URL, just set and navigate
      setUrl(item.url);
      router.navigate("/(tabs)");
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-4 border-b border-border bg-card">
        <ThemedText type="title" className="text-2xl font-bold mb-1">
          Sandbox
        </ThemedText>
        <Text className="text-muted-foreground">
          Select a test environment to load in the WebView
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="gap-4">
          {TEST_URLS.map((item, index) => {
            const isSelected = currentUrl.startsWith(item.url);
            const isLoading = loadingIndex === index;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectUrl(item, index)}
                disabled={isLoading}
                className={`p-4 rounded-xl border flex-row items-center justify-between ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
                activeOpacity={0.7}
              >
                <View className="flex-1 mr-4">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text
                      className={`text-lg font-semibold ${
                        isSelected ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {item.name}
                    </Text>
                    {item.requiresAuth && (
                      <View className="bg-amber-500/15 px-2 py-0.5 rounded-full">
                        <Text className="text-amber-600 text-[10px] font-semibold">
                          SSO
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-muted-foreground text-sm mb-2">
                    {item.description}
                  </Text>
                  <Text
                    className="text-xs text-muted-foreground/80 font-mono"
                    numberOfLines={1}
                  >
                    {item.url}
                  </Text>
                </View>

                {isLoading ? (
                  <ActivityIndicator size="small" color="hsl(var(--primary))" />
                ) : isSelected ? (
                  <View className="h-8 w-8 rounded-full bg-primary items-center justify-center">
                    <IconSymbol name="checkmark" size={16} color="#fff" />
                  </View>
                ) : (
                  <View className="h-8 w-8 items-center justify-center">
                    <IconSymbol name="chevron.right" size={20} color="#888" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="mt-8 p-4 bg-accent/30 rounded-lg border border-border">
          <Text className="text-foreground font-semibold mb-2">
            Current Target:
          </Text>
          <Text className="text-muted-foreground font-mono text-sm">
            {currentUrl}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
