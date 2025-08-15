/**
 * 📦 VaultKYC Landing Page - Main Dashboard
 * 
 * Entry point to the KYC platform with comprehensive feature showcase
 */

import React from 'react';
import { 
  Shield, 
  ArrowRight, 
  FileText, 
  Camera, 
  CheckCircle, 
  Scan, 
  Lock, 
  BarChart3, 
  Globe, 
  RefreshCw,
  Eye,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "AI-based Face Match",
      description: "Advanced facial recognition with 95%+ accuracy"
    },
    {
      icon: Scan,
      title: "OCR Document Parsing", 
      description: "Automated data extraction from ID documents"
    },
    {
      icon: Shield,
      title: "Blockchain Verification",
      description: "Immutable record keeping with cryptographic proof"
    },
    {
      icon: FileText,
      title: "PDF KYC Reports",
      description: "Comprehensive verification reports and certificates"
    },
    {
      icon: RefreshCw,
      title: "Re-KYC Support",
      description: "Automated renewal and re-verification workflow"
    },
    {
      icon: Eye,
      title: "Admin Risk Monitoring",
      description: "Real-time fraud detection and risk assessment"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Live dashboards with verification metrics"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Support for multiple languages and regions"
    }
  ];

  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Fill User Details",
      description: "Enter personal information and contact details"
    },
    {
      number: "02", 
      icon: Scan,
      title: "Upload & Scan Documents",
      description: "AI-powered OCR extracts data from ID documents"
    },
    {
      number: "03",
      icon: Camera,
      title: "Capture Selfie + Verify",
      description: "Live face detection with anti-spoofing technology"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="gradient-primary p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">VaultKYC</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              
              <div className="flex items-center space-x-3">
                <a href="/staff-login" className="btn-secondary">
                  <Users className="h-4 w-4 mr-2" />
                  Staff Login
                </a>
                <a href="/admin-login" className="btn-primary">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-hero text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Secure. Fast. Verified — Your Trusted KYC Gateway
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            AI-Powered Identity Verification with Blockchain Integrity
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="/staff-login" className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Staff Portal</span>
            </a>
            <a href="/admin-login" className="bg-white/10 text-white hover:bg-white/20 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Admin Portal</span>
            </a>
            <button className="text-white hover:text-white/80 transition-colors flex items-center space-x-2">
              <span>Explore Features</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple 3-step verification process</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="gradient-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Platform Features</h2>
            <p className="text-xl text-muted-foreground">Comprehensive KYC solution with cutting-edge technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6 card-hover">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-16 bg-gradient-to-r from-success/5 to-primary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Lock className="h-8 w-8 text-success mb-3" />
              <h4 className="font-semibold text-foreground">End-to-End Encryption</h4>
              <p className="text-sm text-muted-foreground">Military-grade security</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <h4 className="font-semibold text-foreground">GDPR Compliant</h4>
              <p className="text-sm text-muted-foreground">Privacy regulations ready</p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="h-8 w-8 text-success mb-3" />
              <h4 className="font-semibold text-foreground">Blockchain Audit Trail</h4>
              <p className="text-sm text-muted-foreground">Immutable verification records</p>
            </div>
            <div className="flex flex-col items-center">
              <FileText className="h-8 w-8 text-warning mb-3" />
              <h4 className="font-semibold text-foreground">Compliance Ready</h4>
              <p className="text-sm text-muted-foreground">Indian IT Act certified</p>
            </div>
          </div>
        </div>
      </section>

      {/* System Stats */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">12,450+</div>
              <p className="text-muted-foreground">Total Verified Users</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">&lt; 1 min</div>
              <p className="text-muted-foreground">Avg Time to Verify</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-warning mb-2">8,123</div>
              <p className="text-muted-foreground">Blockchain Confirmed KYCs</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-foreground mb-2">99.8%</div>
              <p className="text-muted-foreground">System Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="gradient-primary p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-foreground">VaultKYC</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Blockchain-powered identity verification platform for the modern world.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Compliance</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Sales</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 VaultKYC. All rights reserved. | Powered by Blockchain Technology
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;