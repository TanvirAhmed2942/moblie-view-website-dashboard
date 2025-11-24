"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useGetAdminByAuthIdQuery } from "@/redux/Apis/authApi";
import getAuthIdFromToken from "@/utils/jwtDecode";

function PersonalInformationSection() {
  const authId = getAuthIdFromToken();
  const { data: adminResponse } = useGetAdminByAuthIdQuery(authId, {
    skip: !authId, // Skip the query if authId is null
  });
  const admin = adminResponse?.data;

  return (
    <div className="flex flex-col items-center justify-center">
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm my-2">
        <div className="flex flex-col gap-2">
          <span className="font-bold">Member Since</span>
          <span className="text-gray-500">
            {admin?.createdAt
              ? new Date(admin.createdAt).toLocaleDateString()
              : "Not available"}
          </span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-2">
          <span className="font-bold">Last Updated</span>
          <span className="text-gray-500">
            {admin?.updatedAt
              ? new Date(admin.updatedAt).toLocaleDateString()
              : "Not available"}
          </span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-2">
          <span className="font-bold">Verified</span>
          <span
            className={`text-sm font-medium ${
              admin?.verified ? "text-green-600" : "text-red-600"
            }`}
          >
            {admin?.verified ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default PersonalInformationSection;
