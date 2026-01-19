"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

interface DonationRoutingFormProps {
  onNext: (data: DonationRoutingFormData) => void;
  onBack: () => void;
  initialData?: DonationRoutingFormData;
  loading?: boolean;
}

export interface DonationRoutingFormData {
  payment_url: string;
}

function DonationRoutingForm({
  onNext,
  onBack,
  initialData,
  loading = false,
}: DonationRoutingFormProps) {
  const [formData, setFormData] = useState<DonationRoutingFormData>({
    payment_url: initialData?.payment_url || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleChange = (field: keyof DonationRoutingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.payment_url.trim()) {
      newErrors.payment_url = "Payment URL is required";
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Routing</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment URL */}
        <div className="space-y-2">
          <Label htmlFor="payment_url" className="text-gray-700">
            Payment URL:
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="payment_url"
            value={formData.payment_url}
            onChange={(e) => handleChange("payment_url", e.target.value)}
            placeholder="Enter your payment URL here..."
            className={`bg-gray-50 border-gray-200 ${errors.payment_url ? "border-red-500" : ""
              }`}
            required
            disabled={loading}
          />
          {errors.payment_url && (
            <p className="text-red-500 text-sm mt-1">{errors.payment_url}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8"
            disabled={loading}
          >
            Back
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-8 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
                Publishing Campaign...
              </>
            ) : (
              "Publish Campaign"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default DonationRoutingForm;
