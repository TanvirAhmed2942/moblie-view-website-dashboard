"use client";

import { ReactElement } from "react";

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
}: MultiFormProps) {
  const currentForm = steps[currentStep - 1];

  if (!currentForm) {
    return <div>Form not found</div>;
  }

  return <div className="flex-1">{currentForm.component}</div>;
}

export default MultiForm;