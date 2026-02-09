import { removeToken, saveToken } from "@/utils/storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoading = false;

      // Persist to storage
      if (typeof window !== "undefined") {
        saveToken(action.payload.accessToken);
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("userData", JSON.stringify(action.payload.user));
      }
    },
    clearUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.refreshToken = null;
      state.isLoading = false;

      // Clear from storage
      if (typeof window !== "undefined") {
        removeToken();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");

        // Trigger logout event for other tabs
        localStorage.setItem("logoutEvent", Date.now().toString());
        localStorage.removeItem("logoutEvent");
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logoutFromOtherTab: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.refreshToken = null;
      state.isLoading = false;
    },
    rehydrateAuth: (state) => {
      if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("accessToken") || localStorage.getItem("MobileViewAdmin");
        const refreshToken = localStorage.getItem("refreshToken");
        const userData = localStorage.getItem("userData");

        if (accessToken && userData) {
          try {
            const user = JSON.parse(userData);
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
          } catch (error) {
            console.error("Error rehydrating auth state:", error);
            // Clear invalid data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("MobileViewAdmin");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userData");
            state.isAuthenticated = false;
          }
        } else if (accessToken && !userData) {
          // Inconsistent state: token exists but no user data
          // Clear it to be safe
          localStorage.removeItem("accessToken");
          localStorage.removeItem("MobileViewAdmin");
          localStorage.removeItem("refreshToken");
          state.isAuthenticated = false;
        }
      }
      state.isLoading = false;
    },
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  rehydrateAuth,
  logoutFromOtherTab,
} = authSlice.actions;
export default authSlice.reducer;

