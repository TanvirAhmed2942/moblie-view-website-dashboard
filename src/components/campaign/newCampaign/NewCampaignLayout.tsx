"use client";

import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from "react";
import { useCreateCampaignMutation } from "../../../features/campaign/campaignApi";
import MultiForm from "./MultiForm";
import SideBarStep from "./SideBarStep";
import AboutTheCauseForm, { AboutTheCauseFormData } from "./forms/AboutTheCauseForm";
import CampaignSettingsForm, { CampaignSettingsFormData } from "./forms/CampaignSettingsForm";
import ContactPersonForm, { ContactPersonFormData } from "./forms/ContactPersonForm";
import DonationRoutingForm, { DonationRoutingFormData } from "./forms/DonationRoutingForm";
import OrganizationInformationForm, { OrganizationFormData } from "./forms/OrganizationInformationForm";

// Define all form steps
const FORM_STEPS = [
  {
    id: "organization",
    title: "Organization Information",
    stepNumber: 1,
  },
  {
    id: "contact",
    title: "Contact Person",
    stepNumber: 2,
  },
  {
    id: "cause",
    title: "About the Cause",
    stepNumber: 3,
  },
  {
    id: "settings",
    title: "Campaign Settings",
    stepNumber: 4,
  },
  {
    id: "routing",
    title: "Donation Routing",
    stepNumber: 5,
  },
];

// Type for all form data
type AllFormData = {
  organization: OrganizationFormData | null;
  contact: ContactPersonFormData | null;
  cause: AboutTheCauseFormData | null;
  settings: CampaignSettingsFormData | null;
  routing: DonationRoutingFormData | null;
};

