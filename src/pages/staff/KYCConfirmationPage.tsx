/**
 * 📦 KYC Confirmation Page - Success confirmation after submission
 * 
 * Displays confirmation message and submission details after successful KYC submission.
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Calendar, Clock, User } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import KycIdCard from '../../components/kyc/KycIdCard';
import { KYCFormData } from './NewKYC';

const KYCConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const kycData = location.state?.kycData as KYCFormData;

  // If no data is available, redirect to dashboard
  if (!kycData) {
    navigate('/staff/dashboard');
    return null;
  }

  const submissionDate = new Date();
  const expiryDate = new Date(Date.now() + 14 * 30 * 24 * 60 * 60 * 1000);

  const handleDownloadCard = () => {
    // TODO: Implement PDF generation for the KYC card
    console.log('Downloading KYC card as PDF...');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        title="KYC Submission Confirmed" 
        subtitle="Application successfully submitted"
      />

      <main className="flex-1 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/staff/dashboard')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              KYC Application Submitted Successfully
            </h1>
            <p className="text-lg text-muted-foreground">
              The application has been processed and is now ready for review.
            </p>
          </div>

          {/* Submission Details */}
          <div className="bg-card border border-border rounded-xl p-8 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Submission Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">KYC ID</p>
                  <p className="font-mono text-lg font-medium text-foreground">{kycData.kycId}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Applicant Name</p>
                  <p className="text-lg font-medium text-foreground">{kycData.userDetails.name}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Document Type</p>
                  <p className="text-lg font-medium text-foreground capitalize">
                    {kycData.documentData.type.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Submission Date</p>
                    <p className="text-lg font-medium text-foreground">
                      {submissionDate.toLocaleDateString()} at {submissionDate.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Validity Period</p>
                    <p className="text-lg font-medium text-foreground">
                      Until {expiryDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Verification Status</p>
                    <p className={`text-lg font-medium ${
                      kycData.faceVerification.passed ? 'text-success' : 'text-warning'
                    }`}>
                      {kycData.faceVerification.passed ? 'Verified' : 'Pending Review'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Next Steps</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">
                  The KYC application has been added to the review queue
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">
                  {kycData.faceVerification.passed 
                    ? 'Automated verification passed - processing will be expedited'
                    : 'Manual review required due to verification concerns'
                  }
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground">
                  You can track the status in the KYC History section
                </p>
              </div>
            </div>
          </div>

          {/* KYC ID Card */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">Your Digital KYC Verification Card</h3>
            <KycIdCard
              userName={kycData.userDetails.name}
              dateOfBirth={kycData.userDetails.dateOfBirth}
              gender={kycData.userDetails.gender}
              kycId={kycData.kycId}
              documentType={kycData.documentData.type}
              documentNumber={kycData.documentData.documentNumber}
              phoneNumber={kycData.userDetails.phone}
              isVerified={kycData.faceVerification.passed}
              submissionDate={submissionDate.toISOString()}
              validUntil={expiryDate.toISOString()}
              reviewerId="STF001"
              onDownload={handleDownloadCard}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/staff/kyc-history')}
              className="btn-secondary"
            >
              View KYC History
            </button>
            <button
              onClick={() => navigate('/staff/new-kyc')}
              className="btn-primary"
            >
              Submit Another KYC
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default KYCConfirmationPage;