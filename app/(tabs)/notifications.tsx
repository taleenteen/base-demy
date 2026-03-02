import { Text } from "@/src/components/ui/text";
import { usePushNotifications } from "@/src/hooks/usePushNotifications";
import * as Clipboard from "expo-clipboard";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { expoPushToken, notification, permissionGranted, error } =
    usePushNotifications();

  /**
   * Copy the Expo Push Token to clipboard.
   * We need this to paste into https://expo.dev/notifications
   * for sending test notifications during the demo.
   */
  const copyTokenToClipboard = async () => {
    if (expoPushToken) {
      // expo-clipboard may not be installed, fallback to Alert
      try {
        if (Clipboard && Clipboard.setStringAsync) {
          await Clipboard.setStringAsync(expoPushToken);
          Alert.alert("Copied! ✅", "Push Token ถูกคัดลอกแล้ว");
        }
      } catch {
        Alert.alert("Push Token", expoPushToken);
      }
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      {/* ── Header ────────────────────────────────── */}
      <View>
        <Text className="text-2xl font-bold text-foreground">
          🔔 Push Notifications
        </Text>
        <Text className="text-sm text-muted-foreground mt-1">
          สถานะและข้อมูล Push Notification สำหรับ Demo
        </Text>
      </View>

      {/* ── Permission Status ─────────────────────── */}
      <View className="rounded-xl border border-border bg-card p-4">
        <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Permission Status
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-lg">
            {permissionGranted ? "✅" : error ? "❌" : "⏳"}
          </Text>
          <Text className="text-base text-foreground font-medium">
            {permissionGranted
              ? "Permission Granted"
              : error
                ? error
                : "Requesting permission..."}
          </Text>
        </View>
      </View>

      {/* ── Push Token ────────────────────────────── */}
      <View className="rounded-xl border border-border bg-card p-4">
        <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Expo Push Token
        </Text>
        {expoPushToken ? (
          <>
            <Text
              selectable
              className="text-sm text-foreground font-mono bg-muted rounded-lg p-3 mb-3"
            >
              {expoPushToken}
            </Text>
            <TouchableOpacity
              onPress={copyTokenToClipboard}
              className="bg-primary rounded-lg py-3 px-4 items-center"
              activeOpacity={0.7}
            >
              <Text className="text-primary-foreground font-semibold text-sm">
                📋 Copy Token
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text className="text-sm text-muted-foreground italic">
            {error ? "ไม่สามารถรับ Token ได้" : "กำลังขอ Push Token..."}
          </Text>
        )}
      </View>

      {/* ── How to Test ───────────────────────────── */}
      <View className="rounded-xl border border-border bg-card p-4">
        <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          📤 วิธีทดสอบส่ง Notification
        </Text>
        <View className="gap-2">
          <Text className="text-sm text-foreground">
            1. Copy Push Token ด้านบน
          </Text>
          <Text className="text-sm text-foreground">
            2. ไปที่{" "}
            <Text className="text-primary font-semibold">
              expo.dev/notifications
            </Text>
          </Text>
          <Text className="text-sm text-foreground">
            3. วาง Token แล้วพิมพ์ข้อความที่ต้องการส่ง
          </Text>
          <Text className="text-sm text-foreground">
            4. กด "Send a Notification" ✨
          </Text>
        </View>
      </View>

      {/* ── Last Notification ─────────────────────── */}
      <View className="rounded-xl border border-border bg-card p-4">
        <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          📩 Last Received Notification
        </Text>
        {notification ? (
          <View className="gap-1">
            <Text className="text-base font-semibold text-foreground">
              {notification.request.content.title ?? "(No title)"}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {notification.request.content.body ?? "(No body)"}
            </Text>
            {notification.request.content.data && (
              <Text
                selectable
                className="text-xs text-muted-foreground font-mono bg-muted rounded-lg p-2 mt-2"
              >
                {JSON.stringify(notification.request.content.data, null, 2)}
              </Text>
            )}
          </View>
        ) : (
          <Text className="text-sm text-muted-foreground italic">
            ยังไม่ได้รับ Notification
          </Text>
        )}
      </View>

      {/* ── Device Info ────────────────────────────── */}
      <View className="rounded-xl border border-border bg-card p-4 mb-8">
        <Text className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          📱 Device Info
        </Text>
        <Text className="text-sm text-muted-foreground">
          Platform: {Platform.OS} {Platform.Version}
        </Text>
      </View>
    </ScrollView>
  );
}
