/**
 * 📦 Staff Login Page - VaultKYC
 *
 * Authentication page for staff users.
 *
 * TODO for blockchain developer:
 * - Replace with MetaMask/Web3 wallet connection
 * - Add staff role verification via smart contract
 * - Implement delegated authentication for staff access
 * - Add time-based access controls
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Loader2, AlertCircle, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Footer from "../components/layout/Footer";

const StaffLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { state, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated && state.role === "staff") {
      navigate("/staff/dashboard");
    }
  }, [state.isAuthenticated, state.role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(username, password, "staff");
    if (success) {
      navigate("/staff/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/5 via-background to-secondary/10 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-accent to-secondary p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-accent-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Staff Portal
            </h1>
            <p className="text-muted-foreground">
              KYC verification and processing
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {state.error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{state.error}</p>
                </div>
              )}

              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Staff Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground"
                  placeholder="Enter staff username"
                  required
                  disabled={state.loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground"
                    placeholder="Enter password"
                    required
                    disabled={state.loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={state.loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-accent focus:ring-accent border-border rounded"
                  disabled={state.loading}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-muted-foreground"
                >
                  Keep me signed in
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={state.loading || !username || !password}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In to Portal</span>
                )}
              </button>
            </form>

            {/* footer */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <center>
                <p className="text-xs text-muted-foreground">
                  © 2025 ValutKYC. All rights reserved.
                  <br />
                  Empowering secure, decentralized identity verification with
                  trust and transparency.
                </p>
                <p className="text-xs text-warning mt-2">--</p>
              </center>
            </div>

            {/* Admin Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Administrator?{" "}
                <a
                  href="/admin-login"
                  className="text-primary hover:underline font-medium"
                >
                  Admin portal
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StaffLogin;
