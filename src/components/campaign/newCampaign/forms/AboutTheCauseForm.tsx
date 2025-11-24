"use client";

import React, { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface AboutTheCauseFormProps {
  onNext: (data: AboutTheCauseFormData) => void;
  onBack: () => void;
  initialData?: AboutTheCauseFormData;
}

export interface AboutTheCauseFormData {
  causeTitle: string;
  longDescription: string;
  missionStatement: string;
  image?: string; // Store as base64 string for Redux serialization
}

const MAX_CHARACTERS = 280;

function AboutTheCauseForm({
  onNext,
  onBack,
  initialData,
}: AboutTheCauseFormProps) {
  const [formData, setFormData] = useState<AboutTheCauseFormData>({
    causeTitle: initialData?.causeTitle || "",
    longDescription: initialData?.longDescription || "",
    missionStatement: initialData?.missionStatement || "",
    image: initialData?.image,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof AboutTheCauseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImagePreview(base64String);
        setFormData((prev) => ({ ...prev, image: base64String }));
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
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImagePreview(base64String);
        setFormData((prev) => ({ ...prev, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: undefined }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const longDescriptionCount = formData.longDescription.length;
  const missionStatementCount = formData.missionStatement.length;

  return (
    <div className="bg-white border rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Cause</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cause Title */}
        <div className="space-y-2">
          <Label htmlFor="causeTitle" className="text-gray-700">
            Cause Title:
          </Label>
          <Input
            id="causeTitle"
            value={formData.causeTitle}
            onChange={(e) => handleChange("causeTitle", e.target.value)}
            placeholder="Enter your cause title here..."
            className="bg-gray-50 border-gray-200"
            required
          />
        </div>

        {/* Long Description */}
        <div className="space-y-2">
          <Label htmlFor="longDescription" className="text-gray-700">
            Long Description:
          </Label>
          <div className="relative">
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_CHARACTERS) {
                  handleChange("longDescription", value);
                }
              }}
              placeholder="Type your long description here..."
              className="bg-gray-50 border-gray-200 min-h-[120px] resize-none pr-16"
              required
            />
            <div
              className={`absolute bottom-3 right-3 text-sm ${
                longDescriptionCount >= MAX_CHARACTERS
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {longDescriptionCount}/{MAX_CHARACTERS}
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="space-y-2">
          <Label htmlFor="missionStatement" className="text-gray-700">
            Mission Statement:
          </Label>
          <div className="relative">
            <Textarea
              id="missionStatement"
              value={formData.missionStatement}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= MAX_CHARACTERS) {
                  handleChange("missionStatement", value);
                }
              }}
              placeholder="Type your mission statement here..."
              className="bg-gray-50 border-gray-200 min-h-[120px] resize-none pr-16"
              required
            />
            <div
              className={`absolute bottom-3 right-3 text-sm ${
                missionStatementCount >= MAX_CHARACTERS
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {missionStatementCount}/{MAX_CHARACTERS}
            </div>
          </div>
        </div>

        {/* Upload Image */}
        <div className="space-y-2">
          <Label className="text-gray-700">Upload Image</Label>
          {imagePreview &&
          typeof imagePreview === "string" &&
          imagePreview.length > 0 ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
              <Image
                src={imagePreview}
                alt="Cause preview"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
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
                accept="image/jpeg,image/png"
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
