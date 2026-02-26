import { ESERVICE_URL } from "@/src/constants";
import { generateSsoCode } from "@/src/services/auth";
import { useAuthStore } from "@/src/store/useAuthStore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

export default function EserviceHome() {
  const { token, logout } = useAuthStore();
  const [ssoUrl, setSsoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWebViewLoading, setIsWebViewLoading] = useState(true);

  // Auto-generate SSO code on mount
  useEffect(() => {
    generateSso();
  }, []);

  const generateSso = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      const { code } = await generateSsoCode();
      const url = `${ESERVICE_URL}/sso?code=${code}`;
      setSsoUrl(url);
    } catch (err: any) {
      setError(err.message || "Failed to generate SSO code");
    } finally {
      setIsGenerating(false);
    }
  };

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

  // Show loading while generating SSO code
  if (isGenerating) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="hsl(var(--primary))" />
        <Text className="text-muted-foreground mt-4">
          Generating SSO code...
        </Text>
      </View>
    );
  }

  // Show error if SSO code generation failed
  if (error || !ssoUrl) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-destructive text-lg font-semibold mb-2">
          Connection Error
        </Text>
        <Text className="text-muted-foreground text-center mb-6">
          {error || "Could not connect to e-Service"}
        </Text>
        <TouchableOpacity
          onPress={generateSso}
          className="bg-primary px-6 py-3 rounded-lg"
        >
          <Text className="text-primary-foreground font-semibold">
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {isWebViewLoading && (
        <View
          style={StyleSheet.absoluteFill}
          className="absolute inset-0 z-10 flex items-center justify-center bg-background"
        >
          <ActivityIndicator size="large" color="hsl(var(--primary))" />
        </View>
      )}
      <WebView
        source={{ uri: ssoUrl }}
        key={ssoUrl}
        onMessage={onMessage}
        onLoadEnd={() => setIsWebViewLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error:", nativeEvent);
          setIsWebViewLoading(false);
        }}
        style={{ flex: 1, backgroundColor: "transparent" }}
        javaScriptEnabled={true}
        originWhitelist={["http://*", "https://*"]}
        allowsInlineMediaPlayback={true}
      />
    </View>
  );
}
