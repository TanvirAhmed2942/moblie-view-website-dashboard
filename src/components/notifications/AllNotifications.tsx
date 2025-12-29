"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { HiOutlineBell } from "react-icons/hi";
import { TbBellRinging2 } from "react-icons/tb";

// Define the notification type
interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

function AllNotifications() {
  const { isConnected } = useAppSelector((state) => state.notifications);

  // Mock notifications data - in real app, this would come from Redux or API
  const notifications: Notification[] = [
    {
      id: "1",
      title: "System Update",
      message: "Your system has been updated to the latest version.",
      time: "2 hours ago",
      read: false
    },
    {
      id: "2",
      title: "New Message",
      message: "You have received a new message from John Doe.",
      time: "1 day ago",
      read: true
    }
  ];

  const handleMarkAsRead = (id: string) => {
    // Implement mark as read functionality
    console.log(`Mark notification ${id} as read`);
    // In real app: dispatch markAsRead action
  };

  return (
    <Card className="bg-transparent min-h-[calc(100vh-11.5rem)] border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TbBellRinging2 size={20} />
          All Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {!isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800 flex items-center gap-2">
              <span>⚠️</span>
              Connection lost. Notifications may not be up to date.
            </p>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <HiOutlineBell size={48} className="mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
            <p className="text-sm mt-1">Notifications will appear here</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex flex-col md:flex-row md:items-center justify-between gap-2 border bg-white p-4 rounded-lg transition-all duration-200 hover:shadow-sm ${!notification.read
                  ? "border-l-4 border-l-blue-500 bg-blue-50/50"
                  : "border-gray-200"
                }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className={`p-2 rounded-full ${!notification.read ? "bg-blue-100" : "bg-gray-100"}`}>
                  <HiOutlineBell
                    size={18}
                    className={!notification.read ? "text-blue-600" : "text-gray-400"}
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{notification.title}</p>
                    {!notification.read && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                </div>
              </div>

              {!notification.read && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-gray-50 mt-2 md:mt-0"
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  Mark as read
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default AllNotifications;