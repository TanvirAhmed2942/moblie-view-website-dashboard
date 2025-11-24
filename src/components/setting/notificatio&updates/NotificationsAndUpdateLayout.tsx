import React from "react";
import SendingConfigureation from "./SendingConfigureation";
import SystemNotifications from "./SystemNotifications";
import AutoScheduleAndManagement from "./AutoScheduleAndManagement";

function NotificationsAndUpdateLayout() {
  return (
    <div className="space-y-6">
      <SendingConfigureation />
      <AutoScheduleAndManagement />
      <SystemNotifications />
    </div>
  );
}

export default NotificationsAndUpdateLayout;
