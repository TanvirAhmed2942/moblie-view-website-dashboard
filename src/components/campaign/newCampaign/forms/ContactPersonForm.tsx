"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ContactPersonFormProps {
  onNext: (data: ContactPersonFormData) => void;
  onBack: () => void;
  initialData?: ContactPersonFormData;
}

export interface ContactPersonFormData {
  fullName: string;
  title: string;
  email: string;
  phoneNumber: string;
}

function ContactPersonForm({
  onNext,
  onBack,
  initialData,
}: ContactPersonFormProps) {
  const [formData, setFormData] = useState<ContactPersonFormData>({
    fullName: initialData?.fullName || "",
    title: initialData?.title || "",
    email: initialData?.email || "",
    phoneNumber: initialData?.phoneNumber || "",
  });

  const handleChange = (field: keyof ContactPersonFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Person</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-gray-700">
            Full Name:
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Enter your name here..."
            className="bg-gray-50 border-gray-200"
            required
          />
        </div>

        {/* Title / Role */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-gray-700">
            Title / Role:
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Enter your title / role here..."
            className="bg-gray-50 border-gray-200"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">
            Email:
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter your email address here..."
            className="bg-gray-50 border-gray-200"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-gray-700">
            Phone Number:
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleChange("phoneNumber", e.target.value)}
            placeholder="Enter your phone number here..."
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
            Save & Continue
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ContactPersonForm;
