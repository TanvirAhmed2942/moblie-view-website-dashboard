"use client";
import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

import provideIcon from "@/utils/provideIcon";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ProfileEditModal, { ProfileField } from "./MyProfileNewEdit";

function MyProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalFields, setModalFields] = useState<ProfileField[]>([]);
  const [showAvatar, setShowAvatar] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState("https://github.com/shadcn.png");
  const [avatarFallback, setAvatarFallback] = useState("JC");
  const [singleColumn, setSingleColumn] = useState(false);

  const handleEditClick = (
    title: string,
    fields: ProfileField[],
    showAvatarSection = false,
    currentAvatarSrc = "",
    currentAvatarFallback = "U",
    useSingleColumn = false
  ) => {
    setModalTitle(title);
    setModalFields(fields);
    setShowAvatar(showAvatarSection);
    setAvatarSrc(currentAvatarSrc);
    setAvatarFallback(currentAvatarFallback);
    setSingleColumn(useSingleColumn);
    setIsModalOpen(true);
  };

  const handleSave = (data: Record<string, string>) => {
    console.log("Saving profile data:", data);
    // Here you would typically make an API call to save the data
    // For now, we'll just log it
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="border-0 shadow-none rounded-2xl">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfilePhotoSectionNew onEditClick={handleEditClick} />
          <PersonalInformationSectionNew onEditClick={handleEditClick} />
          {/* <AddressSection onEditClick={handleEditClick} /> */}
          <ChanhePasswordSection onEditClick={handleEditClick} />
        </CardContent>
      </Card>

      <ProfileEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        title={modalTitle}
        fields={modalFields}
        showAvatar={showAvatar}
        avatarSrc={avatarSrc}
        avatarFallback={avatarFallback}
        singleColumn={singleColumn}
      />
    </>
  );
}

export default MyProfile;

