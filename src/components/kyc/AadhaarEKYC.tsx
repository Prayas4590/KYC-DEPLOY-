/**
 * 📦 Aadhaar eKYC Component - VaultKYC
 * 
 * Online Aadhaar verification with OTP authentication
 * Pulls data from UIDAI mock and performs face matching
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Shield, Phone, Eye, CheckCircle, AlertCircle, Loader,ShieldCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';

// 📊 Aadhaar eKYC Interfaces
export interface AadhaarData {
  aadhaarNumber: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  mobileNumber: string;
  photo: string; // Base64 or URL
  fatherName: string;
  pincode: string;
}

export interface AadhaarEKYCProps {
  onSuccess: (data: AadhaarData) => void;
  onBack: () => void;
}

// 🔐 Hardcoded OTP for verification
const HARDCODED_OTP = "123456";

// 📋 Mock UIDAI Database
const mockUIDAIData: { [key: string]: AadhaarData } = {
  "1234-5678-9012": {
    aadhaarNumber: "1234-5678-9012",
    name: "Rajesh Kumar Singh",
    dateOfBirth: "1985-03-15",
    gender: "Male",
    address: "House No. 123, MG Road, Gandhi Nagar, Bangalore, Karnataka",
    mobileNumber: "+91-9876543210",
    photo: "/placeholder.svg", // Mock photo URL
    fatherName: "Ramesh Kumar Singh",
    pincode: "560001"
  },
  "2345-6789-0123": {
    aadhaarNumber: "2345-6789-0123",
    name: "Priya Sharma",
    dateOfBirth: "1990-07-22",
    gender: "Female",
    address: "Flat 456, Park Street, Nehru Place, New Delhi, Delhi",
    mobileNumber: "+91-9876543211",
    photo: "/placeholder.svg",
    fatherName: "Suresh Sharma",
    pincode: "110001"
  },
  "3456-7890-1234": {
    aadhaarNumber: "3456-7890-1234",
    name: "Mohammed Ali Khan",
    dateOfBirth: "1988-12-10",
    gender: "Male",
    address: "Plot 789, Jubilee Hills, Hyderabad, Telangana",
    mobileNumber: "+91-9876543212",
    photo: "/placeholder.svg",
    fatherName: "Abdul Rahman Khan",
    pincode: "500033"
  }
};

const AadhaarEKYC: React.FC<AadhaarEKYCProps> = ({ onSuccess, onBack }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aadhaarData, setAadhaarData] = useState<AadhaarData | null>(null);
  const [faceMatchScore, setFaceMatchScore] = useState(0);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Format Aadhaar number with dashes
  const formatAadhaarNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 8) return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 8)}-${numbers.slice(8, 12)}`;
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaarNumber(e.target.value);
    if (formatted.length <= 14) {
      setAadhaarNumber(formatted);
    }
  };

  const sendOTP = async () => {
    if (aadhaarNumber.length !== 14) {
      toast({
        title: "Invalid Aadhaar Number",
        description: "Please enter a valid 12-digit Aadhaar number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Check if Aadhaar exists in mock database
      if (mockUIDAIData[aadhaarNumber]) {
        setOtpSent(true);
        setCountdown(30);
        setCurrentStep(2);
        toast({
          title: "OTP Sent Successfully",
          description: `OTP sent to ${mockUIDAIData[aadhaarNumber].mobileNumber.slice(-4).padStart(10, '*')}`,
        });
      } else {
        toast({
          title: "Aadhaar Not Found",
          description: "This Aadhaar number is not registered or invalid",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 2000);
  };

  const verifyOTP = async () => {
    if (enteredOTP !== HARDCODED_OTP) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // Simulate UIDAI data fetching
    setTimeout(() => {
      const userData = mockUIDAIData[aadhaarNumber];
      setAadhaarData(userData);
      
      // Simulate face match score (random between 85-98 for demo)
      const matchScore = Math.floor(Math.random() * (98 - 85 + 1)) + 85;
      setFaceMatchScore(matchScore);
      
      setCurrentStep(3);
      setLoading(false);
      
      toast({
        title: "OTP Verified Successfully",
        description: "Fetching your details from UIDAI database...",
      });
    }, 2000);
  };

  const resendOTP = () => {
    if (countdown === 0) {
      setCountdown(30);
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your registered mobile number",
      });
    }
  };

  const confirmDetails = () => {
    if (aadhaarData) {
      toast({
        title: "eKYC Completed Successfully",
        description: "Your Aadhaar verification is complete",
      });
      onSuccess(aadhaarData);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Aadhaar eKYC Verification</h2>
        <p className="text-muted-foreground">
          Verify your identity instantly using your Aadhaar number
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Enter your 12-digit Aadhaar number</li>
          <li>• OTP will be sent to your registered mobile number</li>
          <li>• Your details will be fetched from UIDAI database</li>
          <li>• Face matching will be performed for additional security</li>
        </ul>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Aadhaar Number
          </label>
          <input
            type="text"
            value={aadhaarNumber}
            onChange={handleAadhaarChange}
            placeholder="XXXX-XXXX-XXXX"
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground text-center text-lg tracking-wider font-mono"
            maxLength={14}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter your 12-digit Aadhaar number
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Demo Mode:</strong> Use these test Aadhaar numbers:<br/>
            1234-5678-9012, 2345-6789-0123, or 3456-7890-1234
          </p>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={sendOTP} 
            disabled={loading || aadhaarNumber.length !== 14}
            className="flex-1"
          >
            {loading ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Phone className="h-4 w-4 mr-2" />
            )}
            Send OTP
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Enter OTP</h2>
        <p className="text-muted-foreground">
          OTP sent to {aadhaarData?.mobileNumber || mockUIDAIData[aadhaarNumber]?.mobileNumber.slice(-4).padStart(10, '*')}
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <p className="text-sm text-green-800 dark:text-green-200 text-center">
          <strong>Demo OTP:</strong> {HARDCODED_OTP}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Enter 6-digit OTP
          </label>
          <input
            type="text"
            value={enteredOTP}
            onChange={(e) => setEnteredOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="XXXXXX"
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground text-center text-2xl tracking-widest font-mono"
            maxLength={6}
          />
        </div>

        <div className="text-center">
          <button
            onClick={resendOTP}
            disabled={countdown > 0}
            className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
          >
            {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
          </button>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={verifyOTP} 
            disabled={loading || enteredOTP.length !== 6}
            className="flex-1"
          >
            {loading ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Verify OTP
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Details Verified</h2>
        <p className="text-muted-foreground">
          Your information has been successfully fetched from UIDAI
        </p>
      </div>

      {aadhaarData && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center space-x-4 pb-4 border-b border-border">
            <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={aadhaarData.photo} 
                alt="Aadhaar Photo" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `data:image/svg+xml;base64,${btoa(`
                    <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                      <rect width="80" height="80" fill="#f3f4f6"/>
                      <text x="40" y="45" text-anchor="middle" font-size="24" fill="#6b7280">👤</text>
                    </svg>
                  `)}`;
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{aadhaarData.name}</h3>
              <p className="text-sm text-muted-foreground">Aadhaar: {aadhaarData.aadhaarNumber}</p>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                faceMatchScore >= 90 ? 'bg-success/10 text-success' : 
                faceMatchScore >= 75 ? 'bg-warning/10 text-warning' : 
                'bg-destructive/10 text-destructive'
              }`}>
                <Eye className="h-3 w-3 mr-1" />
                Face Match: {faceMatchScore}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date of Birth</p>
              <p className="font-medium text-foreground">{new Date(aadhaarData.dateOfBirth).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gender</p>
              <p className="font-medium text-foreground">{aadhaarData.gender}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Mobile Number</p>
              <p className="font-medium text-foreground">{aadhaarData.mobileNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Father's Name</p>
              <p className="font-medium text-foreground">{aadhaarData.fatherName}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Address</p>
              <p className="font-medium text-foreground">{aadhaarData.address}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={confirmDetails} className="flex-1">
          <CheckCircle className="h-4 w-4 mr-2" />
          Confirm Details
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground'
            }`}>
              {step}
            </div>
            {index < 2 && (
              <div className={`w-12 h-0.5 mx-2 ${
                currentStep > step ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </div>
  );
};

export default AadhaarEKYC;