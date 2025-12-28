"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

interface DonationRoutingFormProps {
  onNext: (data: DonationRoutingFormData) => void;
  onBack: () => void;
  initialData?: DonationRoutingFormData;
}

export interface DonationRoutingFormData {
  dafPartner: string;
  internalTrackingId: string;
}

function DonationRoutingForm({
  onNext,
  onBack,
  initialData,
}: DonationRoutingFormProps) {
  const [formData, setFormData] = useState<DonationRoutingFormData>({
    dafPartner: initialData?.dafPartner || "",
    internalTrackingId: initialData?.internalTrackingId || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    field: keyof DonationRoutingFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user types
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

    if (!formData.dafPartner.trim()) {
      newErrors.dafPartner = "DAF Partner is required";
    }

    if (!formData.internalTrackingId.trim()) {
      newErrors.internalTrackingId = "Internal tracking ID is required";
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
        Donation Routing
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* DAF Partner */}
        <div className="space-y-2">
          <Label htmlFor="dafPartner" className="text-gray-700">
            DAF Partner:
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="dafPartner"
            value={formData.dafPartner}
            onChange={(e) => handleChange("dafPartner", e.target.value)}
            placeholder="Enter your DAF Partner name here..."
            className={`bg-gray-50 border-gray-200 ${errors.dafPartner ? 'border-red-500' : ''}`}
            required
          />
          {errors.dafPartner && (
            <p className="text-red-500 text-sm mt-1">{errors.dafPartner}</p>
          )}
        </div>

        {/* Internal Tracking ID */}
        <div className="space-y-2">
          <Label htmlFor="internalTrackingId" className="text-gray-700">
            Internal tracking ID:
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="internalTrackingId"
            value={formData.internalTrackingId}
            onChange={(e) => handleChange("internalTrackingId", e.target.value)}
            placeholder="Enter your internal tracking ID here..."
            className={`bg-gray-50 border-gray-200 ${errors.internalTrackingId ? 'border-red-500' : ''}`}
            required
          />
          {errors.internalTrackingId && (
            <p className="text-red-500 text-sm mt-1">{errors.internalTrackingId}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-8"
          >
            Publish Campaign
          </Button>
        </div>
      </form>
    </div>
  );
}

export default DonationRoutingForm;