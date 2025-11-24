"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface OrganizationInformationFormProps {
  onNext: (data: OrganizationFormData) => void;
  initialData?: OrganizationFormData;
}

export interface OrganizationFormData {
  organizationName: string;
  organizationType: string;
  taxId: string;
  website: string;
  address: string;
}

function OrganizationInformationForm({
  onNext,
  initialData,
}: OrganizationInformationFormProps) {
  const [formData, setFormData] = useState<OrganizationFormData>({
    organizationName: initialData?.organizationName || "",
    organizationType: initialData?.organizationType || "",
    taxId: initialData?.taxId || "",
    website: initialData?.website || "",
    address: initialData?.address || "",
  });

  const handleChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Organization Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Name and Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-gray-700">
              Organization Name:
            </Label>
            <Input
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) => handleChange("organizationName", e.target.value)}
              placeholder="Enter your organization name here..."
              className="bg-gray-50 border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organizationType" className="text-gray-700">
              Organization Type:
            </Label>
            <Input
              id="organizationType"
              value={formData.organizationType}
              onChange={(e) => handleChange("organizationType", e.target.value)}
              placeholder="Enter your organization type here..."
              className="bg-gray-50 border-gray-200"
              required
            />
          </div>
        </div>

        {/* Tax ID / EIN */}
        <div className="space-y-2">
          <Label htmlFor="taxId" className="text-gray-700">
            Tax ID / EIN:
          </Label>
          <Input
            id="taxId"
            value={formData.taxId}
            onChange={(e) => handleChange("taxId", e.target.value)}
            placeholder="Enter your tax ID / EIN here..."
            className="bg-gray-50 border-gray-200"
            required
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website" className="text-gray-700">
            Add Website:
          </Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="Paste website URL here..."
            className="bg-gray-50 border-gray-200"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address" className="text-gray-700">
            Address:
          </Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Enter your address here..."
            className="bg-gray-50 border-gray-200 min-h-[100px]"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          >
            Save & Continue
          </Button>
        </div>
      </form>
    </div>
  );
}

export default OrganizationInformationForm;
