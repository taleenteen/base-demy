import { API_BASE_URL } from "../constants";
import { getToken } from "../utils/storage";

export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = await getToken();
  const fullUrl = `${API_BASE_URL}${endpoint}`;

  console.log("──────────────────────────────────────");
  console.log(`🌐 [API] ${options.method ?? "GET"} ${fullUrl}`);
  console.log(
    `🔑 [API] Token: ${token ? `${token.substring(0, 20)}...` : "None"}`,
  );
  if (options.body) {
    console.log(`📦 [API] Body:`, options.body);
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: headers as any,
    });

    console.log(`📡 [API] Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorMessage = "An error occurred";
      try {
        const errorData = await response.json();
        console.log(
          "❌ [API] Error Response:",
          JSON.stringify(errorData, null, 2),
        );
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.log("❌ [API] Could not parse error response body");
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(
      "✅ [API] Success Response:",
      JSON.stringify(data, null, 2).substring(0, 500),
    );
    console.log("──────────────────────────────────────");
    return data as T;
  } catch (error: any) {
    if (error.message === "Network request failed") {
      console.log("🔥 [API] NETWORK ERROR — ไม่สามารถเชื่อมต่อกับ server ได้");
      console.log(`   ➜ ตรวจสอบว่า server เปิดอยู่ที่ ${API_BASE_URL}`);
      console.log("   ➜ ตรวจสอบว่ามือถือกับ server อยู่ WiFi เดียวกัน");
    } else {
      console.log("🔥 [API] Error:", error.message);
    }
    console.log("──────────────────────────────────────");
    throw error;
  }
};
