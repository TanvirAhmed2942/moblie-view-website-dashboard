"use client";

import React from "react";
import SideBarStep from "./SideBarStep";
import MultiForm from "./MultiForm";
import OrganizationInformationForm from "./forms/OrganizationInformationForm";
import ContactPersonForm from "./forms/ContactPersonForm";
import AboutTheCauseForm from "./forms/AboutTheCauseForm";
import CampaignSettingsForm from "./forms/CampaignSettingsForm";
import DonationRoutingForm from "./forms/DonationRoutingForm";
import { OrganizationFormData } from "./forms/OrganizationInformationForm";
import { ContactPersonFormData } from "./forms/ContactPersonForm";
import { AboutTheCauseFormData } from "./forms/AboutTheCauseForm";
import { CampaignSettingsFormData } from "./forms/CampaignSettingsForm";
import { DonationRoutingFormData } from "./forms/DonationRoutingForm";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setCurrentStep,
  updateFormData,
} from "@/redux/slices/campaignFormSlice";

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

function NewCampaignLayout() {
  const dispatch = useAppDispatch();
  const { currentStep, formData } = useAppSelector(
    (state) => state.campaignForm
  );

  // Map steps to form components - just pass the component type, not rendered
  const formSteps = [
    {
      id: "organization",
      title: "Organization Information",
      component: React.createElement(OrganizationInformationForm, {
        onNext: () => {},
      }),
    },
    {
      id: "contact",
      title: "Contact Person",
      component: React.createElement(ContactPersonForm, {
        onNext: () => {},
        onBack: () => {},
      }),
    },
    {
      id: "cause",
      title: "About the Cause",
      component: React.createElement(AboutTheCauseForm, {
        onNext: () => {},
        onBack: () => {},
      }),
    },
    {
      id: "settings",
      title: "Campaign Settings",
      component: React.createElement(CampaignSettingsForm, {
        onNext: () => {},
        onBack: () => {},
      }),
    },
    {
      id: "routing",
      title: "Donation Routing",
      component: React.createElement(DonationRoutingForm, {
        onNext: () => {},
        onBack: () => {},
      }),
    },
  ];

  const handleFormDataChange = (stepId: string, data: unknown) => {
    dispatch(
      updateFormData({
        stepId,
        data: data as
          | OrganizationFormData
          | ContactPersonFormData
          | AboutTheCauseFormData
          | CampaignSettingsFormData
          | DonationRoutingFormData
          | Record<string, unknown>,
      })
    );
  };

  const handleBack = () => {
    if (currentStep > 1) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  const handleStepChange = (step: number) => {
    dispatch(setCurrentStep(step));
  };

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigation to completed steps or current step
    const completedSteps = Object.keys(formData).length;
    if (stepNumber <= completedSteps + 1) {
      dispatch(setCurrentStep(stepNumber));
    }
  };

  return (
    <div className="min-h-screen ">
      <div className=" mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 ">New Campaign</h1>
        <p className="text-gray-600 mb-8">
          Follow the steps below to set up and launch your campaign.
        </p>

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
