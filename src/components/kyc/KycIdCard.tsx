import React, { useRef, useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "../ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeSVG } from "qrcode.react";
import QrScanner from "react-qr-scanner";

export interface KycIdCardProps {
  userName: string;
  dateOfBirth: string;
  gender: string;
  kycId: string;
  state: string;
  phoneNumber: string;
  isVerified: boolean;
  submissionDate: string;
  validUntil: string;
  reviewerId?: string;
  photoUrl?: string;
  selfieImage?: File | null;
  onDownload?: () => void;
}

const KycIdCard: React.FC<KycIdCardProps> = ({
  userName,
  dateOfBirth,
  gender,
  kycId,
  state,
  phoneNumber,
  isVerified,
  submissionDate,
  validUntil,
  reviewerId,
  photoUrl,
  selfieImage,
  onDownload,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [scanModal, setScanModal] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [selfiePreviewURL, setSelfiePreviewURL] = useState<string | null>(null);

  useEffect(() => {
    if (selfieImage && selfieImage instanceof File) {
      const url = URL.createObjectURL(selfieImage);
      setSelfiePreviewURL(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    setSelfiePreviewURL(null);
  }, [selfieImage]);

  const isExpired = new Date(validUntil) < new Date();
  const statusMessage = isExpired
    ? "KYC is expired"
    : isVerified
    ? "KYC is verified"
    : "KYC not verified";

  const qrValue = JSON.stringify({
    kyc_id: kycId,
    name: userName,
    state,
    expiry_date: validUntil,
  });

  const handleDownload = async () => {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: [500, 320],
    });
    pdf.addImage(imgData, "PNG", 10, 10, 480, 300);
    pdf.save(`${kycId}_VaultKYC_Card.pdf`);
    if (onDownload) onDownload();
  };

  const handleScan = (data: string | null) => {
    if (!data) return;
    try {
      setScanResult(JSON.parse(data));
    } catch {
      setScanResult({ raw: data });
    }
  };

  const handleError = (err: any) => {
    setScanResult({ error: "Error reading QR: " + String(err) });
  };

  const openScanModal = () => {
    setScanModal(true);
    setScanResult(null);
  };

  const safe = (val?: string) => (val && val.trim() ? val : "Not Provided");
  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleDateString() : "—";

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Card UI */}
      <div
        ref={cardRef}
        className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200 dark:border-blue-700 shadow-2xl p-6 h-80"
      >
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="text-7xl font-bold text-blue-600 select-none">
            VaultKYC
          </div>
        </div>
        {/* Header */}
        <div className="relative z-10 mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100">
              VaultKYC
            </h3>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Identity Verification Card
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-lg text-xs font-bold
            ${
              isExpired
                ? "bg-red-100 text-red-700 border border-red-200"
                : isVerified
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-yellow-100 text-yellow-700 border border-yellow-200"
            }`}
          >
            {statusMessage}
          </div>
        </div>
        {/* Body */}
        <div className="relative z-10 flex space-x-6 h-40">
          {/* Photo */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-20 h-20 rounded-full bg-blue-200 dark:bg-blue-700 border-2 border-blue-300 dark:border-blue-600 overflow-hidden flex items-center justify-center">
              {selfiePreviewURL ? (
                <img
                  src={selfiePreviewURL}
                  alt={`${userName} selfie`}
                  className="w-full h-full object-cover"
                />
              ) : photoUrl ? (
                <img
                  src={photoUrl}
                  alt={`${userName} photo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-blue-600 dark:text-blue-300 text-xl font-bold">
                  {userName?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center">Photo</p>
          </div>
          {/* Details */}
          <div className="flex-1 space-y-1 text-sm mt-2">
            <p className="text-gray-700 dark:text-gray-100 font-semibold">
              Name: <span className="font-normal">{safe(userName)}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-100 font-semibold">
              Date of Birth:{" "}
              <span className="font-normal">{safe(dateOfBirth)}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-100 font-semibold">
              Gender: <span className="font-normal">{safe(gender)}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-100 font-semibold">
              Phone: <span className="font-normal">{safe(phoneNumber)}</span>
            </p>
            <p className="text-gray-700 dark:text-gray-100 font-semibold">
              KYC Hash:
              <br />
              <span className="font-mono text-xs">{kycId}</span>
            </p>
          </div>
          {/* QR & Scan Button */}
          <div className="flex flex-col items-center space-y-2">
            <div className="w-24 h-24 bg-white rounded-lg p-1 shadow-sm flex items-center justify-center">
              <QRCodeSVG
                value={qrValue}
                size={120}
                fgColor="#1e3a8a"
                bgColor="#fff"
                level="Q"
                includeMargin={false}
                aria-label="VaultKYC QR"
              />
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Scan for Verification
            </p>
            <Button
              onClick={openScanModal}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Scan a KYC QR
            </Button>
          </div>
        </div>
        {/* Footer Info */}
        <div className="relative z-10 mt-4 pt-3 border-t border-blue-200 dark:border-blue-700">
          <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
            <p>Issue Date: {formatDate(submissionDate)}</p>
            <p>Expiry Date: {formatDate(validUntil)}</p>
            {reviewerId && (
              <p>
                Reviewed by: <span className="font-mono">{reviewerId}</span>
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Download Button */}
      <div className="mt-4 text-center flex gap-2">
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" aria-hidden="true" />
          Download KYC ID Card (PDF)
        </Button>
      </div>
      {/* QR Scan Modal */}
      {scanModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <div className="bg-white rounded-xl p-4 w-full max-w-sm shadow-2xl flex flex-col items-center relative">
            <h2 className="text-lg font-bold mb-2">Scan a VaultKYC QR</h2>
            <button
              type="button"
              onClick={() => {
                setScanModal(false);
                setScanResult(null);
              }}
              className="absolute top-2 right-4 px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs"
              aria-label="Close scanner"
            >
              Close
            </button>
            <QrScanner
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
            <div className="mt-4 w-full">
              {scanResult && (
                <div className="rounded bg-blue-50 p-3 border">
                  {"error" in scanResult && (
                    <div className="text-red-700">{scanResult.error}</div>
                  )}
                  {"raw" in scanResult && (
                    <div>Raw Scanned Content: {scanResult.raw}</div>
                  )}
                  {!("error" in scanResult) && !("raw" in scanResult) && (
                    <div>
                      <div>
                        <b>State:</b> {scanResult.state || "-"}
                      </div>
                      <div>
                        <b>KYC hash:</b> {scanResult.kyc_id || "-"}
                      </div>
                      <div>
                        <b>Expiry date:</b>{" "}
                        {scanResult.expiry_date
                          ? formatDate(scanResult.expiry_date)
                          : "-"}
                      </div>
                      <div>
                        <b>Name:</b> {scanResult.name || "-"}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {!scanResult && (
                <div className="mt-4 text-xs text-gray-600">
                  Point your camera at a VaultKYC QR code.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KycIdCard;
