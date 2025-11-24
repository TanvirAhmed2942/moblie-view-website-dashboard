"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FiEdit3 } from "react-icons/fi";

interface EmailTemplate {
  id: string;
  title: string;
  content: string;
  maxLength: number;
}

function SendingConfigureation() {
  const [isEditMode, setIsEditMode] = useState(false);

  const initialTemplates: EmailTemplate[] = [
    {
      id: "weekly-progress",
      title: "Weekly Progress Update",
      content: 'Hi "{donor_name}", type weekly update message here...',
      maxLength: 280,
    },
    {
      id: "milestone-celebration",
      title: "Milestone Celebration",
      content:
        'Congratulations! We\'ve reached the "{milestone_name}" milestone for the "{campaign_name}" campaign!',
      maxLength: 280,
    },
  ];

  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the data
    console.log("Saving email templates:", templates);
    setIsEditMode(false);
    // In a real app, you would save to your backend here
  };

  const handleContentChange = (id: string, newContent: string) => {
    const template = templates.find((t) => t.id === id);
    if (template && newContent.length <= template.maxLength) {
      setTemplates((prevTemplates) =>
        prevTemplates.map((t) =>
          t.id === id ? { ...t, content: newContent } : t
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">
            Update Sending Configuration
          </h2>
          <p className="text-gray-600">
            Create and manage templates for progress updates and celebration
            emails.
          </p>
        </div>
        {isEditMode ? (
          <Button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Save
          </Button>
        ) : (
          <Button variant="outline" onClick={handleEditClick}>
            <FiEdit3 size={15} />
          </Button>
        )}
      </div>

      {/* Content Grid - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((template) => {
          const characterCount = template.content.length;
          const isAtLimit = characterCount >= template.maxLength;

          return (
            <div
              key={template.id}
              className="border rounded-lg p-6 bg-white space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {template.title}
              </h3>
              <div className="relative">
                <Textarea
                  value={template.content}
                  readOnly={!isEditMode}
                  onChange={(e) =>
                    handleContentChange(template.id, e.target.value)
                  }
                  className={`min-h-[200px] resize-none pr-16 ${
                    isEditMode
                      ? "bg-white border-gray-300 text-gray-900"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                  placeholder={`Enter ${template.title.toLowerCase()} message...`}
                />
                <div
                  className={`absolute bottom-3 right-3 text-sm ${
                    isAtLimit ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {characterCount}/{template.maxLength}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SendingConfigureation;
