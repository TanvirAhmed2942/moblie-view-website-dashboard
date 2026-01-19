"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import Image from 'next/image';
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
  cities_served?: string;
  yearsOfOperation?: number;
  survivors_support?: string;
  images?: File[]; // Changed to array of Files
  imagePreviews?: string[]; // Changed to array of base64 strings
}



const MAX_CHARACTERS = 280;
const MIN_CASE_DESCRIPTION_CHARS = 10;
const MAX_IMAGES = 10; // Maximum number of images allowed

function AboutTheCauseForm({
  onNext,
  onBack,
  initialData,
}: AboutTheCauseFormProps) {
  const [formData, setFormData] = useState<AboutTheCauseFormData>({
    cause_title: initialData?.cause_title || "",
    cause_description: initialData?.cause_description || "",
    cause_mission: initialData?.cause_mission || "",
    cities_served: initialData?.cities_served || "",
    yearsOfOperation: Number(initialData?.yearsOfOperation),
    survivors_support: initialData?.survivors_support || "",
    images: initialData?.images || [],
    imagePreviews: initialData?.imagePreviews || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof AboutTheCauseFormData, value: any) => {
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
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    // Convert FileList to Array and validate each file
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} - Not an image file`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} - Size exceeds 5MB`);
        return;
      }
      validFiles.push(file);
    });

    // Show error for invalid files
    if (invalidFiles.length > 0) {
      toast.error(`Some files were invalid: ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length === 0) return;

    // Check if adding these files would exceed the maximum limit
    const currentCount = formData.images?.length || 0;
    const newCount = currentCount + validFiles.length;

    if (newCount > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed. You have ${currentCount} images already.`);
      return;
    }

    // Create base64 previews for all valid files
    const promises = validFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          resolve(base64String);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(previews => {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...validFiles],
        imagePreviews: [...(prev.imagePreviews || []), ...previews]
      }));
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} - Not an image file`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} - Size exceeds 5MB`);
        return;
      }
      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      toast.error(`Some files were invalid: ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length === 0) return;

    const currentCount = formData.images?.length || 0;
    const newCount = currentCount + validFiles.length;

    if (newCount > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed. You have ${currentCount} images already.`);
      return;
    }

    const promises = validFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64String = event.target?.result as string;
          resolve(base64String);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(previews => {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...validFiles],
        imagePreviews: [...(prev.imagePreviews || []), ...previews]
      }));
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const newImages = [...(prev.images || [])];
      const newPreviews = [...(prev.imagePreviews || [])];

      newImages.splice(index, 1);
      newPreviews.splice(index, 1);

      return {
        ...prev,
        images: newImages,
        imagePreviews: newPreviews
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate cause title
    if (!formData.cause_title.trim()) {
      newErrors.cause_title = 'Cause title is required';
    }

    // Validate cities served
    if (!formData.cities_served?.trim()) {
      newErrors.cities_served = 'Cities served is required';
    }

    // Validate years of operation
    if (!formData.yearsOfOperation) {
      newErrors.yearsOfOperation = 'Years of operation is required';
    }

    // Validate survivors support
    if (!formData.survivors_support?.trim()) {
      newErrors.survivors_support = 'Survivors support information is required';
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
  const imageCount = formData.imagePreviews?.length || 0;

  return (
    <div className="bg-white border rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Cause</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cause Title */}
        <div className='grid grid-cols-2 gap-3'>
          <div className="space-y-2">
            <Label htmlFor="cause_title" className="text-gray-700">
              Cause Title:
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="cause_title"
              type="text"
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

          <div className="space-y-2">
            <Label htmlFor="cities_served" className="text-gray-700">
              Cities Served:
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="cities_served"
              value={formData.cities_served}
              onChange={(e) => handleChange("cities_served", e.target.value)}
              placeholder="Enter cities served (comma separated)..."
              className={`bg-gray-50 border-gray-200 ${errors.cities_served ? 'border-red-500' : ''}`}
              required
            />
            {errors.cities_served && (
              <p className="text-red-500 text-sm mt-1">{errors.cities_served}</p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className="space-y-2">
            <Label htmlFor="yearsOfOperation" className="text-gray-700">
              Years of Operation:
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="yearsOfOperation"
              type="number"
              value={formData.yearsOfOperation}
              onChange={(e) => handleChange("yearsOfOperation", e.target.value)}
              placeholder="Enter years of operation..."
              className={`bg-gray-50 border-gray-200 ${errors.yearsOfOperation ? 'border-red-500' : ''}`}
              required
            />
            {errors.yearsOfOperation && (
              <p className="text-red-500 text-sm mt-1">{errors.yearsOfOperation}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="survivors_support" className="text-gray-700">
              Survivors Support:
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="survivors_support"
              value={formData.survivors_support}
              onChange={(e) => handleChange("survivors_support", e.target.value)}
              placeholder="Enter number or details of survivors supported..."
              className={`bg-gray-50 border-gray-200 ${errors.survivors_support ? 'border-red-500' : ''}`}
              required
            />
            {errors.survivors_support && (
              <p className="text-red-500 text-sm mt-1">{errors.survivors_support}</p>
            )}
          </div>
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

        {/* Upload Multiple Images */}
        <div className="space-y-2">
          <Label className="text-gray-700">
            Upload Images
            <span className="text-gray-500 text-sm ml-2">
              (Maximum {MAX_IMAGES} images, {imageCount}/{MAX_IMAGES} uploaded)
            </span>
          </Label>

          {formData.imagePreviews && formData.imagePreviews.length > 0 ? (
            <div className="space-y-4">
              {/* Image Grid */}
              <div className="grid grid-cols-3 gap-4">
                {formData.imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                      <Image
                        src={preview}
                        alt={`Cause preview ${index + 1}`}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                    <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>
                ))}

                {/* Add More Button if under limit */}
                {imageCount < MAX_IMAGES && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Add More</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {MAX_IMAGES - imageCount} remaining
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Upload New Button (if no images yet) */}
              {imageCount === 0 && (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload images (JPG, PNG)
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    Maximum {MAX_IMAGES} images, 5MB each
                  </p>
                  <p className="text-xs text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          ) : (
            /* Upload Area when no images */
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Upload images (JPG, PNG)
              </p>
              <p className="text-xs text-gray-400 mb-2">
                Maximum {MAX_IMAGES} images, 5MB each
              </p>
              <p className="text-xs text-gray-400">
                Click to upload or drag and drop
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
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