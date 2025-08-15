import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import {
  Camera,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Eye,
  Fingerprint,
} from "lucide-react";
import { FaceVerificationData } from "../../pages/staff/NewKYC";

interface FaceVerificationPanelProps {
  data: FaceVerificationData;
  documentImage: File | null;
  onUpdate: (data: FaceVerificationData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const FaceVerificationPanel: React.FC<FaceVerificationPanelProps> = ({
  data,
  documentImage,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const [showWebcam, setShowWebcam] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [docPreviewURL, setDocPreviewURL] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  // Show document preview from uploaded file
  useEffect(() => {
    if (documentImage) {
      const objectUrl = URL.createObjectURL(documentImage);
      setDocPreviewURL(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setDocPreviewURL(null);
    }
  }, [documentImage]);

  const capturePhoto = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc && documentImage) {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        const selfieFile = new File([blob], "selfie.jpg", {
          type: "image/jpeg",
        });

        setProcessing(true);

        const formData = new FormData();
        formData.append("document", documentImage); // file from props
        formData.append("selfie", selfieFile);

        try {
          const res = await fetch("http://localhost:5000/verify-face/", {
            method: "POST",
            body: formData,
            credentials: "include",
          });

          const result = await res.json();

          if (!result.success) {
            alert(result.message || "Face verification failed");
            setProcessing(false);
            return;
          }

          const verificationData: FaceVerificationData = {
            selfieImage: selfieFile,
            timestamp: new Date().toISOString(),
            matchScore: result.matchScore,
            riskScore: result.riskScore,
            passed: result.passed,
          };

          onUpdate(verificationData);
        } catch (error) {
          alert("Error connecting to face verification server.");
          console.error(error);
        }

        setProcessing(false);
        setShowWebcam(false);
      }
    }
  }, [onUpdate, documentImage]);

  const retakePhoto = () => {
    onUpdate({
      selfieImage: null,
      timestamp: "",
      matchScore: 0,
      riskScore: 0,
      passed: false,
    });
    setShowWebcam(true);
  };

  // ✅ Always allow moving forward (face verification optional)
  const isFormValid = () => {
    return true;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Live Face Verification
        </h2>
        <p className="text-muted-foreground">
          Capture a live selfie to verify your identity against the uploaded
          document.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Document Reference */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            Document Photo
          </h3>
          <div className="border border-border rounded-lg p-4 bg-muted/20">
            {docPreviewURL ? (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <img
                  src={docPreviewURL}
                  alt="Document"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No document image</p>
              </div>
            )}
          </div>
        </div>

        {/* Selfie Capture Section */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            Live Selfie
          </h3>

          {!showWebcam && !data.selfieImage && (
            <div className="border border-border rounded-lg p-8 text-center">
              <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-foreground font-medium mb-2">
                Ready to capture selfie?
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Make sure you're in good lighting and looking directly at the
                camera.
              </p>
              <button
                onClick={() => setShowWebcam(true)}
                className="btn-primary"
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </button>
            </div>
          )}

          {showWebcam && (
            <div className="space-y-4">
              <div className="border border-border rounded-lg overflow-hidden">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 400,
                    height: 400,
                    facingMode: "user",
                  }}
                  className="w-full"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={capturePhoto}
                  disabled={processing}
                  className="btn-primary flex-1"
                >
                  {processing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Capture Photo
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowWebcam(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {data.selfieImage && (
            <div className="space-y-4">
              <div className="border border-border rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(data.selfieImage)}
                  alt="Captured selfie"
                  className="w-full object-cover"
                />
              </div>
              <button onClick={retakePhoto} className="btn-secondary w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retake Photo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* IRIS & Fingerprint UI Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="border border-border rounded-lg p-4 flex items-center space-x-4 bg-muted/10">
          <Eye className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">IRIS Scanner</p>
            <p className="text-sm text-muted-foreground">
              Device not connected
            </p>
          </div>
        </div>
        <div className="border border-border rounded-lg p-4 flex items-center space-x-4 bg-muted/10">
          <Fingerprint className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground">Fingerprint Scanner</p>
            <p className="text-sm text-muted-foreground">
              Device not connected
            </p>
          </div>
        </div>
      </div>

      {/* Verification Results */}
      {data.selfieImage && data.timestamp && (
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">
            Verification Results
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  data.passed
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {data.passed ? (
                  <CheckCircle className="h-8 w-8" />
                ) : (
                  <AlertTriangle className="h-8 w-8" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">Face Match</p>
              <p className="text-2xl font-bold text-foreground">
                {data.matchScore}%
              </p>
            </div>

            <div className="text-center">
              <div
                className={`text-2xl font-bold mb-2 ${
                  data.riskScore < 30
                    ? "text-success"
                    : data.riskScore < 60
                    ? "text-warning"
                    : "text-destructive"
                }`}
              >
                {data.riskScore}
              </div>
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <p
                className={`text-sm font-medium ${
                  data.riskScore < 30
                    ? "text-success"
                    : data.riskScore < 60
                    ? "text-warning"
                    : "text-destructive"
                }`}
              >
                {data.riskScore < 30
                  ? "Low Risk"
                  : data.riskScore < 60
                  ? "Medium Risk"
                  : "High Risk"}
              </p>
            </div>

            <div className="text-center">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  data.passed
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {data.passed ? "PASSED" : "FAILED"}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Captured: {new Date(data.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {!data.passed && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                ⚠️ Face verification failed. Please ensure good lighting and try
                again.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button onClick={onPrevious} className="btn-secondary">
          Previous: Document Upload
        </button>
        <button
          onClick={onNext}
          disabled={!isFormValid()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Review & Submit
        </button>
      </div>
    </div>
  );
};

export default FaceVerificationPanel;
