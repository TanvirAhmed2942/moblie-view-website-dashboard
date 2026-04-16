"use client"
import Policy from "@/components/policies/Policy";
import { useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } from "@/features/document/documentApi";
import React from "react";
import { toast } from "react-hot-toast";

function Page() {
  const { data, isLoading } = useGetPrivacyPolicyQuery(undefined);
  const [updatePrivacyPolicy, { isLoading: isUpdating }] = useUpdatePrivacyPolicyMutation();

  const handleSave = async (content: string) => {
    try {
      const response = await updatePrivacyPolicy({
        type: "privacy_policy",
        title: "Privacy Policy",
        content,
      }).unwrap();
      
      if (response.success) {
        toast.success(response.message || "Privacy Policy updated successfully");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to update Privacy Policy");
    }
  };

  const initialContent = data?.data?.[0]?.content || "";

  return (
    <>
      <Policy
        policyType="privacy"
        initialContent={initialContent}
        isLoading={isLoading}
        onSave={handleSave}
        isSaving={isUpdating}
      />
    </>
  );
}

export default Page;
