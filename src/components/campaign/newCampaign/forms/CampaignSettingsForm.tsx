"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

interface CampaignSettingsFormProps {
  onNext: (data: CampaignSettingsFormData) => void;
  onBack: () => void;
  initialData?: CampaignSettingsFormData;
}

export interface CampaignSettingsFormData {
  title: string;
  address: string;
  description: string;
  donor_name: string;
  targetAmount: string;
  startDate: string;
  endDate: string;
}

const MAX_CHARACTERS = 80;
const MIN_DESCRIPTION_CHARS = 10;

function CampaignSettingsForm({
  onNext,
  onBack,
  initialData,
}: CampaignSettingsFormProps) {
  const [formData, setFormData] = useState<CampaignSettingsFormData>({
    title: initialData?.title || "",
    address: initialData?.address || "",
    description: initialData?.description || "",
    donor_name: initialData?.donor_name || "",
    targetAmount: initialData?.targetAmount || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    field: keyof CampaignSettingsFormData,
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

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < MIN_DESCRIPTION_CHARS) {
      newErrors.description = `Description must be at least ${MIN_DESCRIPTION_CHARS} characters`;
    }

    // Validate target amount
    if (!formData.targetAmount.trim()) {
      newErrors.targetAmount = "Target amount is required";
    } else {
      const targetAmount = formData.targetAmount.trim();
      // Check if it's a valid number
      if (isNaN(Number(targetAmount))) {
        newErrors.targetAmount = "Target amount must be a valid number";
      }
      // Check if it's a positive number
      else if (Number(targetAmount) <= 0) {
        newErrors.targetAmount = "Target amount must be greater than 0";
      }
    }

    // Validate other required fields
    if (!formData.title.trim()) newErrors.title = "Campaign title is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.donor_name.trim()) newErrors.donor_name = "Donor name is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";

    // Validate date range
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = "End date must be after start date";
      }
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

  const handleTargetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      handleChange("targetAmount", value);
    }
  };

  const descriptionCount = formData.description.length;
  const descriptionError = errors.description;

  return (
    <div className="bg-white border rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Campaign Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campaign Title and Address Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700">
              Campaign Title:
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter your campaign title here..."
              className={`bg-gray-50 border-gray-200 ${errors.title ? 'border-red-500' : ''}`}
              required
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-700">
              Address:
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter your address here..."
              className={`bg-gray-50 border-gray-200 ${errors.address ? 'border-red-500' : ''}`}
              required
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-700">
            Description:
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_CHARACTERS) {
                  handleChange("description", value);
                }
              }}
              placeholder="Type your campaign description here..."
              className={`bg-gray-50 border-gray-200 min-h-[100px] resize-none pr-16 ${descriptionError ? 'border-red-500' : ''}`}
              required
            />
            <div className="flex justify-between mt-1">
              <div className="text-left">
                {descriptionError && (
                  <p className="text-red-500 text-sm">{descriptionError}</p>
                )}
                <p className="text-sm text-gray-500">
                  Minimum {MIN_DESCRIPTION_CHARS} characters required
                </p>
              </div>
              <div
                className={`text-sm ${descriptionCount >= MAX_CHARACTERS
                  ? "text-red-500"
                  : descriptionCount < MIN_DESCRIPTION_CHARS
                    ? "text-amber-500"
                    : "text-gray-400"
                  }`}
              >
                {descriptionCount}/{MAX_CHARACTERS}
              </div>
            </div>
          </div>
        </div>

        {/* Donor Name and Target Amount Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="donor_name" className="text-gray-700">
              Donor Name:
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="donor_name"
              value={formData.donor_name}
              onChange={(e) => handleChange("donor_name", e.target.value)}
              placeholder="Enter donor name here..."
              className={`bg-gray-50 border-gray-200 ${errors.donor_name ? 'border-red-500' : ''}`}
              required
            />
            {errors.donor_name && (
              <p className="text-red-500 text-sm mt-1">{errors.donor_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount" className="text-gray-700">
              Target Amount:
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <Input
                id="targetAmount"
                value={formData.targetAmount}
                onChange={handleTargetAmountChange}
                placeholder="0.00"
                className={`bg-gray-50 border-gray-200 pl-8 ${errors.targetAmount ? 'border-red-500' : ''}`}
                required
                inputMode="decimal"
              />
            </div>
            {errors.targetAmount && (
              <p className="text-red-500 text-sm mt-1">{errors.targetAmount}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Enter numbers only (e.g., 1000 or 1500.50)
            </p>
          </div>
        </div>

        {/* Start Date and End Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-gray-700">
              Start Date:
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              placeholder="dd/mm/yyyy"
              className={`bg-gray-50 border-gray-200 ${errors.startDate ? 'border-red-500' : ''}`}
              required
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-gray-700">
              End Date:
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              placeholder="dd/mm/yyyy"
              className={`bg-gray-50 border-gray-200 ${errors.endDate ? 'border-red-500' : ''}`}
              required
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
            )}
          </div>
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-8"
          // disabled={isLoading}
          >
            {"Save & Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CampaignSettingsForm;