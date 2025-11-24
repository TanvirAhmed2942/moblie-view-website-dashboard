"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { useGetAdminByAuthIdQuery } from "@/redux/Apis/authApi";
import getAuthIdFromToken from "@/utils/jwtDecode";

function ProfilePhotoSection() {
  const authId = getAuthIdFromToken();
  const { data: adminResponse } = useGetAdminByAuthIdQuery(authId, {
    skip: !authId, // Skip the query if authId is null
  });
  const admin = adminResponse?.data;

  return (
    <div className="w-full flex flex-col  items-center justify-center gap-4">
      <Avatar className="size-40">
        <AvatarImage src={admin?.profile} alt={admin?.name} />
        <AvatarFallback>
          {admin?.name
            ? admin.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
            : "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2 text-center ">
        <p className="text-2xl font-bold">{admin?.name || "User"}</p>
        <p className="text-sm text-gray-500">
          {admin?.email || "user@example.com"}
        </p>
        <div className="flex items-center justify-center mt-2 ">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
            {admin?.role || "user"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProfilePhotoSection;
