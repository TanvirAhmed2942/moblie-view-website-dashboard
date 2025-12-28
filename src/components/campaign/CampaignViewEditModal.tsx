"use client";
import { Megaphone, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUpdateCampaignMutation } from '../../features/campaign/campaignApi';
import { baseURL } from '../../utils/BaseURL';
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

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
  cause_image?: string;
  organization_name?: string;
  title?: string;
  organization_website?: string;
  donor_name?: string;
  cause_title?: string;
  cause_description?: string;
  cause_mission?: string;
  contactPerson_name?: string;
  contactPerson_email?: string;
  contactPerson_phone?: string;
  organization_taxId?: string;
  organization_type?: string;
  organization_address?: string;
  description?: string;
  targetAmount?: number;
  campaignStatus?: string;
}

interface CampaignViewEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: any; // Changed to accept raw API response
  mode: "view" | "edit";
  onSuccess?: () => void;
}

function CampaignViewEditModal({
  isOpen,
  onClose,
  campaign,
  mode,
  onSuccess,
}: CampaignViewEditModalProps) {
  const [formData, setFormData] = useState<CampaignData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [updateCampaign] = useUpdateCampaignMutation();

  useEffect(() => {
    if (campaign) {
      // Transform API response to form data
      setFormData({
        id: campaign._id || campaign.id,
        organizationName: campaign.organization_name || "",
        campaignName: campaign.title || "",
        websiteUrl: campaign.organization_website || "",
        startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : "",
        endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : "",
        seedDonationAmount: campaign.targetAmount ? `$${campaign.targetAmount}` : "$0",
        causeTitle: campaign.cause_title || "",
        longDescription: campaign.cause_description || campaign.description || "",
        missionStatement: campaign.cause_mission || "",
        contactFullName: campaign.contactPerson_name || "",
        contactEmail: campaign.contactPerson_email || "",
        contactPhone: campaign.contactPerson_phone || "",
        dafPartner: campaign.dafPartner || "",
        internalTrackingId: campaign.internalTrackingId || "",
        shortDescription: campaign.description || "",
        seedDonorName: campaign.donor_name || "",
        taxId: campaign.organization_taxId || "",
        organizationType: campaign.organization_type || "",
        address: campaign.organization_address || campaign.address || "",
        cause_image: campaign.cause_image || "",
        organization_name: campaign.organization_name || "",
        title: campaign.title || "",
        organization_website: campaign.organization_website || "",
        donor_name: campaign.donor_name || "",
        cause_title: campaign.cause_title || "",
        cause_description: campaign.cause_description || "",
        cause_mission: campaign.cause_mission || "",
        contactPerson_name: campaign.contactPerson_name || "",
        contactPerson_email: campaign.contactPerson_email || "",
        contactPerson_phone: campaign.contactPerson_phone || "",
        organization_taxId: campaign.organization_taxId || "",
        organization_type: campaign.organization_type || "",
        organization_address: campaign.organization_address || "",
        description: campaign.description || "",
        targetAmount: campaign.targetAmount || 0,
        campaignStatus: campaign.campaignStatus || "draft",
      });

      if (campaign.cause_image) {
        setImagePreview(baseURL + campaign.cause_image);
      }
    }
  }, [campaign, isOpen]);

  const handleInputChange = (field: keyof CampaignData, value: string | number) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const prepareFormData = () => {
    if (!formData) return null;

    // Extract numeric value from currency string
    const targetAmount = typeof formData.targetAmount === 'number'
      ? formData.targetAmount
      : parseFloat(formData.seedDonationAmount?.replace(/[^0-9.-]+/g, "") || "0");

    const campaignData = {
      organization_name: formData.organizationName,
      organization_website: formData.websiteUrl,
      organization_type: formData.organizationType,
      organization_taxId: formData.taxId,
      organization_address: formData.address,
      contactPerson_name: formData.contactFullName,
      contactPerson_email: formData.contactEmail,
      contactPerson_phone: formData.contactPhone,
      cause_title: formData.causeTitle,
      cause_description: formData.longDescription,
      cause_mission: formData.missionStatement,
      title: formData.campaignName,
      address: formData.address,
      description: formData.shortDescription,
      donor_name: formData.seedDonorName,
      targetAmount: targetAmount,
      startDate: formData.startDate,
      endDate: formData.endDate,
      dafPartner: formData.dafPartner,
      internalTrackingId: formData.internalTrackingId,
      campaignStatus: formData.campaignStatus,
    };

    console.log("Final campaign data:", campaignData);

    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(campaignData));

    if (selectedImage) {
      formDataToSend.append("image", selectedImage);
    }

    return { formData: formDataToSend, id: formData.id };
  };

  const handleSave = async () => {
    if (!formData) return;

    setIsSaving(true);
    try {
      const preparedData = prepareFormData();
      console.log("Prepared data:", preparedData);
      if (!preparedData) return;

      const response = await updateCampaign({
        data: preparedData.formData,
        id: preparedData.id
      }).unwrap();

      toast.success(response.message || "Campaign updated successfully!");

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error: any) {
      console.error('Error updating campaign:', error);
      toast.error(error?.data?.message || "Failed to update campaign. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!formData) return null;

  const isEditMode = mode === "edit";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="min-w-6xl max-w-6xl max-h-[80vh] overflow-y-auto p-0"
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
                  {isEditMode ? "Edit Campaign" : "Campaign Detailed View"}
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              disabled={isSaving}
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
                      ) : formData.cause_image ? (
                        <Image
                          src={baseURL + formData.cause_image}
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
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                      <Textarea
                        value={formData.shortDescription || ""}
                        onChange={(e) =>
                          handleInputChange("shortDescription", e.target.value)
                        }
                        className="mt-1 border-gray-300 min-h-[80px]"
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                          handleInputChange("targetAmount", parseFloat(e.target.value.replace(/[^0-9.-]+/g, "")) || 0)
                        }
                        className="mt-1 border-gray-300"
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.seedDonationAmount}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium">
                        Start Date:
                      </Label>
                      {isEditMode ? (
                        <Input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            handleInputChange("startDate", e.target.value)
                          }
                          className="mt-1 border-gray-300"
                          disabled={isSaving}
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">
                          {new Date(formData.startDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-gray-700 font-medium">
                        End Date:
                      </Label>
                      {isEditMode ? (
                        <Input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) =>
                            handleInputChange("endDate", e.target.value)
                          }
                          className="mt-1 border-gray-300"
                          disabled={isSaving}
                        />
                      ) : (
                        <p className="mt-1 text-gray-900">
                          {new Date(formData.endDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Campaign Status:
                    </Label>
                    {isEditMode ? (
                      <select
                        value={formData.campaignStatus || "draft"}
                        onChange={(e) =>
                          handleInputChange("campaignStatus", e.target.value)
                        }
                        className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                        disabled={isSaving}
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.campaignStatus?.charAt(0).toUpperCase() + formData.campaignStatus?.slice(1)}
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
                        disabled={isSaving}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">
                        {formData.contactFullName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-medium">
                      Email:
                    </Label>
                    {isEditMode ? (
                      <Input
                        type="email"
                        value={formData.contactEmail || ""}
                        onChange={(e) =>
                          handleInputChange("contactEmail", e.target.value)
                        }
                        className="mt-1 border-gray-300"
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                        disabled={isSaving}
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
                disabled={isSaving}
                className="px-8 py-6 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </div>
                ) : (
                  "Save All Changes"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CampaignViewEditModal;