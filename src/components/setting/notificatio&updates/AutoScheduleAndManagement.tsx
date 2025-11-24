"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AutoScheduleAndManagement() {
  // Auto-Send Schedule state
  const [autoSendEnabled, setAutoSendEnabled] = useState(true);
  const [progressFrequency, setProgressFrequency] = useState("Weekly");
  const [progressDay, setProgressDay] = useState("Friday");
  const [sendOnMilestone, setSendOnMilestone] = useState(true);

  // Recipient Management state
  const [recipientEnabled, setRecipientEnabled] = useState(true);
  const [selectedCampaign, setSelectedCampaign] =
    useState("Project Wellspring");
  const [selectedOrganization, setSelectedOrganization] = useState(
    "Ripple Effect Foundation"
  );

  // Sample data - in a real app, this would come from an API
  const campaigns = [
    "Project Wellspring",
    "Clean Water Initiative",
    "Education for All",
    "Healthcare Access",
  ];

  const organizations = [
    "Ripple Effect Foundation",
    "Global Impact Network",
    "Community Care Alliance",
    "Hope Foundation",
  ];

  const frequencyOptions = ["Daily", "Weekly", "Bi-weekly", "Monthly"];
  const dayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Card: Auto-Send Schedule */}
      <div className="bg-white border rounded-lg p-6 space-y-6">
        {/* Header with Toggle */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Auto-Send Schedule
            </h3>
            <p className="text-sm text-gray-600">
              Define when to automatically send updates.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoSendEnabled}
            onClick={() => setAutoSendEnabled(!autoSendEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${
              autoSendEnabled ? "bg-purple-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoSendEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Progress Updates */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Progress Updates
          </Label>
          <div className="flex items-center gap-3">
            <Select
              value={progressFrequency}
              onValueChange={setProgressFrequency}
              disabled={!autoSendEnabled}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={progressDay}
              onValueChange={setProgressDay}
              disabled={!autoSendEnabled}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dayOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Celebration Messages */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Celebration Messages
          </Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="milestone-checkbox"
              checked={sendOnMilestone}
              onCheckedChange={(checked) =>
                setSendOnMilestone(checked === true)
              }
              disabled={!autoSendEnabled}
            />
            <label
              htmlFor="milestone-checkbox"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Send upon milestone achievement
            </label>
          </div>
        </div>
      </div>

      {/* Right Card: Recipient Management */}
      <div className="bg-white border rounded-lg p-6 space-y-6">
        {/* Header with Toggle */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Recipient Management
            </h3>
            <p className="text-sm text-gray-600">
              Define target audiences for updates.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={recipientEnabled}
            onClick={() => setRecipientEnabled(!recipientEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${
              recipientEnabled ? "bg-purple-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                recipientEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Select Campaign Name */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Select the Campaign Name
          </Label>
          <Select
            value={selectedCampaign}
            onValueChange={setSelectedCampaign}
            disabled={!recipientEnabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign} value={campaign}>
                  {campaign}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select Organization Name */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Select the Organization Name
          </Label>
          <Select
            value={selectedOrganization}
            onValueChange={setSelectedOrganization}
            disabled={!recipientEnabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {organizations.map((org) => (
                <SelectItem key={org} value={org}>
                  {org}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default AutoScheduleAndManagement;
