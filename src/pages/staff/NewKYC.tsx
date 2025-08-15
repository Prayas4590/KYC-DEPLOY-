import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, User, FileText, Camera, Check, Shield } from "lucide-react";
import { AxiosError } from "axios";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

import UserDetailsPanel from "../../components/kyc/UserDetailsPanel";
import DocumentUploadPanel from "../../components/kyc/DocumentUploadPanel";
import FaceVerificationPanel from "../../components/kyc/FaceVerificationPanel";
import KYCConfirmation from "../../components/kyc/KYCConfirmation";
import KYCVerificationPanel from "../../components/kyc/KYCVerification";

import { generateKYCId } from "../../utils/mockData";
import api from "../../services/api";

export interface UserDetails {
  name: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  email: string;
  phone: string;
  altPhone: string;
  state: string;
}

export interface DocumentData {
  type: string;
  frontImage: File | null;
  backImage: File | null;
  documentNumber: string;
  issuer: string;
  multiDocData?: Record<
    string,
    { frontImage: File | null; backImage: File | null }
  >;
  kycExpiryDate?: string;
}

export interface FaceVerificationData {
  selfieImage: File | null;
  timestamp: string;
  matchScore: number;
  riskScore: number;
  passed: boolean;
}

export interface KYCFormData {
  kycId: string;
  userDetails: UserDetails;
  documentData: DocumentData;
  faceVerification: FaceVerificationData;
  consent: boolean;
  submittedAt?: string;
  kycExpiryDate?: string;
}

