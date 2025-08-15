/**
 * 📦 Footer Component - VaultKYC
 * 
 * Security compliance footer shown on all pages.
 * Displays security badges and legal links.
 */

import React from 'react';
import { Shield, Lock, FileCheck, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="px-6 py-4">
        {/* Security Badges */}
        <div className="flex items-center justify-center space-x-8 mb-4">
          <div className="flex items-center space-x-2 text-success">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">GDPR Compliant</span>
          </div>
          
          <div className="flex items-center space-x-2 text-primary">
            <FileCheck className="h-4 w-4" />
            <span className="text-sm font-medium">Blockchain-Backed Integrity</span>
          </div>
          
          <div className="flex items-center space-x-2 text-warning">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">End-to-End Encryption</span>
          </div>
          
          <div className="flex items-center space-x-2 text-accent-foreground">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">ISO 27001 Certified</span>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">About</a>
          <span>•</span>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <span>•</span>
          <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
        </div>

        {/* Copyright */}
        <div className="text-center mt-3 text-xs text-muted-foreground">
          © 2024 VaultKYC. All rights reserved. | Powered by Blockchain Technology
        </div>
      </div>
    </footer>
  );
};

export default Footer;