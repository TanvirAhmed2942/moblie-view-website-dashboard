"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { X, Megaphone } from "lucide-react";
import Image from "next/image";

export interface CampaignData {
  id: string;
  organizationName: string;
  campaignName: string;
  websiteUrl: string;
  startDate: string;
  endDate: string;
  seedDonationAmount: string;
  // Additional fields for the modal
  causeTitle?: string;
  longDescription?: string;
  missionStatement?: string;
  contactFullName?: string;
  contactTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  dafPartner?: string;
  internalTrackingId?: string;
  shortDescription?: string;
  seedDonorName?: string;
  taxId?: string;
  organizationType?: string;
  address?: string;
  campaignImage?: string;
}

interface CampaignViewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignData | null;
  mode: "view" | "edit";
}

function CampaignViewEditModal({
  isOpen,
  onClose,
  campaign,
  mode,
}: CampaignViewEditModalProps) {
  const [formData, setFormData] = useState<CampaignData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (campaign) {
      setFormData({
        ...campaign,
        causeTitle: campaign.causeTitle || "Clean Water for Everyone",
        longDescription:
          campaign.longDescription ||
          "This campaign aims to build and maintain 10 new wells in rural communities, providing access to clean, safe drinking water for over 5,000 people. Access to clean water improves health, education, and economic opportunities.",
        missionStatement:
          campaign.missionStatement ||
          "To ensure every person has the fundamental right to clean and safe drinking water.",
        contactFullName: campaign.contactFullName || "Jane Doe",
        contactTitle: campaign.contactTitle || "Campaign Manager",
        contactEmail: campaign.contactEmail || "info@example.com",
        contactPhone: campaign.contactPhone || "(555) 123-4567",
        dafPartner: campaign.dafPartner || "Fidelity Charitable",
        internalTrackingId: campaign.internalTrackingId || "CAMP-WS2023-04",
        shortDescription:
          campaign.shortDescription ||
          "Help us bring clean water to 5,000 people.",
        seedDonorName: campaign.seedDonorName || "The Generous Foundation",
        taxId: campaign.taxId || "12-3456789",
        organizationType: campaign.organizationType || "501(3) Non-Profit",
        address: campaign.address || "6391 Elgin St. Celina, Delaware 10299",
        campaignImage: campaign.campaignImage || "/campaign-image.jpg",
      });
    }
  }, [campaign, isOpen]);

  const handleInputChange = (field: keyof CampaignData, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
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

  const handleSave = () => {
    console.log("Saving campaign data:", formData);
    // Here you would typically make an API call to save the data
    onClose();
  };

  if (!formData) return null;

  const isEditMode = mode === "edit";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="min-w-6xl max-w-6xl max-h-[70vh] overflow-y-auto p-0"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-red-600" />
              <div>
                <DialogTitle className="text-3xl font-bold text-gray-900">
                  {formData.campaignName}
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600 mt-1">
                  Campaign Detailed View
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6 col-span-2">
              {/* About the Cause */}
              <div className="border rounded-lg p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About the Cause
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 font-medium mb-2 block">
                      Campaign Image
                    </Label>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Campaign Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : formData.campaignImage ? (
                        <Image
                          src={formData.campaignImage}
                          alt="Campaign"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    {isEditMode && (
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Cause Title:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.causeTitle || ""}
                        onChange={(e) =>
                          handleInputChange("causeTitle", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.causeTitle}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Long Description
                    </Label>
                    {isEditMode ? (
                      <Textarea
                        value={formData.longDescription || ""}
                        onChange={(e) =>
                          handleInputChange("longDescription", e.target.value)
                        }
                        className="mt-1 border-gray-300 min-h-[100px]"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                        {formData.longDescription}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Mission Statement
                    </Label>
                    {isEditMode ? (
                      <Textarea
                        value={formData.missionStatement || ""}
                        onChange={(e) =>
                          handleInputChange("missionStatement", e.target.value)
                        }
                        className="mt-1 border-gray-300 min-h-[80px]"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                        {formData.missionStatement}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Campaign Settings */}
              <div className="border rounded-lg p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Campaign Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Campaign Name:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.campaignName}
                        onChange={(e) =>
                          handleInputChange("campaignName", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.campaignName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Short Description:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.shortDescription || ""}
                        onChange={(e) =>
                          handleInputChange("shortDescription", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.shortDescription}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Seed Donor Name:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.seedDonorName || ""}
                        onChange={(e) =>
                          handleInputChange("seedDonorName", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.seedDonorName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Seed Donation Amount:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.seedDonationAmount}
                        onChange={(e) =>
                          handleInputChange(
                            "seedDonationAmount",
                            e.target.value
                          )
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.seedDonationAmount}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Start & End Date:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={`${formData.startDate} - ${formData.endDate}`}
                        onChange={(e) => {
                          const dates = e.target.value.split(" - ");
                          if (dates.length === 2) {
                            handleInputChange("startDate", dates[0]);
                            handleInputChange("endDate", dates[1]);
                          }
                        }}
                        className="mt-1 border-gray-300"
                        placeholder="Oct 1, 2023 - Dec 31, 2023"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.startDate} - {formData.endDate}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6 col-span-1">
              {/* Contact Person */}
              <div className="border rounded-lg p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Person
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Full Name:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.contactFullName || ""}
                        onChange={(e) =>
                          handleInputChange("contactFullName", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.contactFullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Title / Role:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.contactTitle || ""}
                        onChange={(e) =>
                          handleInputChange("contactTitle", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.contactTitle}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">Email:</Label>
                    {isEditMode ? (
                      <Input
                        type="email"
                        value={formData.contactEmail || ""}
                        onChange={(e) =>
                          handleInputChange("contactEmail", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.contactEmail}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Phone Number:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.contactPhone || ""}
                        onChange={(e) =>
                          handleInputChange("contactPhone", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.contactPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Donation Routing */}
              <div className="border rounded-lg p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Donation Routing
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 font-medium">
                      DAF Partner:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.dafPartner || ""}
                        onChange={(e) =>
                          handleInputChange("dafPartner", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.dafPartner}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Internal Tracking ID:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.internalTrackingId || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "internalTrackingId",
                            e.target.value
                          )
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.internalTrackingId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Organization Information */}
              <div className="border rounded-lg p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Organization Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Organization Name:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.organizationName}
                        onChange={(e) =>
                          handleInputChange("organizationName", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.organizationName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Tax ID/EIN:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.taxId || ""}
                        onChange={(e) =>
                          handleInputChange("taxId", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.taxId}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Organization Type:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.organizationType || ""}
                        onChange={(e) =>
                          handleInputChange("organizationType", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.organizationType}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Website URL:
                    </Label>
                    {isEditMode ? (
                      <Input
                        value={formData.websiteUrl}
                        onChange={(e) =>
                          handleInputChange("websiteUrl", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.websiteUrl}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Address:
                    </Label>
                    {isEditMode ? (
                      <Textarea
                        value={formData.address || ""}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="mt-1 border-gray-300 min-h-[80px]"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                        {formData.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditMode && (
            <div className="flex justify-center pt-4 border-t">
              <Button
                onClick={handleSave}
                className="px-8 py-6 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-lg"
              >
                Save All Changes
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CampaignViewEditModal;
