import { useAuthStore } from "@/src/store/useAuthStore";
import { useConfigStore } from "@/src/store/useConfigStore";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { token, logout } = useAuthStore();
  const { currentUrl } = useConfigStore();
  const [isLoading, setIsLoading] = useState(true);

  // Inject the token into localStorage and sessionStorage before the page fully loads
  const injectedJavaScript = `
    try {
      window.localStorage.setItem('auth_token', '${token || ""}');
      window.sessionStorage.setItem('auth_token', '${token || ""}');
    } catch (e) {
      console.error('Failed to inject token', e);
    }
    true;
  `;

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "LOGOUT") {
        logout();
      }
    } catch (error) {
      console.error("Failed to parse webview message", error);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {isLoading && (
        <View
          style={StyleSheet.absoluteFill}
          className="absolute inset-0 z-10 flex items-center justify-center bg-background"
        >
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
      <WebView
        source={{ uri: currentUrl }}
        key={currentUrl} // Force remount on URL change
        injectedJavaScriptBeforeContentLoaded={injectedJavaScript}
        onMessage={onMessage}
        onLoadEnd={() => setIsLoading(false)}
        style={{ flex: 1, backgroundColor: "transparent" }}
        javaScriptEnabled={true}
      />
    </View>
  );
}
