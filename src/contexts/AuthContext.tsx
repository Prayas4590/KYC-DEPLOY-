/**
 * 📦 Authentication Context for VaultKYC
 *
 * Manages user authentication state across the application.
 *
 * Note: MetaMask/Web3 wallet login is disabled. `walletAddress` will remain null.
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  AuthState,
  User,
  authenticateUser,
  saveAuthState,
  loadAuthState,
  clearAuthState,
} from "../utils/auth";

// 🔄 Auth Action Types
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "RESTORE_SESSION"; payload: AuthState };

// 📊 Extended Auth State
interface ExtendedAuthState extends AuthState {
  loading: boolean;
  error: string | null;
}

// 🎯 Auth Context Type
interface AuthContextType {
  state: ExtendedAuthState;
  login: (
    username: string,
    password: string,
    role: "admin" | "staff"
  ) => Promise<boolean>;
  logout: () => void;
}

// 🏭 Initial State — walletAddress kept for type safety but null
const initialState: ExtendedAuthState = {
  isAuthenticated: false,
  user: null,
  role: null,
  loading: false,
  error: null,
  walletAddress: null, // always null since MetaMask is removed
};

// 🔄 Auth Reducer
const authReducer = (
  state: ExtendedAuthState,
  action: AuthAction
): ExtendedAuthState => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        role: action.payload.role,
        error: null,
        walletAddress: null, // MetaMask disabled
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        role: null,
        error: action.payload,
        walletAddress: null,
      };

    case "LOGOUT":
      return {
        ...initialState,
      };

    case "RESTORE_SESSION":
      return {
        ...state,
        ...action.payload,
        walletAddress: null, // even if storage had it, disable usage
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

// 🎯 Create Context
const AuthContext = createContext<AuthContextType | null>(null);

// 🏗️ Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 🔄 Restore session on app load
  useEffect(() => {
    const storedAuth = loadAuthState();
    if (storedAuth && storedAuth.isAuthenticated) {
      // Enforce walletAddress null for non-MetaMask
      dispatch({
        type: "RESTORE_SESSION",
        payload: {
          ...storedAuth,
          walletAddress: null,
        },
      });
    }
  }, []);

  // 💾 Save auth state to localStorage when it changes
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      saveAuthState({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        role: state.role,
        walletAddress: null, // Always null
      });
    }
  }, [state.isAuthenticated, state.user, state.role]);

  // 🔐 Login function
  const login = async (
    username: string,
    password: string,
    role: "admin" | "staff"
  ): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const result = await authenticateUser(username, password, role);

      if (result) {
        const { user } = result;
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        return true;
      } else {
        dispatch({
          type: "LOGIN_ERROR",
          payload: "Invalid credentials",
        });
        return false;
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: "Login failed. Please try again.",
      });
      return false;
    }
  };

  // 🚪 Logout function
  const logout = (): void => {
    clearAuthState();
    dispatch({ type: "LOGOUT" });
  };

  const value: AuthContextType = {
    state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 🪝 Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
