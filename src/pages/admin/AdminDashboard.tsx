/**
 * 📦 Admin Dashboard - VaultKYC (Fixed for .tsx)
 *
 * This file implements the admin control panel with analytics,
 * submissions management, and blockchain visualization.
 */

import React, { useState } from "react";
import BlockchainVisualizer from "./BlockchainVisualizer";
import {
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  MessageSquare,
  Box,
  Download,
  Eye,
  X,
  ExternalLink,
} from "lucide-react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import {
  mockAnalytics,
  mockKYCSubmissions,
  mockComments,
  mockKycAuditLog,
  formatDate,
  formatDateTime,
  getStatusBadge,
} from "../../utils/mockData";

const AdminDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [submissionFilter, setSubmissionFilter] = useState("all");

  const analyticsCards = [
    {
      title: "Total Processed",
      value: mockAnalytics.totalProcessed.toLocaleString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Verified",
      value: mockAnalytics.verified.toLocaleString(),
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Pending Review",
      value: mockAnalytics.pending.toLocaleString(),
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "High Risk",
      value: mockAnalytics.highRisk.toLocaleString(),
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Re-KYC Requests",
      value: mockAnalytics.rekycRequests.toLocaleString(),
      icon: RefreshCw,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Avg Processing Time",
      value: mockAnalytics.avgProcessingTime,
      icon: Clock,
      color: "text-muted-foreground",
      bgColor: "bg-muted/10",
    },
  ];

  const filteredSubmissions = mockKYCSubmissions.filter((submission) => {
    if (submissionFilter === "all") return true;
    return submission.status === submissionFilter;
  });

  const handleStatusUpdate = (submissionId: string, newStatus: string) => {
    // TODO: Implement status update logic
    console.log("Update status:", submissionId, newStatus);
  };

  const handleExportReports = () => {
    // TODO: Implement report export
    console.log("Exporting reports...");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        title="Admin Control Panel"
        subtitle="Comprehensive KYC management and analytics"
      />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Time Range Filter */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Dashboard Overview
              </h1>
              <p className="text-muted-foreground">
                Real-time KYC analytics and system monitoring
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>

              <button
                onClick={handleExportReports}
                className="btn-secondary flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Reports
              </button>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {analyticsCards.map((card, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border border-border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground mb-1">
                    {card.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          {/* Blockchain Visualizer Box */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-3">
              <div className="bg-card rounded-lg border border-border">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-foreground">
                      Blockchain Visualizer
                    </h3>
                  </div>
                </div>
                <div className="p-6 flex justify-center items-center h-96">
                  <div className="w-full h-96">
                    <BlockchainVisualizer />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col xl:flex-row gap-8">
            {/* KYC Submissions Table */}
            <div className="flex-1 flex flex-col">
              <div className="bg-card rounded-lg border border-border h-full flex flex-col">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      Blockchain Transactions
                    </h3>
                  </div>
                </div>

                <div className="overflow-x-auto flex-grow">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                          KYC ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                          Face Match
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredSubmissions.slice(0, 10).map((submission) => (
                        <tr
                          key={submission.id}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="font-mono text-xs text-primary">
                              {submission.id}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-foreground text-sm">
                              {submission.name}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-foreground">
                              {submission.faceMatchScore}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-foreground">
                            {formatDate(submission.submissionDate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="flex-1 flex flex-col">
              {/* Blockchain Panel */}
              <div className="bg-card rounded-lg border border-border h-full flex flex-col">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-2">
                    <Box className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">
                      Audit Logs
                    </h3>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {mockKycAuditLog.map((log) => (
                    <div key={log.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          Block #{log.blockNumber ?? "—"}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full bg-accent/10 text-accent`}
                        >
                          {log.event.replace(/_/g, " ")}
                        </span>
                      </div>
                      {log.blockchainHash && (
                        <p className="text-xs font-mono text-muted-foreground break-all">
                          {log.blockchainHash}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary">
                          {log.kycId}
                        </span>
                        <span className="text-xs text-foreground">
                          {log.performedBy}
                        </span>
                        {log.blockchainHash && (
                          <a
                            href={`https://etherscan.io/tx/${log.blockchainHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center space-x-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View</span>
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDateTime(log.timestamp)}
                      </div>
                      {log.meta && (
                        <pre className="bg-muted text-xs p-2 rounded">
                          {JSON.stringify(log.meta, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
