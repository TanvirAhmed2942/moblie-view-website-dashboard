"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import toast from 'react-hot-toast';

interface AboutTheCauseFormProps {
  onNext: (data: AboutTheCauseFormData) => void;
  onBack: () => void;
  initialData?: AboutTheCauseFormData;
}

export interface AboutTheCauseFormData {
  cause_title: string;
  cause_description: string;
  cause_mission: string;
  image?: File; // Store as File object
  imagePreview?: string; // Store preview as base64 string
}

const MAX_CHARACTERS = 280;
const MIN_CASE_DESCRIPTION_CHARS = 10;

function AboutTheCauseForm({
  onNext,
  onBack,
  initialData,
}: AboutTheCauseFormProps) {
  const [formData, setFormData] = useState<AboutTheCauseFormData>({
    cause_title: initialData?.cause_title || "",
    cause_description: initialData?.cause_description || "",
    cause_mission: initialData?.cause_mission || "",
    image: initialData?.image,
    imagePreview: initialData?.imagePreview,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof AboutTheCauseFormData, value: string) => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Create base64 preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;

        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: base64String // Store as base64 data URL
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG or PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Create base64 preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;

      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: base64String // Store as base64 data URL
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: undefined,
      imagePreview: undefined
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate cause title
    if (!formData.cause_title.trim()) {
      newErrors.cause_title = 'Cause title is required';
    }

    // Validate case description
    if (!formData.cause_description.trim()) {
      newErrors.cause_description = 'Case description is required';
    } else if (formData.cause_description.trim().length < MIN_CASE_DESCRIPTION_CHARS) {
      newErrors.cause_description = `Case description must be at least ${MIN_CASE_DESCRIPTION_CHARS} characters`;
    }

    // Validate mission statement
    if (!formData.cause_mission.trim()) {
      newErrors.cause_mission = 'Mission statement is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onNext(formData);
  };

  const causeDescriptionCount = formData.cause_description.length;
  const causeMissionCount = formData.cause_mission.length;

  return (
    <div className="bg-white border rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Cause</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cause Title */}
        <div className="space-y-2">
          <Label htmlFor="cause_title" className="text-gray-700">
            Cause Title:
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="cause_title"
            value={formData.cause_title}
            onChange={(e) => handleChange("cause_title", e.target.value)}
            placeholder="Enter your cause title here..."
            className={`bg-gray-50 border-gray-200 ${errors.cause_title ? 'border-red-500' : ''}`}
            required
          />
          {errors.cause_title && (
            <p className="text-red-500 text-sm mt-1">{errors.cause_title}</p>
          )}
        </div>

        {/* Case Description */}
        <div className="space-y-2">
          <Label htmlFor="cause_description" className="text-gray-700">
            Case Description:
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Textarea
              id="cause_description"
              value={formData.cause_description}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_CHARACTERS) {
                  handleChange("cause_description", value);
                }
              }}
              placeholder="Type your case description here..."
              className={`bg-gray-50 border-gray-200 min-h-[120px] resize-none pr-16 ${errors.cause_description ? 'border-red-500' : ''}`}
              required
            />
            <div className="flex justify-between mt-1">
              <div className="text-left">
                {errors.cause_description && (
                  <p className="text-red-500 text-sm">{errors.cause_description}</p>
                )}
                <p className="text-sm text-gray-500">
                  Minimum {MIN_CASE_DESCRIPTION_CHARS} characters required
                </p>
              </div>
              <div
                className={`text-sm ${causeDescriptionCount >= MAX_CHARACTERS
                  ? "text-red-500"
                  : causeDescriptionCount < MIN_CASE_DESCRIPTION_CHARS
                    ? "text-amber-500"
                    : "text-gray-400"
                  }`}
              >
                {causeDescriptionCount}/{MAX_CHARACTERS}
              </div>
            </div>
          </div>
        </div>

        {/* Cause Mission */}
        <div className="space-y-2">
          <Label htmlFor="cause_mission" className="text-gray-700">
            Mission Statement:
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Textarea
              id="cause_mission"
              value={formData.cause_mission}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_CHARACTERS) {
                  handleChange("cause_mission", value);
                }
              }}
              placeholder="Type your mission statement here..."
              className={`bg-gray-50 border-gray-200 min-h-[120px] resize-none pr-16 ${errors.cause_mission ? 'border-red-500' : ''}`}
              required
            />
            <div className="flex justify-between mt-1">
              <div className="text-left">
                {errors.cause_mission && (
                  <p className="text-red-500 text-sm">{errors.cause_mission}</p>
                )}
              </div>
              <div
                className={`text-sm ${causeMissionCount >= MAX_CHARACTERS
                  ? "text-red-500"
                  : "text-gray-400"
                  }`}
              >
                {causeMissionCount}/{MAX_CHARACTERS}
              </div>
            </div>
          </div>
        </div>

        {/* Upload Image */}
        <div className="space-y-2">
          <Label className="text-gray-700">Upload Image</Label>
          {formData.imagePreview ? (
            <div className="space-y-2">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                {/* Use regular img tag instead of Next.js Image for base64 */}
                <img
                  src={formData.imagePreview}
                  alt="Cause preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* File information display */}
              {formData.image && (
                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded border">
                  <p><strong>File Name:</strong> {formData.image.name}</p>
                  <p><strong>File Type:</strong> {formData.image.type}</p>
                  <p><strong>File Size:</strong> {(formData.image.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p><strong>Last Modified:</strong> {new Date(formData.image.lastModified).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Uploaded image JPG and PNG
              </p>
              <p className="text-xs text-gray-400">
                Click to upload or drag and drop
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
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

export default AboutTheCauseForm;