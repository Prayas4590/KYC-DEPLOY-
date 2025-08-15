/**
 * 📦 Staff Dashboard - VaultKYC
 * 
 * Main dashboard for staff users with three primary action cards:
 * 1. New KYC Submission
 * 2. Re-KYC Processing
 * 3. View Previous KYCs
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, FileText, TrendingUp, Clock, Users, CheckCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { mockAnalytics } from '../../utils/mockData';

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'New KYC Submission',
      description: 'Start fresh KYC verification process for new users',
      icon: Plus,
      action: 'Start New KYC',
      route: '/staff/new-kyc',
      gradient: 'gradient-primary',
      iconColor: 'text-white'
    },
    {
      title: 'Re-KYC Processing',
      description: 'Process re-verification for expired users or voluntary re-KYC requests',
      icon: RefreshCw,
      action: 'Select User for Re-KYC',
      route: '/staff/rekyc',
      gradient: 'bg-gradient-to-r from-warning to-warning/80',
      iconColor: 'text-white'
    },
    {
      title: 'View Previous KYCs',
      description: 'Access historical KYC records and submissions',
      icon: FileText,
      action: 'View KYC History',
      route: '/staff/kyc-history',
      gradient: 'bg-gradient-to-r from-success to-success/80',
      iconColor: 'text-white'
    }
  ];

  const quickStats = [
    {
      title: 'Today\'s Processed',
      value: '24',
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      title: 'Pending Review',
      value: mockAnalytics.pending.toString(),
      icon: Clock,
      color: 'text-warning'
    },
    {
      title: 'Total Users',
      value: mockAnalytics.totalProcessed.toString(),
      icon: Users,
      color: 'text-muted-foreground'
    },
    {
      title: 'Verified Today',
      value: '18',
      icon: CheckCircle,
      color: 'text-success'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        title="Staff KYC Portal" 
        subtitle="Identity verification and compliance management"
      />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome to VaultKYC Staff Portal
            </h1>
            <p className="text-muted-foreground">
              Manage KYC verifications, process re-submissions, and maintain compliance records.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {dashboardCards.map((card, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl border border-border overflow-hidden card-hover"
              >
                {/* Card Header with Gradient */}
                <div className={`${card.gradient} p-6 text-white`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold">{card.title}</h3>
                  </div>
                  <p className="text-white/90 text-sm">{card.description}</p>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <button
                    onClick={() => navigate(card.route)}
                    className="w-full btn-primary"
                  >
                    {card.action}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity Section */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">KYC-STF-000125 verified</p>
                    <p className="text-xs text-muted-foreground">Rajesh Kumar • 2 minutes ago</p>
                  </div>
                </div>
                <span className="status-badge status-verified">Verified</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">KYC-STF-000124 pending review</p>
                    <p className="text-xs text-muted-foreground">Priya Sharma • 15 minutes ago</p>
                  </div>
                </div>
                <span className="status-badge status-pending">Pending</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Re-KYC initiated for Mohammed Ali</p>
                    <p className="text-xs text-muted-foreground">Document expiry notification • 1 hour ago</p>
                  </div>
                </div>
                <span className="status-badge bg-primary/10 text-primary border-primary/20">Re-KYC</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/staff/kyc-history')}
                className="text-primary hover:underline text-sm font-medium"
              >
                View all activity →
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StaffDashboard;