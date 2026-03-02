import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

// ─────────────────────────────────────────────────────────
// 📌 Configure how notifications behave when app is in FOREGROUND
//    By default, iOS won't show banners if the app is active.
//    This handler overrides that so we always show alerts.
// ─────────────────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Show alert dialog when app is open
    shouldPlaySound: true, // Play notification sound
    shouldSetBadge: true, // Update app badge count
    shouldShowBanner: true, // Show banner at top of screen (iOS 14+)
    shouldShowList: true, // Show in notification center
  }),
});

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
export interface PushNotificationState {
  /** The Expo Push Token string (e.g. "ExponentPushToken[xxxxxx]") */
  expoPushToken: string | null;
  /** The most recently received notification (while app is open) */
  notification: Notifications.Notification | null;
  /** Whether the permission was granted */
  permissionGranted: boolean;
  /** Any error message from the registration process */
  error: string | null;
}

// ─────────────────────────────────────────────────────────
// 🔑 Register for Push Notifications
//    - Checks if running on a physical device
//    - Requests user permission
//    - Returns an Expo Push Token
// ─────────────────────────────────────────────────────────
async function registerForPushNotificationsAsync(): Promise<string | null> {
  // Push notifications only work on physical devices
  if (!Device.isDevice) {
    console.warn(
      "⚠️ Push Notifications: Must use a physical device. Simulators are not supported.",
    );
    return null;
  }

  // 🤖 Android requires a Notification Channel (Android 8+)
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // Check existing permission status first
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // If not already granted, ask the user
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // If still not granted after asking, bail out
  if (finalStatus !== "granted") {
    console.warn("⚠️ Push Notifications: Permission not granted.");
    return null;
  }

  // 🎫 Get the Expo Push Token
  // The projectId comes from app.json → expo.extra.eas.projectId or EAS config.
  // For Expo Go testing, projectId is optional — it resolves automatically.
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  // If projectId is available (EAS-linked project), pass it explicitly.
  // Otherwise, omit it — Expo Go can resolve the token without it.
  const tokenData = projectId
    ? await Notifications.getExpoPushTokenAsync({ projectId })
    : await Notifications.getExpoPushTokenAsync();

  console.log("✅ Expo Push Token:", tokenData.data);
  return tokenData.data;
}

// ─────────────────────────────────────────────────────────
// 🪝 Custom Hook: usePushNotifications
//    Encapsulates all push notification logic.
//    Returns token, latest notification, permission, and errors.
// ─────────────────────────────────────────────────────────
export function usePushNotifications(): PushNotificationState {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs to hold subscription objects so we can clean them up
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // ── Register & get token ──────────────────────────
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setExpoPushToken(token);
          setPermissionGranted(true);
        } else if (!Device.isDevice) {
          setError("Push Notifications ใช้งานได้เฉพาะบนเครื่องจริงเท่านั้น");
        } else {
          setError("ไม่ได้รับอนุญาตให้แสดง Notification");
        }
      })
      .catch((err) => {
        console.error("Push notification registration error:", err);
        setError(err.message ?? "เกิดข้อผิดพลาดในการลงทะเบียน");
      });

    // ── Listener: Notification received while app is OPEN ──
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notif) => {
        console.log("📩 Notification received (foreground):", notif);
        setNotification(notif);
      });

    // ── Listener: User TAPPED the notification ──────────
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("👆 Notification tapped! Payload:", data);

        // ─────────────────────────────────────────────────
        // 🚀 TODO: Route the user to the correct WebView screen
        //    When we integrate with the backend, the notification payload
        //    will contain a URL like: { url: "https://eservice.demy.app/..." }
        //    We can use expo-router to navigate:
        //
        //    import { router } from 'expo-router';
        //    if (data.url) {
        //      router.push({ pathname: '/(eservice)', params: { url: data.url } });
        //    }
        // ─────────────────────────────────────────────────
      });

    // ── Cleanup on unmount ──────────────────────────────
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return { expoPushToken, notification, permissionGranted, error };
}
