import { ControllerResponse } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserLoginResponse } from "@slchatapp/shared";
import api from "./api";

export class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<UserLoginResponse> {
    try {
      const { data: response } = await api.post<
        ControllerResponse<UserLoginResponse>
      >("/user/login", {
        emailAddress: email,
        password,
      });

      if (response.isSuccess) {
        const { user, token, refreshToken } = response.data;

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        return response.data;
      }

      throw new Error("Invalid credentials");
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`Login failed: ${e.message}: ${e.cause}`);
      }
      throw new Error("Login failed: Unknown error");
    }
  }

  static async logout(): Promise<void> {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const userId = JSON.parse(user).userId;
        if (userId) {
          await api.get("/user/logout?user=" + userId);
        }

        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("refreshToken");
        await AsyncStorage.removeItem("user");
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`Logout failed: ${e.message}: ${e.cause}`);
      }
      throw new Error("Logout failed: Unknown error");
    }
  }

  static async refreshTokenAttempt(): Promise<string> {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const { data: response } = await api.get<
        ControllerResponse<UserLoginResponse>
      >("/user/refresh-token", {
        headers: { "x-refresh-token": refreshToken },
      });

      if (response.isSuccess) {
        const { token: newToken } = response.data;
        await AsyncStorage.setItem("token", newToken);
        return newToken;
      }

      // If refresh token fails, clear session
      await AuthService.logout();
      throw new Error(response.error);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`Token refresh failed: ${e.message}: ${e.cause}`);
      }
      throw new Error("Token refresh failed: Unknown error");
    }
  }

  static async getCurrentUser() {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  static async getToken() {
    return AsyncStorage.getItem("token");
  }

  static async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem("token");
    return !!token;
  }
}
