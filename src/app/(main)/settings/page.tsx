'use client';

import { useState } from 'react';
import AboutCauseContent from '../../../components/setting/contentManagement/AboutCauseContent';
import AboutUsContent from '../../../components/setting/contentManagement/AboutUsContent';
import DownlineContent from '../../../components/setting/contentManagement/DownlineContent';
import PrivacyPolicyContent from '../../../components/setting/contentManagement/PrivacyPolicyContent';
import WebsiteSettings from '../../../components/setting/contentManagement/WebsiteSettings';
import Schedule from '../../../components/setting/notification/Schedule';
import SystemNotifications from '../../../components/setting/notification/SystemNotifications';
import UpdateSendingConfiguration from '../../../components/setting/notification/UpdateSendingConfiguration';


const Settings = () => {
  const [activeTab, setActiveTab] = useState('content');



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage and configure the system, content and campaigns</p>
          </div>
          <button className="px-6 py-2 bg-purple-100 cursor-pointer text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
            Save all changes
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-4 px-1 font-medium transition-colors relative ${activeTab === 'content'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Content Management
              {activeTab === 'content' && (
                <div className="absolute bottom-0 cursor-pointer left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`pb-4 px-1 font-medium transition-colors relative ${activeTab === 'notifications'
                ? 'text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Notifications & Updates
              {activeTab === 'notifications' && (
                <div className="absolute bottom-0 left-0 cursor-pointer right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          </div>
        </div>

        {/* Content Management Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Website Settings */}

            <WebsiteSettings />

            {/* About Us Content */}
            <AboutUsContent />

            {/* About the Cause Content */}
            <AboutCauseContent />
            {/* Downline Content */}
            <DownlineContent />
            {/* Privacy Policy Content - UPDATED VERSION */}
            <PrivacyPolicyContent />
          </div>
        )}

        {/* Notifications & Updates Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Update Sending Configuration */}
            <UpdateSendingConfiguration />

            {/* Auto-Send Schedule and Recipient Management */}
            <Schedule />

            {/* System Notifications */}
            <SystemNotifications />


          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;