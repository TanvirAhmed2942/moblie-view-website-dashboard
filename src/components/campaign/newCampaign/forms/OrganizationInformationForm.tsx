"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

interface OrganizationInformationFormProps {
  onNext: (data: OrganizationFormData) => void;
  initialData?: OrganizationFormData;
}

export interface OrganizationFormData {
  organization_name: string;
  organization_type: string;
  organization_website: string;
  organization_address: string;
}

function OrganizationInformationForm({
  onNext,
  initialData,
}: OrganizationInformationFormProps) {
  const [formData, setFormData] = useState<OrganizationFormData>({
    organization_name: initialData?.organization_name || "",
    organization_type: initialData?.organization_type || "",
    organization_website: initialData?.organization_website || "",
    organization_address: initialData?.organization_address || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.organization_name.trim()) {
      newErrors.organization_name = "Organization name is required";
    }



    if (!formData.organization_type.trim()) {
      newErrors.organization_type = "Organization type is required";
    }


    if (!formData.organization_address.trim()) {
      newErrors.organization_address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Organization Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Organization Name and Network Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="organization_name" className="text-gray-700">
              Organization Name:
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="organization_name"
              value={formData.organization_name}
              onChange={(e) => handleChange("organization_name", e.target.value)}
              placeholder="Enter your organization name here..."
              className={`bg-gray-50 border-gray-200 ${errors.organization_name ? 'border-red-500' : ''}`}
              required
            />
            {errors.organization_name && (
              <p className="text-red-500 text-sm mt-1">{errors.organization_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization_type" className="text-gray-700">
              Organization Type:
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="organization_type"
              value={formData.organization_type}
              onChange={(e) => handleChange("organization_type", e.target.value)}
              placeholder="Enter your organization type here..."
              className={`bg-gray-50 border-gray-200 ${errors.organization_type ? 'border-red-500' : ''}`}
              required
            />
            {errors.organization_type && (
              <p className="text-red-500 text-sm mt-1">{errors.organization_type}</p>
            )}
          </div>


        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="organization_website" className="text-gray-700">
            Add Website:
          </Label>
          <Input
            id="organization_website"
            type="url"
            value={formData.organization_website}
            onChange={(e) => handleChange("organization_website", e.target.value)}
            placeholder="Paste website URL here..."
            className="bg-gray-50 border-gray-200"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="organization_address" className="text-gray-700">
            Address:
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Textarea
            id="organization_address"
            value={formData.organization_address}
            onChange={(e) => handleChange("organization_address", e.target.value)}
            placeholder="Enter your address here..."
            className={`bg-gray-50 border-gray-200 min-h-[100px] ${errors.organization_address ? 'border-red-500' : ''}`}
            required
          />
          {errors.organization_address && (
            <p className="text-red-500 text-sm mt-1">{errors.organization_address}</p>
          )}
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