/**
 * 📦 Authentication Utilities for VaultKYC
 * Combines password + MetaMask wallet authentication.
 */

export const ADMIN_WALLET = "0xBa225F7569e4ec27ddbcCbE9Ac418d26868877Ca".toLowerCase();
export const STAFF_WALLET = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266".toLowerCase();

// 🔍 User types
export interface User {
  username: string;
  password: string;
  role: 'admin' | 'staff';
  fullName: string;
  email: string;
  walletAddress: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: 'admin' | 'staff' | null;
  walletAddress: string | null;
}

// 🔐 Hardcoded user credentials
export const USERS: Record<'admin' | 'staff', User> = {
  admin: {
    username: "admin",
    password: "admin123",
    role: "admin",
    fullName: "Admin User",
    email: "admin@vaultkyc.com",
    walletAddress: "0xBa225F7569e4ec27ddbcCbE9Ac418d26868877Ca"
  },
  staff: {
    username: "staff",
    password: "staff123",
    role: "staff",
    fullName: "Staff Member",
    email: "staff@vaultkyc.com",
    walletAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  }
};

/**
 * 🧠 Combined Password + MetaMask Wallet Validation
 */
export const authenticateUser = async (
  username: string,
  password: string,
  role: 'admin' | 'staff'
): Promise<{ user: User; wallet: string } | null> => {
  // Step 1: Validate credentials
  const user = USERS[role];
  if (!(user.username === username && user.password === password)) {
    alert("Invalid username or password.");
    return null;
  }

  // Step 2: Check MetaMask
  if (!(window as any).ethereum) {
    alert("MetaMask not detected. Please install MetaMask.");
    return null;
  }

  try {
    const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    const connectedWallet = accounts[0].toLowerCase();

    const expectedWallet = role === 'admin' ? ADMIN_WALLET : STAFF_WALLET;

    if (connectedWallet !== expectedWallet) {
      alert("Connected wallet does not match expected wallet for this role.");
      return null;
    }

    return {
  user: { ...user, walletAddress: connectedWallet },
  wallet: connectedWallet
};

  } catch (error) {
    console.error("MetaMask authentication failed:", error);
    return null;
  }
};

// 🌐 Session Storage Helpers
export const AUTH_STORAGE_KEY = 'vaultkyc_auth';

export const saveAuthState = (authState: AuthState): void => {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  } catch (error) {
    console.error('Failed to save auth state:', error);
  }
};

export const loadAuthState = (): AuthState | null => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load auth state:', error);
    return null;
  }
};

export const clearAuthState = (): void => {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear auth state:', error);
  }
};

// 🔁 Routing
export const getRedirectPath = (role: 'admin' | 'staff'): string => {
  return role === 'admin' ? '/admin/dashboard' : '/staff/dashboard';
};

export const getLoginPath = (role: 'admin' | 'staff'): string => {
  return role === 'admin' ? '/admin-login' : '/staff-login';
};
