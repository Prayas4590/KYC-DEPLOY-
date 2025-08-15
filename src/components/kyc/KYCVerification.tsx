import React, { useState, useEffect } from "react";

interface Props {
  onNext: () => void;
  onPrevious: () => void;
}

const KYCVerificationPanel: React.FC<Props> = ({ onNext, onPrevious }) => {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const demoOTP = "616773"; // Hardcoded OTP for demo

  // Function to generate random 5-character alphanumeric CAPTCHA
  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setGeneratedCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha(); // generate on first load
  }, []);

  const handleGenerateOTP = () => {
    if (captchaInput.trim().toUpperCase() === generatedCaptcha) {
      setOtpSent(true);
      setOtpVerified(false);
      alert(`OTP sent: ${demoOTP}`); // Show hardcoded OTP in alert instead of sending
    } else {
      alert("❌ Invalid CAPTCHA. Please try again.");
    }
  };

  const handleVerifyOTP = () => {
    if (otp === demoOTP) {
      setOtpVerified(true);
      alert("✅ OTP verification successful.");
    } else {
      alert("❌ Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        KYC Aadhaar Verification
      </h2>
      <p className="text-muted-foreground">
        Enter Aadhaar number and verify with OTP (demo version)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Aadhaar Number */}
        <div>
          <label className="block text-sm font-medium mb-2">Aadhaar Number</label>
          <input
            type="text"
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
            placeholder="Enter 12-digit Aadhaar"
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
          />
        </div>

        {/* CAPTCHA */}
        <div>
          <label className="block text-sm font-medium mb-2">Enter CAPTCHA</label>
          <div className="flex items-center space-x-4">
            <div className="bg-muted text-foreground font-mono px-4 py-2 rounded-lg text-lg tracking-widest select-none">
              {generatedCaptcha}
            </div>
            <button
              type="button"
              onClick={generateCaptcha}
              className="text-sm text-blue-600 underline"
            >
              Refresh
            </button>
          </div>
          <input
            type="text"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            placeholder="Enter above CAPTCHA"
            className="mt-2 w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
          />
        </div>
      </div>

      {/* Generate OTP Button */}
      <div className="flex items-center justify-start mt-4">
        <button onClick={handleGenerateOTP} className="btn-primary">
          Generate OTP
        </button>
      </div>

      {/* OTP Input and Verify Button */}
      {otpSent && !otpVerified && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP sent to mobile"
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>
          <div className="flex items-end">
            <button onClick={handleVerifyOTP} className="btn-secondary">
              Verify OTP
            </button>
          </div>
        </div>
      )}

      {/* OTP Verified Message */}
      {otpVerified && (
        <div className="p-4 bg-green-100 border border-green-300 rounded-lg mt-4">
          <p className="text-green-700 text-sm">
            ✅ OTP verification successful.
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button onClick={onPrevious} className="btn-secondary">
          Back
        </button>
        <button
          onClick={onNext}
          className="btn-primary"
          disabled={!otpVerified}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default KYCVerificationPanel;
