import React, { useState } from "react";
import { Upload, Camera, FileText, CheckCircle } from "lucide-react";
import { DocumentData } from "../../pages/staff/NewKYC";

interface DocumentUploadPanelProps {
  data: DocumentData;
  onUpdate: (data: DocumentData) => void;
  onFirstFrontImage: (image: File) => void; // NEW PROP
  onNext: () => void;
  onPrevious: () => void;
}

const DocumentUploadPanel: React.FC<DocumentUploadPanelProps> = ({
  data,
  onUpdate,
  onFirstFrontImage,
  onNext,
  onPrevious,
}) => {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [multiDocData, setMultiDocData] = useState<
    Record<string, { frontImage: File | null; backImage: File | null }>
  >({});
  const [firstFrontCaptured, setFirstFrontCaptured] = useState<boolean>(false);

  const documentTypes = [
    { value: "aadhaar", label: "Aadhaar Card", requiresBack: true },
    { value: "pan", label: "PAN Card", requiresBack: false },
    { value: "passport", label: "Passport", requiresBack: false },
    { value: "driving_license", label: "Driving License", requiresBack: true },
    { value: "voter_id", label: "Voter ID", requiresBack: true },
  ];

  const toggleDocumentType = (type: string) => {
    const newSelection = selectedDocs.includes(type)
      ? selectedDocs.filter((t) => t !== type)
      : [...selectedDocs, type];
    setSelectedDocs(newSelection);
  };

  const handleMultiUpload = (
    type: string,
    side: "front" | "back",
    file: File
  ) => {
    const updated = {
      ...multiDocData,
      [type]: {
        ...(multiDocData[type] || { frontImage: null, backImage: null }),
        [side + "Image"]: file,
      },
    };

    setMultiDocData(updated);

    // Store the first front image only
    if (!firstFrontCaptured && side === "front") {
      onFirstFrontImage(file);
      setFirstFrontCaptured(true);
    }

    // Update main KYC form state with the most recent document (optional)
    if (side === "front") {
      onUpdate({
        ...data,
        frontImage: file,
        type,
        documentNumber: "",
        issuer: "",
      });
    }
  };

  const FileUploadArea: React.FC<{
    title: string;
    file: File | null;
    onUpload: (file: File) => void;
    required?: boolean;
  }> = ({ title, file, onUpload, required = false }) => (
    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
      {file ? (
        <div className="space-y-4">
          <CheckCircle className="h-12 w-12 text-success mx-auto" />
          <div>
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*,.pdf";
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                const fileList = target.files;
                if (fileList && fileList.length > 0) {
                  onUpload(fileList[0]); // Correct: pass the first File, not FileList
                }
              };
              input.click();
            }}
            className="text-primary hover:underline text-sm"
          >
            Change File
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <p className="font-medium text-foreground">
              {title} {required && "*"}
            </p>
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
          </div>
          <button
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*,.pdf";
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                const fileList = target.files;
                if (fileList && fileList.length > 0) {
                  onUpload(fileList[0]); // Correct: pass the first File, not FileList
                }
              };
              input.click();
            }}
            className="btn-secondary"
          >
            <Camera className="h-4 w-4 mr-2" />
            Upload File
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Document Upload
        </h2>
        <p className="text-muted-foreground">
          Select document types and upload clear images or PDFs.
        </p>
      </div>

      {/* Document Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">
          Select Proofs (Multiple Allowed) *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documentTypes.map((docType) => (
            <button
              key={docType.value}
              onClick={() => toggleDocumentType(docType.value)}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedDocs.includes(docType.value)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <FileText className="h-5 w-5 mb-2 text-primary" />
              <p className="font-medium text-foreground">{docType.label}</p>
              <p className="text-xs text-muted-foreground">
                {docType.requiresBack ? "Front & Back required" : "Front only"}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Area Per Document */}
      {selectedDocs.length > 0 && (
        <div className="space-y-10">
          {selectedDocs.map((type) => {
            const docMeta = documentTypes.find((d) => d.value === type);
            const docFiles = multiDocData[type] || {
              frontImage: null,
              backImage: null,
            };
            return (
              <div key={type} className="border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {docMeta?.label}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUploadArea
                    title="Upload Front Side"
                    file={docFiles.frontImage}
                    onUpload={(file) => handleMultiUpload(type, "front", file)}
                    required
                  />
                  {docMeta?.requiresBack && (
                    <FileUploadArea
                      title="Upload Back Side"
                      file={docFiles.backImage}
                      onUpload={(file) => handleMultiUpload(type, "back", file)}
                      required
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button onClick={onPrevious} className="btn-secondary">
          Previous: User Details
        </button>

        <button
          onClick={onNext}
          disabled={selectedDocs.length === 0}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DocumentUploadPanel;
