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

          const campaignData = {
            organization_name: formData.organization?.organization_name,
            organization_network: formData.organization?.organization_network,
            organization_type: formData.organization?.organization_type,
            organization_taxId: formData.organization?.organization_taxId,
            organization_website: formData.organization?.organization_website,
            organization_address: formData.organization?.organization_address,
            contactPerson_name: formData.contact?.contactPerson_name,
            contactPerson_email: formData.contact?.contactPerson_email,
            contactPerson_phone: formData.contact?.contactPerson_phone,
            cause_title: formData.cause?.cause_title,
            cause_description: formData.cause?.cause_description,
            cause_mission: formData.cause?.cause_mission,
            title: formData.settings?.title,
            address: formData.settings?.address,
            description: formData.settings?.description,
            donor_name: formData.settings?.donor_name,
            targetAmount: formData.settings?.targetAmount ? Number(formData.settings.targetAmount) : 0,
            startDate: formData.settings?.startDate,
            endDate: formData.settings?.endDate,
            dafPartner: formData.routing?.dafPartner,
            internalTrackingId: formData.routing?.internalTrackingId,
          };

          console.log("Final campaign data:", campaignData);

          const formDataToSend = new FormData();
          formDataToSend.append("data", JSON.stringify(campaignData));

          if (formData.cause?.image) {
            formDataToSend.append("image", formData.cause.image as File);
          }

          // Use async/await to handle the promise
          const response = await createCampaign(formDataToSend).unwrap();
          console.log("Campaign created successfully:", response);
          toast.success(response.message || "Campaign created successfully!");
          router.push("/campaigns");

          // Show success message or redirect here
          // Example: redirect or show success modal
          // window.location.href = '/campaigns';
          // or showSuccessNotification();

        }
      } catch (error) {
        console.error("Error in form submission:", error);
        // Handle error (show error message to user)
        // Example: showErrorNotification("Failed to create campaign");
      }
    },
    onBack: onBack || (() => {
      if (currentStep > 1) {
        onStepChange(currentStep - 1);
      }
    }),
    initialData: formData[currentForm.id],
    isLoading: currentStep === steps.length && isLoading, // Pass loading state if on last step
  } as Record<string, unknown>);

  return <div className="flex-1">{formComponent}</div>;
}

export default MultiForm;