const NewKYC: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(0);
  const [isReKYC, setIsReKYC] = useState(false);
  const [originalKYCId, setOriginalKYCId] = useState("");
  const [formData, setFormData] = useState<KYCFormData>({
    kycId: generateKYCId(),
    userDetails: {
      name: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      email: "",
      phone: "",
      altPhone: "",
      state: "",
    },
    documentData: {
      type: "",
      frontImage: null,
      backImage: null,
      documentNumber: "",
      issuer: "",
      multiDocData: {},
    },
    faceVerification: {
      selfieImage: null,
      timestamp: "",
      matchScore: 0,
      riskScore: 0,
      passed: false,
    },
    consent: false,
    submittedAt: undefined,
    kycExpiryDate: undefined,
  });

  const [firstFrontImage, setFirstFrontImage] = useState<File | null>(null);

  useEffect(() => {
    const state = location.state as any;
    if (state?.isReKYC && state?.existingData) {
      setIsReKYC(true);
      setOriginalKYCId(state.originalKYCId || "");
      setFormData((prev) => ({
        ...prev,
        kycId: generateKYCId(),
        userDetails: {
          name: state.existingData.name || "",
          dateOfBirth: state.existingData.dateOfBirth || "",
          gender: "",
          address: state.existingData.address || "",
          email: state.existingData.email || "",
          phone: state.existingData.phone || "",
          altPhone: "",
          state: state.existingData.state || "",
        },
        documentData: {
          type: state.existingData.documentType || "",
          frontImage: null,
          backImage: null,
          documentNumber: state.existingData.documentNumber || "",
          issuer: "",
          multiDocData: {},
        },
        faceVerification: {
          selfieImage: null,
          timestamp: "",
          matchScore: 0,
          riskScore: 0,
          passed: false,
        },
        consent: false,
        submittedAt: undefined,
        kycExpiryDate: undefined,
      }));
    }
  }, [location.state]);

  // Single Source of Truth Updaters
  const updateUserDetails = (details: UserDetails) => {
    setFormData((prev) => ({ ...prev, userDetails: details }));
  };

  const updateDocumentData = (docData: DocumentData) => {
    setFormData((prev) => ({ ...prev, documentData: docData }));
  };

  const updateFaceVerification = (faceData: FaceVerificationData) => {
    setFormData((prev) => ({ ...prev, faceVerification: faceData }));
  };

  // Main KYC submission handler
  const handleSubmit = async () => {
    try {
      // Step 1: Save user details, receive real KYC ID
      const detailsResponse = await api.post("/kyc/details", {
        fullName: formData.userDetails.name,
        dob: formData.userDetails.dateOfBirth,
        gender: formData.userDetails.gender,
        address: formData.userDetails.address,
        email: formData.userDetails.email,
        state: formData.userDetails.state,
        phone: formData.userDetails.phone,
        altPhone: formData.userDetails.altPhone,
        aadhaarNumber: formData.documentData.documentNumber || undefined,
      });

      const {
        kycId: actualKycId,
        submittedAt,
        kycExpiryDate,
      } = detailsResponse.data;

      setFormData((prev) => ({
        ...prev,
        kycId: actualKycId,
        submittedAt,
        kycExpiryDate,
      }));

      // Step 2: Upload document images if available
      const docForm = new FormData();
      let docIndex = 0;
      Object.entries(formData.documentData.multiDocData || {}).forEach(
        ([type, files]) => {
          if (files.frontImage) {
            docForm.append("docs", files.frontImage, `${type}_front.jpg`);
            docForm.append(
              "docMeta",
              JSON.stringify({ index: docIndex, type })
            );
            docIndex++;
          }
          if (files.backImage) {
            docForm.append("docs", files.backImage, `${type}_back.jpg`);
            docForm.append(
              "docMeta",
              JSON.stringify({ index: docIndex, type })
            );
            docIndex++;
          }
        }
      );
      if (docIndex > 0) {
        await api.post(`/kyc/${actualKycId}/documents`, docForm);
      }

      // Step 3: Upload selfie if provided
      if (formData.faceVerification.selfieImage) {
        const selfieForm = new FormData();
        selfieForm.append(
          "selfie",
          formData.faceVerification.selfieImage,
          "selfie.jpg"
        );
        await api.post(`/kyc/${actualKycId}/selfie`, selfieForm);
      }

      // Step 4: Save consent
      await api.post(`/kyc/${actualKycId}/consent`, {
        consentGiven: formData.consent,
      });

      // Success: Go to confirmation
      navigate("/staff/kyc-confirmation", {
        state: {
          kycData: {
            ...formData,
            kycId: actualKycId,
            submittedAt,
            kycExpiryDate,
          },
        },
      });
    } catch (error) {
      let errorMessage = "Failed to submit KYC. Please try again.";
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 400) {
          errorMessage = `Validation failed: ${
            error.response.data?.error || "Please check your input."
          }`;
        } else if (error.response.status === 404) {
          errorMessage =
            "KYC ID not found. This might be a system error. Please contact support.";
        } else if (error.response.data && error.response.data.error) {
          errorMessage = `Submission failed: ${error.response.data.error}`;
        } else {
          errorMessage = `Submission failed with status ${error.response.status}.`;
        }
      } else if (error instanceof Error) {
        errorMessage = `An unexpected error occurred: ${error.message}`;
      }
      alert(errorMessage);
    }
  };

  // Step navigation handlers
  const handleNext = () => {
    const maxStep = 4;
    if (currentStep < maxStep) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // Stepper data
  const steps = [
    {
      number: 0,
      title: "User Details",
      icon: User,
      description: "Basic info & contact",
    },
    {
      number: 1,
      title: "Document Upload",
      icon: FileText,
      description: "Upload and verify identity document",
    },
    {
      number: 2,
      title: "KYC Verification",
      icon: Shield,
      description: "Verify KYC document & details",
    },
    {
      number: 3,
      title: "Biometric & Face Verification",
      icon: Camera,
      description: "Live biometric verification",
    },
    {
      number: 4,
      title: "Review & Submit",
      icon: Check,
      description: "Final submission of application",
    },
  ];

  // Render current step panel — always uses live parent state
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <UserDetailsPanel
            data={formData.userDetails}
            kycId={formData.kycId}
            onUpdate={updateUserDetails}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <DocumentUploadPanel
            data={formData.documentData}
            onUpdate={updateDocumentData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onFirstFrontImage={(file) => setFirstFrontImage(file)}
          />
        );
      case 2:
        return (
          <KYCVerificationPanel
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <FaceVerificationPanel
            data={formData.faceVerification}
            documentImage={firstFrontImage}
            onUpdate={updateFaceVerification}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        // CRITICALLY IMPORTANT:
        // Here, you must ensure the KYC Card or summary inside KYCConfirmation
        // receives all its fields as props directly from formData.userDetails
        return (
          <KYCConfirmation
            formData={formData}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
            onConsentChange={(consent) =>
              setFormData((prev) => ({ ...prev, consent }))
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        title={isReKYC ? "Re-KYC Submission" : "New KYC Submission"}
        subtitle={`Processing ID: ${formData.kycId}${
          isReKYC ? ` (Original: ${originalKYCId})` : ""
        }`}
      />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/staff/dashboard")}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        currentStep >= step.number
                          ? "bg-primary border-primary text-white"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div className="hidden md:block">
                      <p
                        className={`text-sm font-medium ${
                          currentStep >= step.number
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 md:w-20 h-0.5 mx-4 ${
                        currentStep > step.number ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-8">
            {renderStepContent()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewKYC;
