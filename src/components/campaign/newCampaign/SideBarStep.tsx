"use client";

import React from "react";
import { Check } from "lucide-react";

interface Step {
  id: string;
  title: string;
  stepNumber: number;
}

interface SideBarStepProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepNumber: number) => void;
}

function SideBarStep({ steps, currentStep, onStepClick }: SideBarStepProps) {
  return (
    <div className="w-64 space-y-4">
      {steps.map((step, index) => {
        const isActive = step.stepNumber === currentStep;
        const isCompleted = step.stepNumber < currentStep;
        const isClickable = onStepClick && (isCompleted || isActive);

        return (
          <div key={step.id} className="relative">
            {/* Step Circle and Line */}
            <div className="flex items-start gap-4">
              {/* Circle */}
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  isActive
                    ? "bg-purple-600 border-purple-600"
                    : isCompleted
                    ? "bg-purple-600 border-purple-600"
                    : "bg-white border-purple-300"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span
                    className={`text-sm font-semibold ${
                      isActive ? "text-white" : "text-purple-600"
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                )}
              </div>

              {/* Step Info */}
              <div
                className={`flex-1 pt-1 ${
                  isClickable ? "cursor-pointer" : "cursor-default"
                }`}
                onClick={() => isClickable && onStepClick?.(step.stepNumber)}
              >
                <h3
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-purple-700"
                      : isCompleted
                      ? "text-purple-600"
                      : "text-purple-400"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Step {step.stepNumber}
                </p>
              </div>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-5 top-10 w-0.5 h-8 bg-purple-200" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default SideBarStep;
