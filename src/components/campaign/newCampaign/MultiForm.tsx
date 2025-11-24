"use client";

import React, { ReactElement } from "react";

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
  const currentForm = steps[currentStep - 1];

  if (!currentForm) {
    return <div>Form not found</div>;
  }

  // Clone the component and inject props
  const formComponent = React.cloneElement(currentForm.component, {
    onNext: (data: unknown) => {
      onFormDataChange(currentForm.id, data);
      if (currentStep < steps.length) {
        onStepChange(currentStep + 1);
      }
    },
    onBack: onBack || (() => {}),
    initialData: formData[currentForm.id],
  } as Record<string, unknown>);

  return <div className="flex-1">{formComponent}</div>;
}

export default MultiForm;