function NewCampaignLayout() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AllFormData>({
    organization: null,
    contact: null,
    cause: null,
    settings: null,
    routing: null,
  });

  const router = useRouter();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [createCampaign, { isLoading }] = useCreateCampaignMutation();

  const handleFormDataChange = useCallback((stepId: string, data: unknown) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: data,
    }));

    // Clear errors for this step
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[stepId];
      if (stepId === 'cause') delete newErrors.cause_description;
      if (stepId === 'settings') {
        delete newErrors.description;
        delete newErrors.targetAmount;
      }
      return newErrors;
    });
  }, []);

  // Handle Published button click (Step 5)
  const handlePublish = useCallback(async () => {
    // Validate all required fields before submission
    const errors: Record<string, string> = {};

    // Check all required forms are filled
    if (!formData.organization) errors.organization = "Organization information is required";
    if (!formData.contact) errors.contact = "Contact person information is required";
    if (!formData.cause) errors.cause = "About the Cause information is required";
    if (!formData.settings) errors.settings = "Campaign settings are required";
    if (!formData.routing) errors.routing = "Donation routing information is required";

    // Validate case description (from AboutTheCauseForm)
    if (formData.cause && (!formData.cause.cause_description || formData.cause.cause_description.trim().length < 10)) {
      errors.cause_description = "Case description must be at least 10 characters";
    }

    // Validate campaign settings description
    if (formData.settings && (!formData.settings.description || formData.settings.description.trim().length < 10)) {
      errors.description = "Description must be at least 10 characters";
    }

    // Validate target amount is numeric
    if (formData.settings && formData.settings.targetAmount) {
      const targetAmount = formData.settings.targetAmount;
      if (isNaN(Number(targetAmount)) || targetAmount.trim() === "") {
        errors.targetAmount = "Target amount must be a valid number";
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      console.error("Validation errors:", errors);
      return;
    }

    try {
      const data = {
        organization_name: formData.organization?.organization_name,
        organization_type: formData.organization?.organization_type,
        organization_website: formData.organization?.organization_website,
        organization_address: formData.organization?.organization_address,
        contactPerson_name: formData.contact?.contactPerson_name,
        contactPerson_email: formData.contact?.contactPerson_email,
        contactPerson_phone: formData.contact?.contactPerson_phone,
        cause_title: formData.cause?.cause_title,
        cause_description: formData.cause?.cause_description,
        cause_mission: formData.cause?.cause_mission,
        citiesServed: formData.cause?.cities_served,
        yearsOfOperation: formData.cause?.yearsOfOperation,
        survivorsSupported: formData.cause?.survivors_support,
        title: formData.settings?.title,
        description: formData.settings?.description,
        targetAmount: formData.settings?.targetAmount ? Number(formData.settings.targetAmount) : 0,
        startDate: formData.settings?.startDate,
        endDate: formData.settings?.endDate,
        internalTrackingId: formData.routing?.payment_url,
        campaignStatus: "active",
      };

      const makeCustomData = new FormData();
      makeCustomData.append("data", JSON.stringify(data));

      //   // Append all images
      if (formData.cause?.images && formData.cause.images.length > 0){
        formData.cause.images.forEach((image) => {
          makeCustomData.append(`images`, image as File);
        });
      }

      const response = await createCampaign(makeCustomData).unwrap();
      console.log("Campaign created successfully:", response);
      alert("Campaign published successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to publish campaign. Please try again.");
    }
  }, [formData, createCampaign])

  // Map steps to form components
  const formSteps = [
    {
      id: "organization",
      title: "Organization Information",
      component: React.createElement(OrganizationInformationForm, {
        onNext: (data: OrganizationFormData) => {
          handleFormDataChange("organization", data);
          setCurrentStep(2);
        },
        initialData: formData.organization || undefined,
      }),
    },
    {
      id: "contact",
      title: "Contact Person",
      component: React.createElement(ContactPersonForm, {
        onNext: (data: ContactPersonFormData) => {
          handleFormDataChange("contact", data);
          setCurrentStep(3);
        },
        onBack: () => setCurrentStep(1),
        initialData: formData.contact || undefined,
      }),
    },
    {
      id: "cause",
      title: "About the Cause",
      component: React.createElement(AboutTheCauseForm, {
        onNext: (data: AboutTheCauseFormData) => {
          handleFormDataChange("cause", data);
          setCurrentStep(4);
        },
        onBack: () => setCurrentStep(2),
        initialData: formData.cause || undefined,
      }),
    },
    {
      id: "settings",
      title: "Campaign Settings",
      component: React.createElement(CampaignSettingsForm, {
        onNext: (data: CampaignSettingsFormData) => {
          handleFormDataChange("settings", data);
          setCurrentStep(5);
        },
        onBack: () => setCurrentStep(3),
        initialData: formData.settings || undefined,
      }),
    },
    {
      id: "routing",
      title: "Donation Routing",
      component: React.createElement(DonationRoutingForm, {
        onNext: handlePublish,
        loading: isLoading,
        onBack: () => setCurrentStep(4),
        initialData: formData.routing || undefined,
      }),
    },
  ];

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleStepChange = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const handleStepClick = useCallback((stepNumber: number) => {
    const clickedStep = stepNumber;
    let canNavigate = true;
    for (let i = 1; i < clickedStep; i++) {
      if (!formData[FORM_STEPS[i - 1].id as keyof AllFormData]) {
        canNavigate = false;
        break;
      }
    }

    if (canNavigate) {
      setCurrentStep(stepNumber);
    } else {
      console.log("Cannot navigate to step", stepNumber, "- previous steps not completed");
    }
  }, [formData]);

  return (
    <div className=" p-3 bg-white rounded">
      <div className="mx-auto">
        <div onClick={() => router.push("/campaigns")} className='bg-purple-500 px-4 py-1.5 w-20 text-center text-white shadow rounded mb-1 cursor-pointer'>Back</div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Campaign</h1>
            <p className="text-gray-600">
              Follow the steps below to set up and launch your campaign.
            </p>
          </div>
        </div>

        {/* Display validation errors */}
        {Object.keys(formErrors).length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-medium text-red-800 mb-2">Please fix the following errors:</h3>
            <ul className="list-disc list-inside text-red-700">
              {Object.entries(formErrors).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-start gap-8">
          {/* Sidebar */}
          <SideBarStep
            steps={FORM_STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />

          {/* Main Form Area */}
          <MultiForm
            steps={formSteps}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            onBack={handleBack}
            formData={formData}
            onFormDataChange={handleFormDataChange}
          />
        </div>
      </div>
    </div>
  );
}

export default NewCampaignLayout;