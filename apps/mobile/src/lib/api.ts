import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiClient } from "@sinity/shared";

const TOKEN_KEY = "sinity_access_token";

// Android emulyatorda host mashinaning localhost'i 10.0.2.2 orqali ochiladi,
// veb va iOS simulyatorda esa to'g'ridan-to'g'ri localhost ishlaydi.
const API_BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:4000/api" : "http://localhost:4000/api";

let cachedToken: string | null = null;

export async function loadToken() {
  cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
  return cachedToken;
}

export async function setToken(token: string | null) {
  cachedToken = token;
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

export const api = new ApiClient({
  baseUrl: API_BASE_URL,
  getToken: () => cachedToken,
});
