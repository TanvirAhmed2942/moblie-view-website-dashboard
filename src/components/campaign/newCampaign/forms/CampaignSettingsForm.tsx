"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CampaignSettingsFormProps {
  onNext: (data: CampaignSettingsFormData) => void;
  onBack: () => void;
  initialData?: CampaignSettingsFormData;
}

export interface CampaignSettingsFormData {
  campaignName: string;
  address: string;
  shortDescription: string;
  seedDonorName: string;
  seedDonationAmount: string;
  startDate: string;
  endDate: string;
}

const MAX_CHARACTERS = 80;

function CampaignSettingsForm({
  onNext,
  onBack,
  initialData,
}: CampaignSettingsFormProps) {
  const [formData, setFormData] = useState<CampaignSettingsFormData>({
    campaignName: initialData?.campaignName || "",
    address: initialData?.address || "",
    shortDescription: initialData?.shortDescription || "",
    seedDonorName: initialData?.seedDonorName || "",
    seedDonationAmount: initialData?.seedDonationAmount || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
  });

  const handleChange = (
    field: keyof CampaignSettingsFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const shortDescriptionCount = formData.shortDescription.length;

  return (
    <div className="bg-white border rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Campaign Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campaign Name and Address Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="campaignName" className="text-gray-700">
              Campaign Name:
            </Label>
            <Input
              id="campaignName"
              value={formData.campaignName}
              onChange={(e) => handleChange("campaignName", e.target.value)}
              placeholder="Enter your campaign name here..."
              className="bg-gray-50 border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-gray-700">
              Address:
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter your address here..."
              className="bg-gray-50 border-gray-200"
              required
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <Label htmlFor="shortDescription" className="text-gray-700">
            Short Description:
          </Label>
          <div className="relative">
            <Textarea
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_CHARACTERS) {
                  handleChange("shortDescription", value);
                }
              }}
              placeholder="Type your campaign short description here...."
              className="bg-gray-50 border-gray-200 min-h-[100px] resize-none pr-16"
              required
            />
            <div
              className={`absolute bottom-3 right-3 text-sm ${
                shortDescriptionCount >= MAX_CHARACTERS
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {shortDescriptionCount}/{MAX_CHARACTERS}
            </div>
          </div>
        </div>

        {/* Seed Donor Name and Seed Donation Amount Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="seedDonorName" className="text-gray-700">
              Seed Donor Name:
            </Label>
            <Input
              id="seedDonorName"
              value={formData.seedDonorName}
              onChange={(e) => handleChange("seedDonorName", e.target.value)}
              placeholder="Enter your seed donor name here..."
              className="bg-gray-50 border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seedDonationAmount" className="text-gray-700">
              Seed Donation Amount:
            </Label>
            <Input
              id="seedDonationAmount"
              type="number"
              value={formData.seedDonationAmount}
              onChange={(e) =>
                handleChange("seedDonationAmount", e.target.value)
              }
              placeholder="Enter seed donation amount here..."
              className="bg-gray-50 border-gray-200"
              required
            />
          </div>
        </div>

        {/* Start Date and End Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-gray-700">
              Start Date:
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              placeholder="dd/mm/yyyy"
              className="bg-gray-50 border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-gray-700">
              End Date:
            </Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              placeholder="dd/mm/yyyy"
              className="bg-gray-50 border-gray-200"
              required
            />
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
          >
            Save & Continue
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CampaignSettingsForm;
