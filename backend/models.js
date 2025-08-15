// models.js

import mongoose from "mongoose";

// Document schema (Aadhaar, PAN, etc.)
const documentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Aadhaar", "PAN", "Passport", "Driving License", "Voter ID"],
    required: true
  },
  file: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  documentNumber: {
    type: String,
    required: false
  }
}, { _id: false });

// Main KYC schema
const kycSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dob: { type: String, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true },
  altPhone: { type: String },
  kycId: { type: String, unique: true, required: true },
  documents: { type: [documentSchema], default: [] },
   aadhaarNumber: {
    type: String,
    validate: {
      validator: v => /^\d{12}$/.test(v),
      message: props => `${props.value} is not a valid Aadhaar number!`
    },
    required: false
  },
  selfie: {
    file: { type: Buffer },
    contentType: { type: String }
  },
  verified: {
    otpVerified: { type: Boolean, default: false },
    faceMatched: { type: Boolean, default: false }
  },
  consentGiven: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  kycExpiryDate: { type: Date }
}, { timestamps: true });

// Verification scan metadata schema (for logging QR scans)
const verificationMetadataSchema = new mongoose.Schema({
  kycId: { type: String },
  userName: { type: String },
  state: { type: String },
  expiryDate: { type: Date },
  scannedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const KYC = mongoose.model("KYC", kycSchema);
export const VerificationMetadata = mongoose.model("VerificationMetadata", verificationMetadataSchema);

export default KYC;
