/**
 * 📦 Voluntary Re-KYC Request Component
 * 
 * Allows users to voluntarily request re-KYC verification
 * even if their current KYC is still valid.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, User, Search, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { mockKYCSubmissions } from '../../utils/mockData';
import { useToast } from '../../hooks/use-toast';

const VoluntaryReKYC: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Filter verified users for voluntary re-KYC
  const verifiedUsers = mockKYCSubmissions.filter(user => 
    user.status === 'verified' && 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.phone.includes(searchTerm))
  );

  const handleVoluntaryReKYC = () => {
    if (!selectedUser) return;
    
    toast({
      title: "Voluntary Re-KYC Initiated",
      description: `Starting voluntary re-KYC process for ${selectedUser.name}`,
    });

    // Navigate to NewKYC with voluntary re-KYC data
    navigate('/staff/new-kyc', { 
      state: { 
        isReKYC: true, 
        isVoluntary: true,
        existingData: selectedUser,
        originalKYCId: selectedUser.id
      } 
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <RefreshCw className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Voluntary Re-KYC Request</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-6">
        Allow verified users to voluntarily update their KYC information
      </p>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, KYC ID, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground"
        />
      </div>

      {/* User Selection */}
      {searchTerm && (
        <div className="max-h-64 overflow-y-auto mb-4">
          {verifiedUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No verified users found matching your search
            </p>
          ) : (
            <div className="space-y-2">
              {verifiedUsers.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedUser?.id === user.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{user.name}</h4>
                        <p className="text-xs text-muted-foreground">KYC ID: {user.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-success">Verified</span>
                      <p className="text-xs text-muted-foreground">
                        Valid until {new Date(user.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected User Info */}
      {selectedUser && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-foreground mb-2">Selected for Voluntary Re-KYC</h4>
          <div className="text-sm text-muted-foreground">
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Current Status:</strong> <span className="text-success">Verified</span></p>
            <p><strong>Valid Until:</strong> {new Date(selectedUser.expiryDate).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <Button 
        onClick={handleVoluntaryReKYC}
        disabled={!selectedUser}
        className="w-full"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Start Voluntary Re-KYC Process
      </Button>
    </div>
  );
};

export default VoluntaryReKYC;