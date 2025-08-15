import express from "express";
import twilioRoutes from "./twilio.js";
import multer from "multer";
import KYC, { VerificationMetadata } from "./models.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(twilioRoutes);


// Save user details (initial KYC entry creation)
router.post("/kyc/details", async (req, res) => {
  const {
    fullName, dob, gender, address,
    email, state, phone, altPhone,
    aadhaarNumber
  } = req.body;

  const kycId = "KYC" + Date.now();

  try {
    const currentSubmissionTime = new Date();

    const newKycEntry = new KYC({
      fullName,
      dob,
      gender,
      address,
      email,
      state,
      phone,
      altPhone,
      aadhaarNumber,
      kycId,
      consentGiven: false,
      submittedAt: currentSubmissionTime
    });

    const kycExpiryDate = new Date(currentSubmissionTime);
    kycExpiryDate.setFullYear(kycExpiryDate.getFullYear() + 5);
    newKycEntry.kycExpiryDate = kycExpiryDate;

    await newKycEntry.save();

    res.status(201).json({
      kycId: newKycEntry.kycId,
      submittedAt: newKycEntry.submittedAt,
      kycExpiryDate: newKycEntry.kycExpiryDate,
      message: "User details saved successfully and KYC entry created"
    });
  } catch (error) {
    console.error("Failed to save user details:", error.message, error.stack);
    res.status(500).json({ error: error.message });


  }
});

// Document upload
router.post("/kyc/:kycId/documents", upload.array("docs"), async (req, res) => {
  const { kycId } = req.params;
  let parsedDocMeta = [];
  const files = req.files;

  if (!files || files.length === 0)
    return res.status(400).json({ error: "No documents provided for upload." });

  // Parse docMeta (stringified JSON)
  try {
    if (req.body.docMeta) {
      if (Array.isArray(req.body.docMeta)) {
        parsedDocMeta = req.body.docMeta.map(metaStr => JSON.parse(metaStr));
      } else {
        parsedDocMeta = JSON.parse(req.body.docMeta);
        if (!Array.isArray(parsedDocMeta)) parsedDocMeta = [parsedDocMeta];
      }
    }
  } catch (err) {
    return res.status(400).json({ error: "Invalid document metadata in upload." });
  }

  if (parsedDocMeta.length !== files.length)
    return res.status(400).json({ error: "Metadata count does not match file count." });

  try {
    const kyc = await KYC.findOne({ kycId });
    if (!kyc)
      return res.status(404).json({ error: "KYC ID not found" });
    const uploadedDocs = files.map((file, index) => {
      const metadata = parsedDocMeta[index] || {};
      return {
        type: metadata.type || "Unknown",
        file: file.buffer,
        contentType: file.mimetype,
        ...(metadata.documentNumber && { documentNumber: metadata.documentNumber })
      };
    });
    kyc.documents.push(...uploadedDocs);
    await kyc.save();
    res.json({ message: "Documents processed successfully" });
  } catch (error) {
    console.error("Error processing documents:", error);
    res.status(500).json({ error: "Failed to process documents" });
  }
});

// Upload selfie from webcam
router.post("/kyc/:kycId/selfie", upload.single("selfie"), async (req, res) => {
  const { kycId } = req.params;

  try {
    const kyc = await KYC.findOne({ kycId });
    if (!kyc) return res.status(404).json({ error: "KYC ID not found" });

    if (!req.file) {
      return res.status(400).json({ error: "No selfie file provided." });
    }

    kyc.selfie = {
      file: req.file.buffer,
      contentType: req.file.mimetype
    };

    await kyc.save();
    res.json({ message: "Selfie uploaded successfully" });
  } catch (error) {
    console.error("Error uploading selfie:", error);
    res.status(500).json({ error: "Failed to upload selfie" });
  }
});

// Consent & finalize KYC
router.post("/kyc/:kycId/consent", async (req, res) => {
  const { kycId } = req.params;
  const { consentGiven } = req.body;
  try {
    const kyc = await KYC.findOne({ kycId });
    if (!kyc)
      return res.status(404).json({ error: "KYC ID not found" });
    kyc.consentGiven = consentGiven;
    await kyc.save();
    res.json({ message: "Consent recorded successfully and KYC finalized" });
  } catch (error) {
    console.error("Error recording consent:", error);
    res.status(500).json({ error: "Failed to record consent" });
  }
});



// QR code scan & verification metadata logging
router.post("/kyc/:kycId/verify", async (req, res) => {
  const { kycId } = req.params;
  try {
    const kyc = await KYC.findOne({ kycId });
    if (!kyc)
      return res.status(404).json({ error: "KYC ID not found" });
    const now = new Date();
    await VerificationMetadata.create({
      kycId: kyc.kycId,
      userName: kyc.fullName,
      state: kyc.state,
      expiryDate: kyc.kycExpiryDate,
      scannedAt: now
    });
    res.json({
      kyc_data: {
        state: kyc.state,
        kyc_id: kyc.kycId,
        expiry_date: kyc.kycExpiryDate,
        name: kyc.fullName
      }
    });
  } catch (error) {
    console.error("Error verifying KYC:", error);
    res.status(500).json({ error: "Failed to verify KYC" });
  }
});

export default router;