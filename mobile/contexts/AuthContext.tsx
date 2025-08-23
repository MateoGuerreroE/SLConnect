import { AuthService } from "@/services/auth";
import { UserRecord } from "@slchatapp/shared";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: UserRecord | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  const refreshToken = async () => {
    try {
      const newToken = await AuthService.refreshTokenAttempt();
      console.log("Token refreshed:", newToken);
    } catch (e) {
      console.error("Token refresh error:", e);
      setUser(null); // Log out user if token refresh fails
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const currentUser = await AuthService.getCurrentUser();
      const isAuth = await AuthService.isAuthenticated();

      if (currentUser && isAuth) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
