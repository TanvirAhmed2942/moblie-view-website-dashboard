"use client";

import SmallPageInfo from "@/components/SmallPageInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentManagementLayout from "@/components/setting/content/ContentManagementLayout";
import NotificationsAndUpdateLayout from "@/components/setting/notificatio&updates/NotificationsAndUpdateLayout";

export default function SettingsPage() {
  return (
    <div className="">
      <SmallPageInfo
        title="Settings"
        description="Manage your account settings and preferences."
      />
      <Tabs defaultValue="content-management">
        <TabsList>
          <TabsTrigger
            value="content-management"
            className="text-gray-900 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
          >
            Content management
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="text-gray-900 data-[state=active]:bg-purple-700 data-[state=active]:text-white"
          >
            Notifications and Updates
          </TabsTrigger>
        </TabsList>
        <TabsContent value="content-management">
          <ContentManagementLayout />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsAndUpdateLayout />
        </TabsContent>
      </Tabs>
    </div>
  );
}
