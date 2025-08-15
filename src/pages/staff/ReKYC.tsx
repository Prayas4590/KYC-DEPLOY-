/**
 * 📦 Re-KYC Processing Page - VaultKYC Staff Portal
 * 
 * Allows staff to initiate re-KYC for users with expired verification.
 * Shows existing user data and allows updating documents and verification.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, RefreshCw, User, Calendar, CheckCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import VoluntaryReKYC from '../../components/kyc/VoluntaryReKYC';
import { Button } from '../../components/ui/button';
import { mockKYCSubmissions, type KYCSubmission } from '../../utils/mockData';
import { useToast } from '../../hooks/use-toast';

const ReKYC: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  
  const [selectedUser, setSelectedUser] = useState<KYCSubmission | null>(null);
  const [expiredUsers, setExpiredUsers] = useState<KYCSubmission[]>([]);

  useEffect(() => {
    // Filter users who need re-KYC (expired ONLY - no longer including "expiring soon")
    const now = new Date();
    
    const usersNeedingReKYC = mockKYCSubmissions.filter(submission => {
      const expiryDate = new Date(submission.expiryDate);
      return expiryDate <= now || submission.status === 'expired';
    });
    
    setExpiredUsers(usersNeedingReKYC);

    // If ID is provided, find the specific user
    if (id) {
      const user = mockKYCSubmissions.find(sub => sub.id === id);
      if (user) {
        const expiryDate = new Date(user.expiryDate);
        if (expiryDate <= now || user.status === 'expired') {
          setSelectedUser(user);
        } else {
          toast({
            title: "Re-KYC Not Required",
            description: "This user's KYC is still valid and doesn't require re-verification.",
            variant: "destructive"
          });
        }
      }
    }
  }, [id, toast]);

  const handleUserSelect = (user: KYCSubmission) => {
    setSelectedUser(user);
  };

  const handleStartReKYC = () => {
    if (!selectedUser) return;
    
    // Navigate to NewKYC with pre-filled data for re-KYC
    navigate('/staff/new-kyc', { 
      state: { 
        isReKYC: true, 
        existingData: selectedUser,
        originalKYCId: selectedUser.id
      } 
    });
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) <= new Date();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        title="Re-KYC Processing" 
        subtitle="Process re-verification for expired or expiring KYC records"
      />

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/staff/dashboard')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Expired Users */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h2 className="text-xl font-semibold text-foreground">Expired KYC Users</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Users whose KYC verification has expired and requires renewal
              </p>

              {expiredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <p className="text-muted-foreground">No expired KYC records found</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {expiredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedUser?.id === user.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-primary/5'
                      }`}
                      onClick={() => handleUserSelect(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">KYC ID: {user.id}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                            Expired
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Document: {user.documentType.replace('_', ' ').toUpperCase()}</span>
                        <span>•</span>
                        <span>Expired: {new Date(user.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Middle Panel - Voluntary Re-KYC */}
            <VoluntaryReKYC />

            {/* Right Panel - Selected User Details */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Re-KYC Details</h2>
              
              {selectedUser ? (
                <div className="space-y-6">
                  {/* User Information */}
                  <div>
                    <h3 className="font-medium text-foreground mb-3">User Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Name</p>
                        <p className="font-medium text-foreground">{selectedUser.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">KYC ID</p>
                        <p className="font-mono text-foreground">{selectedUser.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Document Type</p>
                        <p className="font-medium text-foreground">
                          {selectedUser.documentType.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Document Number</p>
                        <p className="font-mono text-foreground">{selectedUser.documentNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Expiry Information */}
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-destructive" />
                      <span className="font-medium text-destructive">Expired Status</span>
                    </div>
                    <p className="text-sm text-foreground">
                      KYC expired on {new Date(selectedUser.expiryDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Re-KYC Action */}
                  <div className="pt-4 border-t border-border">
                    <Button 
                      onClick={handleStartReKYC}
                      className="w-full"
                      size="lg"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Start Re-KYC Process
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      This will create a new KYC submission with updated documents
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a user from the list to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReKYC;