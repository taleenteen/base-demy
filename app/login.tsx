import { ThemedText } from "@/src/components/themed-text";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, isLoggingIn } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password.");
      return;
    }

    try {
      await login({ username, password });
      // Navigation is handled automatically by the auth guard in _layout.tsx
    } catch (error: any) {
      Alert.alert("Login failed", error.message || "Invalid credentials");
    }
  };

  return (
    <View
      className="flex-1 bg-background justify-center px-6"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View className="items-center mb-10">
        <ThemedText type="title" className="text-4xl mb-2 text-primary">
          Super App
        </ThemedText>
        <Text className="text-muted-foreground text-center text-base">
          Sign in to access your secure workspace
        </Text>
      </View>

      <View className="flex gap-4">
        <View>
          <Text className="text-foreground font-medium mb-1.5 ml-1">
            Username
          </Text>
          <TextInput
            className="w-full h-12 px-4 rounded-lg bg-input/20 text-foreground border border-border"
            placeholder="Enter your username"
            placeholderTextColor="#888"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-foreground font-medium mb-1.5 ml-1">
            Password
          </Text>
          <TextInput
            className="w-full h-12 px-4 rounded-lg bg-input/20 text-foreground border border-border"
            placeholder="Enter your password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Button
          className="w-full h-12 mt-4 rounded-lg"
          onPress={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-primary-foreground font-semibold text-lg">
              Sign In
            </Text>
          )}
        </Button>
      </View>
    </View>
  );
}
