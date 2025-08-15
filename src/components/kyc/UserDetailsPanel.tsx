import React from "react";

// Import the UserDetails type from expected path
import { UserDetails } from "../../pages/staff/NewKYC";

interface UserDetailsPanelProps {
  data: UserDetails; // Consider renaming to userDetails for clarity
  kycId: string;
  onUpdate: (data: UserDetails) => void;
  onNext: () => void;
}

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// This component acts as a controlled form for user details entry.
// State management is delegated to the parent via props.
const UserDetailsPanel: React.FC<UserDetailsPanelProps> = ({
  data,
  kycId,
  onUpdate,
  onNext,
}) => {
  // When the user changes a value, notify parent to update state
  const handleInputChange = (field: keyof UserDetails, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  // Make sure all required fields are filled before moving next
  const isFormValid = () => {
    return (
      data.name.trim() &&
      data.dateOfBirth &&
      data.gender &&
      data.address.trim() &&
      data.email.trim() &&
      data.phone.trim() && // Main phone should be required
      data.state
    );
    // Don't require altPhone (optional)
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          User Details
        </h2>
        <p className="text-muted-foreground">
          Enter the user's basic information and contact details.
        </p>
      </div>

      {/* KYC ID Display */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
        <p className="text-sm font-medium text-foreground">KYC ID</p>
        <p className="text-lg font-mono text-primary">{kycId}</p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="md:col-span-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            value={data.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="Enter full name as per ID document"
            required
            autoComplete="name"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label
            htmlFor="dob"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Date of Birth *
          </label>
          <input
            id="dob"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            required
            autoComplete="bday"
          />
        </div>

        {/* Gender */}
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Gender *
          </label>
          <select
            id="gender"
            value={data.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Address *
          </label>
          <textarea
            id="address"
            value={data.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="Enter complete address"
            rows={3}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="user@example.com"
            required
            autoComplete="email"
          />
        </div>

        {/* State Dropdown */}
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-foreground mb-2"
          >
            State *
          </label>
          <div className="relative z-10">
            <select
              id="state"
              value={data.state || ""}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            >
              <option value="">Select State</option>
              {indianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Phone Number (Main, required) */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="+91-XXXXXXXXXX"
            required
            autoComplete="tel"
          />
        </div>

        {/* Alternative Phone Number (optional) */}
        <div>
          <label
            htmlFor="altPhone"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Alternative Phone Number
          </label>
          <input
            id="altPhone"
            type="tel"
            value={data.altPhone}
            onChange={(e) => handleInputChange("altPhone", e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
            placeholder="+91-XXXXXXXXXX (optional)"
            autoComplete="tel"
          />
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={onNext}
          disabled={!isFormValid()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Document Upload
        </button>
      </div>
    </div>
  );
};

export default UserDetailsPanel;
