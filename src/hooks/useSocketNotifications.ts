"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSocket } from "@/contexts/SocketContext";
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
} from "@/redux/slices/notificationSlice";

import {
  useReadSingleNotificationMutation,
  useReadAllNotificationsMutation,
} from "@/redux/Apis/notificationApi";

export const useSocketNotifications = () => {
  const dispatch = useAppDispatch();
  const { socket, isConnected } = useSocket();
  const { notifications, unreadCount } = useAppSelector(
    (state) => state.notifications
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // API mutations for read operations
  const [readSingleNotification] = useReadSingleNotificationMutation();
  const [readAllNotifications] = useReadAllNotificationsMutation();

  // Note: Removed duplicate notification handling from this hook
  // Socket context is already handling incoming notifications
  // This hook only provides read operations and state access

  // Use API calls for read operations
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      // Find the notification to get the real MongoDB _id
      const notification = notifications.find((n) => n.id === notificationId);
      const realId = notification?._id || notificationId;

      console.log("Marking notification as read:", { notificationId, realId });

      // Call API to mark notification as read using the real MongoDB _id
      await readSingleNotification({ id: realId }).unwrap();
      // Update local state after successful API call
      dispatch(markAsRead(notificationId));
    } catch (error) {
      //   console.error("Failed to mark notification as read:", error);
      // Still update local state for better UX even if API fails
      dispatch(markAsRead(notificationId));
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      // Call API to mark all notifications as read
      await readAllNotifications({}).unwrap();
      // Update local state after successful API call
      dispatch(markAllAsRead());
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      // Still update local state for better UX even if API fails
      dispatch(markAllAsRead());
    }
  };

  const removeNotificationById = (notificationId: string) => {
    if (socket && isConnected) {
      socket.emit("remove_notification", { notificationId });
      dispatch(removeNotification(notificationId));
    }
  };

  const requestNotificationHistory = () => {
    if (socket && isConnected) {
      socket.emit("get_notification_history");
    }
  };

  // Request notification history when connected
  useEffect(() => {
    if (isConnected && isAuthenticated) {
      requestNotificationHistory();
    }
  }, [isConnected, isAuthenticated]);

  return {
    notifications,
    unreadCount,
    isConnected,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotificationById,
    requestNotificationHistory,
  };
};
