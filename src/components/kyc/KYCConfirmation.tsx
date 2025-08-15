import React from "react";
import { User, FileText, Camera, Shield, AlertTriangle } from "lucide-react";
import { KYCFormData } from "../../pages/staff/NewKYC";

interface KYCConfirmationProps {
  formData: KYCFormData;
  onSubmit: () => void;
  onPrevious: () => void;
  onConsentChange: (consent: boolean) => void;
}

const kycIdName = "kamran";
const kycHash =
  "0x111e7a3b40a1de982b6445703b271e2bea222ab3a8567ba2f3b439b509ea3c87";
const timestamp = Date.now();

export async function callKycToChain(kycIdName, kycHash, timestamp) {
  const response = await fetch("http://localhost:7000/kyctochain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kycIdName, kycHash, timestamp }),
  });
  return response.json();
}

const KYCConfirmation: React.FC<KYCConfirmationProps> = ({
  formData,
  onSubmit,
  onPrevious,
  onConsentChange,
}) => {
  const { userDetails, documentData, faceVerification } = formData;

  return (
    <div className="space-y-8">
      {/* === Header Section === */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Review & Submit
        </h2>
        <p className="text-muted-foreground">
          Please review all information before submitting the KYC application.
        </p>
      </div>

      {/* === User Details Summary Card === */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium text-foreground">User Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Full Name</p>
            <p className="font-medium text-foreground">{userDetails.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date of Birth</p>
            <p className="font-medium text-foreground">
              {userDetails.dateOfBirth}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Gender</p>
            <p className="font-medium capitalize text-foreground">
              {userDetails.gender}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium text-foreground">{userDetails.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="font-medium text-foreground">{userDetails.phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Address</p>
            <p className="font-medium text-foreground">{userDetails.address}</p>
          </div>
          <div>
            <p className="text-muted-foreground">State</p>
            <p
              className={`font-medium ${
                userDetails.state ? "text-foreground" : "text-destructive"
              }`}
            >
              {userDetails.state || "Not Provided"}
            </p>
          </div>
        </div>
      </div>

      {/* === Document Details Summary Card === */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium text-foreground">
            Document Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Document Type</p>
            <p className="font-medium text-foreground capitalize">
              {documentData.type.replace("_", " ")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Document Number</p>
            <p className="font-medium text-foreground">
              {documentData.documentNumber}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Issuer</p>
            <p className="font-medium text-foreground">{documentData.issuer}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Expiry Date</p>
            <p className="font-medium text-foreground">
              {documentData.kycExpiryDate}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Front Image</p>
            <p className="font-medium text-success">✓ Uploaded</p>
          </div>
          {documentData.backImage && (
            <div>
              <p className="text-muted-foreground">Back Image</p>
              <p className="font-medium text-success">✓ Uploaded</p>
            </div>
          )}
        </div>
      </div>

      {/* === Face Verification Summary === */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Camera className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium text-foreground">
            Face Verification
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">
              {faceVerification.matchScore}%
            </p>
            <p className="text-sm text-muted-foreground">Face Match Score</p>
          </div>
          <div>
            <p
              className={`text-2xl font-bold ${
                faceVerification.riskScore < 30
                  ? "text-success"
                  : faceVerification.riskScore < 60
                  ? "text-warning"
                  : "text-destructive"
              }`}
            >
              {faceVerification.riskScore}
            </p>
            <p className="text-sm text-muted-foreground">Risk Score</p>
          </div>
          <div>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                faceVerification.passed
                  ? "bg-success/10 text-success"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {faceVerification.passed ? "PASSED" : "FAILED"}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Verification Status
            </p>
          </div>
        </div>
      </div>

      {/* === Risk Assessment Section === */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium text-foreground">
            Risk Assessment
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Overall Risk Level</p>
            <p
              className={`font-medium ${
                faceVerification.riskScore < 30
                  ? "text-success"
                  : faceVerification.riskScore < 60
                  ? "text-warning"
                  : "text-destructive"
              }`}
            >
              {faceVerification.riskScore < 30
                ? "Low Risk"
                : faceVerification.riskScore < 60
                ? "Medium Risk"
                : "High Risk"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Compliance Status</p>
            <p className="font-medium text-success">Compliant</p>
          </div>
          <div>
            <p className="text-muted-foreground">Recommendation</p>
            <p className="font-medium text-primary">
              {faceVerification.passed ? "Approve" : "Review Required"}
            </p>
          </div>
        </div>
      </div>

      {/* === Warning Message (if verification failed) === */}
      {!faceVerification.passed && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">
                Verification Failed
              </p>
              <p className="text-sm text-destructive/80">
                The face verification did not meet the required threshold.
                Manual review is required.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* === Consent Checkbox === */}
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <input
            id="consent"
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => onConsentChange(e.target.checked)}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded"
          />
          <label htmlFor="consent" className="text-sm text-foreground">
            <p className="font-medium mb-2">Data Processing Consent</p>
            <p className="text-muted-foreground">
              I confirm that the user has provided consent to process their data
              and biometrics in accordance with applicable laws and secure
              storage guidelines.
            </p>
          </label>
        </div>
      </div>

      {/* === Validity Notice === */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          <strong>KYC Validity:</strong> This verification is valid for 14
          months.
          <br />
          <span className="text-muted-foreground">
            Expiry Date:{" "}
            {new Date(
              Date.now() + 14 * 30 * 24 * 60 * 60 * 1000
            ).toLocaleDateString()}
          </span>
        </p>
      </div>

      {/* === Action Buttons === */}
      <div className="flex justify-between">
        <button onClick={onPrevious} className="btn-secondary">
          ← Previous Step
        </button>
        <button
          onClick={() => (
            onSubmit(), callKycToChain(kycIdName, kycHash, timestamp)
          )}
          disabled={!formData.consent}
          className="btn-primary disabled:opacity-50
          disabled:cursor-not-allowed"
        >
          {" "}
          Submit KYC Application
        </button>
      </div>
    </div>
  );
};

export default KYCConfirmation;
