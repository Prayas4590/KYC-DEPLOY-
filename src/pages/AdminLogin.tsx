/**
 * 📦 Admin Login Page - VaultKYC
 *
 * Authentication page for admin users.
 *
 * TODO for blockchain developer:
 * - Replace with MetaMask/Web3 wallet connection
 * - Add admin role verification via smart contract
 * - Implement multi-signature authentication for admin access
 * - Add hardware wallet support for enhanced security
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Footer from "../components/layout/Footer";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { state, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated && state.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [state.isAuthenticated, state.role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(username, password, "admin");
    if (success) {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="gradient-primary p-3 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              VaultKYC Admin
            </h1>
            <p className="text-muted-foreground">
              Secure administrative access portal
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
                  Admin Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  placeholder="Enter admin username"
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
                    className="w-full px-4 py-3 pr-12 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
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
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
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
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>Sign In as Admin</span>
                )}
              </button>
            </form>

            {/* footer */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-sm font-medium text-foreground mb-2"></p>
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

            {/* Staff Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Staff member?{" "}
                <a
                  href="/staff-login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in here
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

export default AdminLogin;
