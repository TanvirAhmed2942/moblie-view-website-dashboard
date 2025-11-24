"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const handleChange = (
    field: keyof DonationRoutingFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
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
          </Label>
          <Input
            id="dafPartner"
            value={formData.dafPartner}
            onChange={(e) => handleChange("dafPartner", e.target.value)}
            placeholder="Enter your DAF Partner name here..."
            className="bg-gray-50 border-gray-200"
            required
          />
        </div>

        {/* Internal Tracking ID */}
        <div className="space-y-2">
          <Label htmlFor="internalTrackingId" className="text-gray-700">
            Internal tracking ID:
          </Label>
          <Input
            id="internalTrackingId"
            value={formData.internalTrackingId}
            onChange={(e) => handleChange("internalTrackingId", e.target.value)}
            placeholder="Enter your internal tracking ID here..."
            className="bg-gray-50 border-gray-200"
            required
          />
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
            Published
          </Button>
        </div>
      </form>
    </div>
  );
}

export default DonationRoutingForm;
