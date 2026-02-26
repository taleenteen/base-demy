import { Button } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { useConfigStore } from "@/src/store/useConfigStore";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUrl } = useConfigStore();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-border bg-card">
        <View className="flex-1 mr-4">
          <Text className="text-sm text-muted-foreground font-medium">
            Previewing
          </Text>
          <Text className="text-lg font-bold text-foreground" numberOfLines={1}>
            {currentUrl.replace("https://", "")}
          </Text>
        </View>
        <Button size="sm" onPress={() => router.push("/login")}>
          <Text className="text-primary-foreground font-semibold">Login</Text>
        </Button>
      </View>

      {isLoading && (
        <View
          style={StyleSheet.absoluteFill}
          className="absolute inset-0 z-10 flex items-center justify-center bg-background top-20"
        >
          <ActivityIndicator size="large" color="hsl(var(--primary))" />
        </View>
      )}

      <WebView
        source={{ uri: currentUrl }}
        key={currentUrl}
        onLoadEnd={() => setIsLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error:", nativeEvent);
          setIsLoading(false);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView HTTP error:", nativeEvent.statusCode);
        }}
        style={{ flex: 1, backgroundColor: "transparent" }}
        javaScriptEnabled={true}
        originWhitelist={["http://*", "https://*"]}
        allowsInlineMediaPlayback={true}
      />
    </View>
  );
}
