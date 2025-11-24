"use client";
import React, { useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useUpdateAdminMutation } from "@/redux/Apis/usersApi";
import useToast from "@/hooks/useToast";
import { useGetAdminByAuthIdQuery } from "@/redux/Apis/authApi";
import getAuthIdFromToken from "@/utils/jwtDecode";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  image: FileList | null;
}

function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();
  const toast = useToast();
  const authId = getAuthIdFromToken();

  // Get current admin data to pre-populate the form
  const { data: adminResponse, refetch } = useGetAdminByAuthIdQuery(authId, {
    skip: !authId,
  });
  const admin = adminResponse?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: admin?.name || "",
      image: null,
    },
  });

  const watchedImage = watch("image");

  // Reset form when modal opens with current admin data
  React.useEffect(() => {
    if (isOpen && admin) {
      reset({
        name: admin.name || "",
        image: null,
      });
    }
  }, [isOpen, admin, reset]);

  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        // Create FormData for multipart/form-data request
        const formData = new FormData();

        // Add name field
        formData.append("name", data.name);

        // Add image file if selected
        if (data.image && data.image.length > 0) {
          formData.append("image", data.image[0]); // Note: "Image" with capital I as shown in your API example
        }

        console.log("Submitting profile update:", {
          name: data.name,
          hasImage: !!(data.image && data.image.length > 0),
          imageFileName: data.image?.[0]?.name,
        });

        const result = await updateAdmin(formData).unwrap();

        if (result.success) {
          toast.success("Profile updated successfully!");
          // Refetch admin data to update the UI
          refetch();
          onClose();
        } else {
          toast.error(result.message || "Failed to update profile");
        }
      } catch (error: unknown) {
        console.error("Error updating profile:", error);
        const errorMessage =
          (error as { data?: { message?: string } })?.data?.message ||
          "Failed to update profile. Please try again.";
        toast.error(errorMessage);
      }
    },
    [updateAdmin, toast, refetch, onClose]
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Image Upload Field */}
          <div className="space-y-2">
            <Label htmlFor="image">Profile Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register("image")}
            />
            {watchedImage && watchedImage.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  Selected: {watchedImage[0].name}
                </p>
              </div>
            )}
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-primary hover:bg-primary/90"
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileEditModal;
