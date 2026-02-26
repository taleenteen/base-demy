import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { IconSymbol } from "@/src/components/ui/icon-symbol";
import { useAuth } from "@/src/hooks/useAuth";
import { Stack, useRouter } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";

export default function EserviceLayout() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: logout },
    ]);
  };

  const handleLogoPress = () => {
    // Mock navigating back to e-service selection
    router.replace("/(tabs)/explore");
  };

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <Pressable
              onPress={handleLogoPress}
              className="flex-row items-center ml-4 gap-2"
            >
              <View className="w-8 h-8 rounded-md bg-primary items-center justify-center">
                <Text className="text-primary-foreground font-bold">D</Text>
              </View>
              <Text className="text-lg font-bold text-foreground">DEMY</Text>
            </Pressable>
          ),
          headerRight: () => (
            <View className="flex-row items-center mr-4 gap-4">
              <View className="flex-row items-center gap-2">
                <Avatar className="h-8 w-8" alt="User Avatar">
                  <AvatarFallback className="bg-primary/10">
                    <Text className="text-primary text-xs font-semibold">
                      {user?.name?.charAt(0) || "U"}
                    </Text>
                  </AvatarFallback>
                </Avatar>
              </View>
              <Pressable
                onPress={handleLogout}
                className="h-8 w-8 items-center justify-center rounded-full bg-destructive/10"
              >
                <IconSymbol
                  name="rectangle.portrait.and.arrow.right"
                  size={16}
                  color="hsl(var(--destructive))"
                />
              </Pressable>
            </View>
          ),
          headerStyle: {
            backgroundColor: "hsl(var(--background))",
          },
          headerShadowVisible: true,
        }}
      />
    </Stack>
  );
}
