"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FiEdit3 } from "react-icons/fi";

interface AboutUsData {
  introduction: string;
  foundersQuote: string;
  ourMission: string;
  howWeOperate: string;
  foundersImage: string;
}

function AboutUs() {
  const [imageError, setImageError] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initial data - in a real app, this would come from an API
  const initialData: AboutUsData = {
    introduction:
      "Pass It Along was created by philanthropists who wanted to make giving more personal and meaningful. We believe that when people share causes they care about with friends and family, it creates a ripple effect of generosity that can transform communities.",
    foundersQuote:
      "\"We wanted to create a simple way for people to share causes they care about with their network. When you give, you're not just donating money—you're inviting others to join you in making a difference.\"",
    ourMission:
      "Our mission is to connect friends in giving, making philanthropy more accessible, personal, and impactful. We enable individuals to support causes they believe in while inspiring their networks to do the same.",
    howWeOperate:
      "It is important to track chain/tree donors to understand the impact of each campaign. We provide transparent reporting and analytics so you can see how your giving creates a network of support. Every donation is tracked, and every donor can see the difference they're making.",
    foundersImage: "/founders-image.jpg", // Placeholder path
  };

  const [aboutUsData, setAboutUsData] = useState<AboutUsData>(initialData);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the data
    console.log("Saving about us content:", aboutUsData);
    // If imagePreview exists, you would upload it here
    if (imagePreview) {
      console.log("New image selected, would upload here");
      // In a real app, upload the image and update foundersImage URL
    }
    setIsEditMode(false);
    setImagePreview(null);
    // In a real app, you would save to your backend here
  };

  const handleInputChange = (field: keyof AboutUsData, value: string) => {
    setAboutUsData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">About Us Content</h2>
          <p className="text-gray-600">
            Update the content for the &apos;About Us&apos; page on your
            website.
          </p>
        </div>
        {isEditMode ? (
          <Button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Save
          </Button>
        ) : (
          <Button variant="outline" onClick={handleEditClick}>
            <FiEdit3 size={15} />
          </Button>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className=" space-y-6">
          {/* Introduction */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Introduction</Label>
            <Textarea
              value={aboutUsData.introduction}
              readOnly={!isEditMode}
              onChange={(e) =>
                handleInputChange("introduction", e.target.value)
              }
              className={`min-h-[150px] resize-none ${
                isEditMode
                  ? "bg-white border-gray-300 text-gray-900"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            />
          </div>

          {/* Our Mission */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Our Mission</Label>
            <Textarea
              value={aboutUsData.ourMission}
              readOnly={!isEditMode}
              onChange={(e) => handleInputChange("ourMission", e.target.value)}
              className={`min-h-[150px] resize-none ${
                isEditMode
                  ? "bg-white border-gray-300 text-gray-900"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            />
          </div>
        </div>
        {/* Right Column */}
        <div className="space-y-6">
          {/* Founder's Quote */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">
              Founder&apos;s Quote
            </Label>
            <Textarea
              value={aboutUsData.foundersQuote}
              readOnly={!isEditMode}
              onChange={(e) =>
                handleInputChange("foundersQuote", e.target.value)
              }
              className={`min-h-[150px] resize-none ${
                isEditMode
                  ? "bg-white border-gray-300 text-gray-900"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            />
          </div>

          {/* How We Operate */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">How We Operate</Label>
            <Textarea
              value={aboutUsData.howWeOperate}
              readOnly={!isEditMode}
              onChange={(e) =>
                handleInputChange("howWeOperate", e.target.value)
              }
              className={`min-h-[150px] resize-none ${
                isEditMode
                  ? "bg-white border-gray-300 text-gray-900"
                  : "bg-gray-50 border-gray-200 text-gray-900"
              }`}
            />
          </div>
        </div>{" "}
        {/* Founder's Image */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">
            Founder&apos;s Image
          </Label>
          <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Founders Preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : imageError ? (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            ) : (
              <Image
                src={aboutUsData.foundersImage}
                alt="Founders"
                fill
                className="object-cover"
                unoptimized
                onError={() => setImageError(true)}
              />
            )}
          </div>
          <p className="text-sm text-gray-500">Recommended size: 600*400px</p>
          {isEditMode && (
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
