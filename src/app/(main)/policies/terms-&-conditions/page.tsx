"use client"
import Policy from "@/components/policies/Policy";
import { useGetTermsAndConditionsQuery, useUpdateTermsAndConditionMutation } from "@/features/document/documentApi";
import React from "react";
import { toast } from "react-hot-toast";

function Page() {
  const { data, isLoading } = useGetTermsAndConditionsQuery(undefined);
  const [updateTermsAndConditions, { isLoading: isUpdating }] = useUpdateTermsAndConditionMutation();

  const handleSave = async (content: string) => {
    try {
      const response = await updateTermsAndConditions({
        type: "terms_condition",
        title: "Terms and Conditions",
        content,
      }).unwrap();
      
      if (response.success) {
        toast.success(response.message || "Terms and Conditions updated successfully");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update Terms and Conditions");
    }
  };

  const initialContent = data?.data?.content || "";

  return (
    <>
      <Policy
        policyType="terms"
        initialContent={initialContent}
        isLoading={isLoading}
        onSave={handleSave}
        isSaving={isUpdating}
      />
    </>
  );
}

export default Page;
