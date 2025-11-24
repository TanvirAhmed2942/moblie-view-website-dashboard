"use client";

import React, { useState } from "react";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  inApp: boolean;
}

function SystemNotifications() {
  const initialSettings: NotificationSetting[] = [
    {
      id: "campaign-expired",
      title: "Campaign expired Alert",
      description: "Notify when a campaign reaches it's end date.",
      email: true,
      inApp: false,
    },
    {
      id: "low-progress",
      title: "Low Progress Warning",
      description: "Alert when campaign is below 25% with 1 week left.",
      email: true,
      inApp: true,
    },
    {
      id: "new-donor",
      title: "New Donor Activity",
      description: "Notify on new donations.",
      email: false,
      inApp: true,
    },
  ];

  const [settings, setSettings] =
    useState<NotificationSetting[]>(initialSettings);

  const toggleNotification = (id: string, type: "email" | "inApp") => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === id ? { ...setting, [type]: !setting[type] } : setting
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-900">
          System Notifications
        </h2>
        <p className="text-gray-600">
          Configure internal and external notifications for important system
          events.
        </p>
      </div>

      {/* Notification Settings */}
      <div className="bg-white border rounded-lg divide-y">
        {settings.map((setting, index) => (
          <div
            key={setting.id}
            className={`p-6 ${index === settings.length - 1 ? "" : ""}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {setting.title}
                </h3>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>

              {/* Toggle Switches */}
              <div className="flex items-center gap-6 ml-6">
                {/* Email Toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">Email</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={setting.email}
                    onClick={() => toggleNotification(setting.id, "email")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${
                      setting.email ? "bg-purple-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        setting.email ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* In-App Toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">In-App</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={setting.inApp}
                    onClick={() => toggleNotification(setting.id, "inApp")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 ${
                      setting.inApp ? "bg-purple-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        setting.inApp ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SystemNotifications;
