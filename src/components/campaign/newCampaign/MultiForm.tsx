"use client";

import { useRouter } from 'next/navigation';
import React, { ReactElement } from "react";
import toast from 'react-hot-toast';
import { useCreateCampaignMutation } from '../../../features/campaign/campaignApi';

interface FormStep {
  id: string;
  title: string;
  component: ReactElement;
}

interface MultiFormProps {
  steps: FormStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onBack?: () => void;
  formData: Record<string, unknown>;
  onFormDataChange: (stepId: string, data: unknown) => void;
}

function MultiForm({
  steps,
  currentStep,
  onStepChange,
  onBack,
  formData,
  onFormDataChange,
}: MultiFormProps) {
  const [createCampaign, { isLoading }] = useCreateCampaignMutation();
  const router = useRouter();
  const currentForm = steps[currentStep - 1];

  if (!currentForm) {
    return <div>Form not found</div>;
  }

  // Clone the component and inject props
  const formComponent = React.cloneElement(currentForm.component, {
    onNext: async (data: unknown) => {
      try {
        // Save current step data
        onFormDataChange(currentForm.id, data);

        // Move to next step if available
        if (currentStep < steps.length) {
          onStepChange(currentStep + 1);
        } else {
          // If this is the last step, submit all data
          console.log("Last step completed. All form data:", formData);

          // Type guard helper
          const getFormDataField = (obj: unknown, field: string): unknown => {
            if (obj && typeof obj === 'object' && field in obj) {
              return (obj as Record<string, unknown>)[field];
            }
            return undefined;
          };

          const org = formData.organization;
          const contact = formData.contact;
          const cause = formData.cause;
          const settings = formData.settings;
          const routing = formData.routing;

          const campaignData = {
            organization_name: getFormDataField(org, 'organization_name'),
            organization_network: getFormDataField(org, 'organization_network'),
            organization_type: getFormDataField(org, 'organization_type'),
            organization_taxId: getFormDataField(org, 'organization_taxId'),
            organization_website: getFormDataField(org, 'organization_website'),
            organization_address: getFormDataField(org, 'organization_address'),
            contactPerson_name: getFormDataField(contact, 'contactPerson_name'),
            contactPerson_email: getFormDataField(contact, 'contactPerson_email'),
            contactPerson_phone: getFormDataField(contact, 'contactPerson_phone'),
            cause_title: getFormDataField(cause, 'cause_title'),
            cause_description: getFormDataField(cause, 'cause_description'),
            cause_mission: getFormDataField(cause, 'cause_mission'),
            title: getFormDataField(settings, 'title'),
            address: getFormDataField(settings, 'address'),
            description: getFormDataField(settings, 'description'),
            donor_name: getFormDataField(settings, 'donor_name'),
            targetAmount: getFormDataField(settings, 'targetAmount') ? Number(getFormDataField(settings, 'targetAmount')) : 0,
            startDate: getFormDataField(settings, 'startDate'),
            endDate: getFormDataField(settings, 'endDate'),
            dafPartner: getFormDataField(routing, 'dafPartner'),
            internalTrackingId: getFormDataField(routing, 'internalTrackingId'),
          };

          console.log("Final campaign data:", campaignData);

          const formDataToSend = new FormData();
          formDataToSend.append("data", JSON.stringify(campaignData));

          const causeImage = getFormDataField(cause, 'image');
          if (causeImage instanceof File) {
            formDataToSend.append("image", causeImage);
          }

          // Use async/await to handle the promise
          const response = await createCampaign(formDataToSend).unwrap();
          console.log("Campaign created successfully:", response);
          toast.success(response.message || "Campaign created successfully!");
          router.push("/campaigns");
        }
      } catch (error) {
        console.error("Error in form submission:", error);
        toast.error("Failed to create campaign. Please try again.");
      }
    },
    onBack: onBack || (() => {
      if (currentStep > 1) {
        onStepChange(currentStep - 1);
      }
    }),
    initialData: formData[currentForm.id],
    isLoading: currentStep === steps.length && isLoading,
  } as Record<string, unknown>);

  return <div className="flex-1">{formComponent}</div>;
}

export default MultiForm;