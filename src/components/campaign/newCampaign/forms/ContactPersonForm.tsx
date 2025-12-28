"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";

interface ContactPersonFormProps {
  onNext: (data: ContactPersonFormData) => void;
  onBack: () => void;
  initialData?: ContactPersonFormData;
}

export interface ContactPersonFormData {
  contactPerson_name: string;
  contactPerson_title: string;
  contactPerson_email: string;
  contactPerson_phone: string;
}

function ContactPersonForm({
  onNext,
  onBack,
  initialData,
}: ContactPersonFormProps) {
  const [formData, setFormData] = useState<ContactPersonFormData>({
    contactPerson_name: initialData?.contactPerson_name || "",
    contactPerson_title: initialData?.contactPerson_title || "",
    contactPerson_email: initialData?.contactPerson_email || "",
    contactPerson_phone: initialData?.contactPerson_phone || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ContactPersonFormData, value: string) => {
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

    if (!formData.contactPerson_name.trim()) {
      newErrors.contactPerson_name = "Full name is required";
    }

    if (!formData.contactPerson_title.trim()) {
      newErrors.contactPerson_title = "Title/Role is required";
    }

    if (!formData.contactPerson_email.trim()) {
      newErrors.contactPerson_email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactPerson_email)) {
      newErrors.contactPerson_email = "Please enter a valid email address";
    }

    if (!formData.contactPerson_phone.trim()) {
      newErrors.contactPerson_phone = "Phone number is required";
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Person</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="contactPerson_name" className="text-gray-700">
            Full Name:
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="contactPerson_name"
            value={formData.contactPerson_name}
            onChange={(e) => handleChange("contactPerson_name", e.target.value)}
            placeholder="Enter your name here..."
            className={`bg-gray-50 border-gray-200 ${errors.contactPerson_name ? 'border-red-500' : ''}`}
            required
          />
          {errors.contactPerson_name && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPerson_name}</p>
          )}
        </div>

        {/* Title / Role */}
        <div className="space-y-2">
          <Label htmlFor="contactPerson_title" className="text-gray-700">
            Title / Role:
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="contactPerson_title"
            value={formData.contactPerson_title}
            onChange={(e) => handleChange("contactPerson_title", e.target.value)}
            placeholder="Enter your title / role here..."
            className={`bg-gray-50 border-gray-200 ${errors.contactPerson_title ? 'border-red-500' : ''}`}
            required
          />
          {errors.contactPerson_title && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPerson_title}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="contactPerson_email" className="text-gray-700">
            Email:
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="contactPerson_email"
            type="email"
            value={formData.contactPerson_email}
            onChange={(e) => handleChange("contactPerson_email", e.target.value)}
            placeholder="Enter your email address here..."
            className={`bg-gray-50 border-gray-200 ${errors.contactPerson_email ? 'border-red-500' : ''}`}
            required
          />
          {errors.contactPerson_email && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPerson_email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="contactPerson_phone" className="text-gray-700">
            Phone Number:
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="contactPerson_phone"
            type="number"
            value={formData.contactPerson_phone}
            onChange={(e) => handleChange("contactPerson_phone", e.target.value)}
            placeholder="Enter your phone number here..."
            className={`bg-gray-50 border-gray-200 ${errors.contactPerson_phone ? 'border-red-500' : ''}`}
            required
          />
          {errors.contactPerson_phone && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPerson_phone}</p>
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