const ProfilePhotoSectionNew = ({
  onEditClick,
}: {
  onEditClick: (
    title: string,
    fields: ProfileField[],
    showAvatar?: boolean,
    avatarSrc?: string,
    avatarFallback?: string,
    useSingleColumn?: boolean
  ) => void;
}) => {
  const handleEdit = () => {
    const fields: ProfileField[] = [];

    onEditClick(
      "Edit Profile Photo",
      fields,
      true,
      "https://github.com/shadcn.png",
      "JC"
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Photo</CardTitle>
        <CardAction>
          <span
            className="text-sm text-gray-500 flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1 cursor-pointer hover:bg-gray-50"
            onClick={handleEdit}
          >
            Edit {provideIcon({ name: "edit" })}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar className="size-30">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-bold">Jane Cooper</h1>
            <p className="text-sm text-gray-500">Admin</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PersonalInformationSectionNew = ({
  onEditClick,
}: {
  onEditClick: (
    title: string,
    fields: ProfileField[],
    showAvatar?: boolean,
    avatarSrc?: string,
    avatarFallback?: string,
    useSingleColumn?: boolean
  ) => void;
}) => {
  const handleEdit = () => {
    const fields: ProfileField[] = [
      {
        id: "fullName",
        label: "Full Name",
        type: "text",
        value: "Jane Cooper",
        placeholder: "Enter your full name",
        required: true,
      },
      {
        id: "email",
        label: "Email Address",
        type: "email",
        value: "janecooper@gmail.com",
        placeholder: "Enter your email address",
        required: true,
      },
    ];

    onEditClick("Edit Personal Information", fields);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardAction>
          <span
            className="text-sm text-gray-500 flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1 cursor-pointer hover:bg-gray-50"
            onClick={handleEdit}
          >
            Edit {provideIcon({ name: "edit" })}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="border-0 border-gray-200 rounded-lg p-4 bg-[#f7f1fb]">
            <h1 className="text-lg font-bold">Jane Cooper</h1>
          </div>
          <div className="border-0 border-gray-200 rounded-lg p-4 bg-[#f7f1fb]">
            <h1 className="text-lg font-bold">janecooper@gmail.com</h1>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// const AddressSection = ({
//   onEditClick,
// }: {
//   onEditClick: (
//     title: string,
//     fields: ProfileField[],
//     showAvatar?: boolean,
//     avatarSrc?: string,
//     avatarFallback?: string,
//     useSingleColumn?: boolean
//   ) => void;
// }) => {
//   const handleEdit = () => {
//     const fields: ProfileField[] = [
//       {
//         id: "country",
//         label: "Country",
//         type: "select",
//         value: "United Kingdom",
//         placeholder: "Select country",
//         options: [
//           { value: "United Kingdom", label: "United Kingdom" },
//           { value: "United States", label: "United States" },
//           { value: "Canada", label: "Canada" },
//           { value: "Australia", label: "Australia" },
//         ],
//         required: true,
//       },
//       {
//         id: "address",
//         label: "Address",
//         type: "textarea",
//         value: "3891 Ranchview Dr. Richardson, California 62639",
//         placeholder: "Enter your full address",
//         required: true,
//       },
//       {
//         id: "postalCode",
//         label: "Postal Code",
//         type: "text",
//         value: "ERT 0259",
//         placeholder: "Enter postal code",
//         required: true,
//       },
//       {
//         id: "taxId",
//         label: "Tax ID",
//         type: "text",
//         value: "AS5898609",
//         placeholder: "Enter tax ID",
//         required: true,
//       },
//     ];

//     onEditClick("Edit Address Information", fields);
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Address</CardTitle>
//         <CardAction>
//           <span
//             className="text-sm text-gray-500 flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1 cursor-pointer hover:bg-gray-50"
//             onClick={handleEdit}
//           >
//             Edit {provideIcon({ name: "edit" })}
//           </span>
//         </CardAction>
//       </CardHeader>
//       <CardContent className="flex flex-col gap-4">
//         <div className="grid grid-cols-2 gap-4">
//           <div className="border-0 border-gray-200 rounded-lg p-4 bg-[#f7f1fb]">
//             <h1 className="text-lg font-bold">United Kingdom</h1>
//           </div>
//           <div className="border-0 border-gray-200 rounded-lg p-4 bg-[#f7f1fb]">
//             <h1 className="text-lg font-bold">
//               3891 Ranchview Dr. Richardson, California 62639
//             </h1>
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <div className="border-0 border-gray-200 rounded-lg p-4 bg-[#f7f1fb]">
//             <h1 className="text-lg font-bold">ERT 0259</h1>
//           </div>
//           <div className="border-0 border-gray-200 rounded-lg p-4 bg-[#f7f1fb]">
//             <h1 className="text-lg font-bold">Tax ID: AS5898609</h1>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

const ChanhePasswordSection = ({
  onEditClick,
}: {
  onEditClick: (
    title: string,
    fields: ProfileField[],
    showAvatar?: boolean,
    avatarSrc?: string,
    avatarFallback?: string,
    useSingleColumn?: boolean
  ) => void;
}) => {
  const handleEdit = () => {
    const fields: ProfileField[] = [
      {
        id: "currentPassword",
        label: "Current Password",
        type: "password",
        value: "",
        placeholder: "Enter current password",
        required: true,
      },
      {
        id: "newPassword",
        label: "New Password",
        type: "password",
        value: "",
        placeholder: "Enter new password",
        required: true,
      },
      {
        id: "confirmPassword",
        label: "Confirm New Password",
        type: "password",
        value: "",
        placeholder: "Confirm new password",
        required: true,
      },
    ];

    onEditClick("Change Password", fields, false, "", "", true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardAction>
          <span
            className="text-sm text-gray-500 flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1 cursor-pointer hover:bg-gray-50"
            onClick={handleEdit}
          >
            Edit {provideIcon({ name: "edit" })}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="border-0 border-gray-200 rounded-lg p-4 bg-[#f7f1fb]">
          <h1 className="text-lg font-bold">Last Changed 7days ago</h1>
        </div>
      </CardContent>
    </Card>
  );
};
