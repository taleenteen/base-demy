import { ThemedText } from "@/src/components/themed-text";
import { IconSymbol } from "@/src/components/ui/icon-symbol";
import { useConfigStore } from "@/src/store/useConfigStore";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TEST_URLS = [
  {
    name: "Volunteer e-Service",
    url: "https://api-volunteer-eservice.govcenter.co",
    description: "API testing endpoint for Volunteer e-Service",
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
];

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUrl, setUrl } = useConfigStore();

  const handleSelectUrl = (url: string) => {
    setUrl(url);
    router.navigate("/(tabs)");
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
            const isSelected = currentUrl === item.url;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectUrl(item.url)}
                className={`p-4 rounded-xl border flex-row items-center justify-between ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card"
                }`}
                activeOpacity={0.7}
              >
                <View className="flex-1 mr-4">
                  <Text
                    className={`text-lg font-semibold mb-1 ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </Text>
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

                {isSelected ? (
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
