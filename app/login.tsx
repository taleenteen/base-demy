import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { IconSymbol } from "@/src/components/ui/icon-symbol";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Text } from "@/src/components/ui/text";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    try {
      await login({ email, password });
      // Navigation handled by auth guard
    } catch (error: any) {
      setErrorMsg(error.message || "Invalid credentials");
    }
  };

  return (
    <View
      className="flex-1 bg-background justify-center p-6"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View
        className="absolute top-4 right-4"
        style={{ marginTop: insets.top }}
      >
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <IconSymbol name="xmark" size={24} color="#888" />
        </Button>
      </View>

      <Card className="w-full max-w-sm mx-auto p-2">
        <CardHeader className="items-center">
          <CardTitle className="text-3xl font-bold mb-2 text-primary">
            DEMY Login
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to access your secure e-Service workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 gap-4 mt-2">
          {errorMsg ? (
            <Text className="text-destructive text-sm text-center font-medium bg-destructive/10 p-3 rounded-md">
              {errorMsg}
            </Text>
          ) : null}

          <View className="space-y-2 gap-2">
            <Label nativeID="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="space-y-2 gap-2 mt-2">
            <Label nativeID="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </CardContent>
        <CardFooter className="flex-col gap-4 mt-4">
          <Button
            className="w-full"
            size="lg"
            onPress={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-primary-foreground font-semibold">
                Sign In
              </Text>
            )}
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}
