"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardAction,
  CardTitle,
} from "../ui/card";
import { FiEdit3 } from "react-icons/fi";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import TipTapEditor from "../../TipTapEditor/TipTapEditor";

interface PolicyProps {
  policyType: "terms" | "privacy" | "cookies" | "refund" | "shipping";
  title?: string;
  initialContent?: string;
  isLoading?: boolean;
  onSave?: (content: string) => void;
  isSaving?: boolean;
}

function Policy({
  policyType,
  title,
  initialContent = "",
  isLoading = false,
  onSave,
  isSaving = false,
}: PolicyProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [policyContent, setPolicyContent] = useState(initialContent);

  React.useEffect(() => {
    if (initialContent) {
      setPolicyContent(initialContent);
    }
  }, [initialContent]);

  const handleEditClick = () => {
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(policyContent);
      setIsDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setPolicyContent(initialContent);
    setIsDialogOpen(false);
  };

  const handleContentChange = (content: string) => {
    setPolicyContent(content);
  };

  // Get policy-specific titles and descriptions
  const getPolicyInfo = () => {
    const policyInfo = {
      terms: {
        title: "Terms and Conditions",
        editTitle: "Edit Terms and Conditions",
        description:
          "Update the terms and conditions content using the rich text editor below.",
      },
      privacy: {
        title: "Privacy Policy",
        editTitle: "Edit Privacy Policy",
        description:
          "Update the privacy policy content using the rich text editor below.",
      },
      cookies: {
        title: "Cookie Policy",
        editTitle: "Edit Cookie Policy",
        description:
          "Update the cookie policy content using the rich text editor below.",
      },
      refund: {
        title: "Refund Policy",
        editTitle: "Edit Refund Policy",
        description:
          "Update the refund policy content using the rich text editor below.",
      },
      shipping: {
        title: "Shipping Policy",
        editTitle: "Edit Shipping Policy",
        description:
          "Update the shipping policy content using the rich text editor below.",
      },
    };

    return policyInfo[policyType];
  };

  const policyInfo = getPolicyInfo();
  const displayTitle = title || policyInfo.title;

  return (
    <>
      <Card className="px-4">
        <CardHeader className="text-2xl font-bold">
          <CardTitle>{displayTitle}</CardTitle>
          <CardAction>
            <Button variant="outline" onClick={handleEditClick} disabled={isLoading}>
              <FiEdit3 size={15} />
            </Button>
          </CardAction>
        </CardHeader>

        <Separator />

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div
              className="text-gray-500 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: initialContent }}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-2xl lg:w-[80vw] xl:max-w-6xl max-w-6xl h-[95vh] sm:h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg sm:text-xl">
              {policyInfo.editTitle}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {policyInfo.description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-white">
            <TipTapEditor
              handleJobDescription={handleContentChange}
              handleMustHaveQualifications={() => { }}
              handlePreferredQualifications={() => { }}
              resetTrigger={false}
              description={policyContent}
              minHeight="400px"
              maxHeight="600px"
            />
          </div>

          <DialogFooter className="pt-4 flex-col sm:flex-row gap-2 sm:gap-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 hover:text-white text-white"
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Policy;
