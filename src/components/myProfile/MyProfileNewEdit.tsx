"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export interface ProfileField {
  id: string;
  label: string;
  type: "text" | "email" | "textarea" | "select" | "file" | "password";
  value: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, string>) => void;
  title: string;
  fields: ProfileField[];
  showAvatar?: boolean;
  avatarSrc?: string;
  avatarFallback?: string;
  singleColumn?: boolean;
}

function ProfileEditModal({
  isOpen,
  onClose,
  onSave,
  title,
  fields,
  showAvatar = false,
  avatarSrc,
  avatarFallback = "U",
  singleColumn = false,
}: ProfileEditModalProps) {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initialData: Record<string, string> = {};
    fields.forEach((field) => {
      initialData[field.id] = field.value;
    });
    return initialData;
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    // Reset form data to initial values
    const resetData: Record<string, string> = {};
    fields.forEach((field) => {
      resetData[field.id] = field.value;
    });
    setFormData(resetData);
    setAvatarPreview(null);
    onClose();
  };

  const renderField = (field: ProfileField) => {
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="bg-white border-gray-300"
          />
        );
      case "select":
        return (
          <Select
            value={formData[field.id] || ""}
            onValueChange={(value) => handleInputChange(field.id, value)}
          >
            <SelectTrigger className="bg-white border-gray-300 w-full">
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "file":
        return (
          <div className="space-y-2">
            <Input
              id={field.id}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-white border-gray-300"
            />
            {avatarPreview && (
              <div className="mt-2">
                <Avatar className="size-20">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        );
      default:
        return (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className="bg-white border-gray-300"
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Avatar Section */}
          {showAvatar && (
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <Avatar className="size-20">
                <AvatarImage src={avatarPreview || avatarSrc} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Profile Photo</h3>
                <p className="text-sm text-gray-500">Upload a new photo</p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 w-auto"
                />
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div
            className={`grid gap-4 ${
              singleColumn ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4 w-full">
            <Button
              onClick={handleCancel}
              className=" border border-purple-500 text-gray-900 bg-white hover:bg-purple-600 hover:text-white w-full cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white w-full cursor-pointer"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileEditModal;
