/**
 * 📦 KYC History Page - Staff Portal
 * 
 * Displays historical KYC records with filtering and search capabilities.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Eye, RefreshCw, Download, Calendar } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { mockKYCSubmissions, KYCSubmission, formatDate, getStatusBadge } from '../../utils/mockData';

const KYCHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredSubmissions = mockKYCSubmissions.filter((submission) => {
    const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const submissionDate = new Date(submission.submissionDate);
      const now = new Date();
      
      switch (dateFilter) {
        case 'today':
          return submissionDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return submissionDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return submissionDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewKYC = (submission: KYCSubmission) => {
    // Navigate to detailed view (implement this route)
    console.log('View KYC:', submission);
  };

  const handleReKYC = (submission: KYCSubmission) => {
    navigate(`/staff/rekyc/${submission.id}`);
  };

  const exportData = () => {
    // TODO: Implement CSV/PDF export
    console.log('Exporting data...');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        title="KYC History" 
        subtitle="View and manage historical KYC records"
      />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/staff/dashboard')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Header Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">KYC History</h1>
              <p className="text-muted-foreground">
                {filteredSubmissions.length} of {mockKYCSubmissions.length} records
              </p>
            </div>
            
            <button
              onClick={exportData}
              className="btn-secondary mt-4 md:mt-0"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </button>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, KYC ID, or phone..."
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                  <option value="rekyc_requested">Re-KYC Requested</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date Range
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">KYC ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Document Type</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Face Match</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Submission Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Expiry</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-primary">{submission.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{submission.name}</p>
                          <p className="text-sm text-muted-foreground">{submission.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-foreground">
                          {submission.documentType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">{submission.faceMatchScore}%</span>
                          <div className={`w-2 h-2 rounded-full ${
                            submission.faceMatchScore >= 90 ? 'bg-success' :
                            submission.faceMatchScore >= 75 ? 'bg-warning' : 'bg-destructive'
                          }`}></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`status-badge ${getStatusBadge(submission.status)}`}>
                          {submission.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {formatDate(submission.submissionDate)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-foreground">{formatDate(submission.expiryDate)}</p>
                          {new Date(submission.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                            <p className="text-warning text-xs">Expires soon</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewKYC(submission)}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReKYC(submission)}
                            className="p-2 text-muted-foreground hover:text-warning transition-colors"
                            title="Re-KYC"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredSubmissions.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No KYC records found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination would go here */}
          {filteredSubmissions.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredSubmissions.length} results
              </p>
              {/* Add pagination component here if needed */}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default KYCHistory;