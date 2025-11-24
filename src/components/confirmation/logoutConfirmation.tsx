import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface LogoutConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

function LogoutConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: LogoutConfirmationDialogProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="backdrop-blur-md bg-black/50" />
        <DialogPrimitive.Content
          className={cn(
            "bg-white/90 backdrop-blur-md border-0 shadow-xl rounded-3xl p-8 max-w-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "fixed top-[50%] left-[50%] z-50",
            "translate-x-[-50%] translate-y-[-50%]",
            "duration-200"
          )}
        >
          <DialogHeader className="text-center space-y-4">
            <DialogTitle className="text-3xl font-bold text-orange-500">
              Logout!
            </DialogTitle>
            <DialogDescription className="text-base text-gray-900 font-normal">
              Are You Sure To Logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-3 justify-center mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="px-8 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              No
            </Button>
            <Button
              variant="default"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-8 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
            >
              {isLoading ? "Logging out..." : "Yes"}
            </Button>
          </DialogFooter>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
}

export default LogoutConfirmationDialog;
