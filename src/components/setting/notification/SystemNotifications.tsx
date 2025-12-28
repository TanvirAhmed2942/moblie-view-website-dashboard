import { useState } from 'react';
import { Switch } from '../../ui/switch';

interface NotificationChannel {
  email: boolean;
  inApp: boolean;
  slack: boolean;
}

interface LowProgressNotification extends NotificationChannel {
  threshold: number;
  daysBeforeEnd: number;
}

interface NewDonorNotification extends NotificationChannel {
  minAmount: number;
}

interface WeeklySummaryNotification extends NotificationChannel {
  day: string;
}

interface SystemMaintenanceNotification extends NotificationChannel { }

interface MilestoneReachedNotification extends NotificationChannel { }

interface CampaignExpiredNotification extends NotificationChannel { }

interface Notifications {
  campaignExpired: CampaignExpiredNotification;
  lowProgress: LowProgressNotification;
  newDonor: NewDonorNotification;
  milestoneReached: MilestoneReachedNotification;
  weeklySummary: WeeklySummaryNotification;
  systemMaintenance: SystemMaintenanceNotification;
}

type NotificationCategory = keyof Notifications;

const SystemNotifications = () => {
  // State for notifications
  const [notifications, setNotifications] = useState<Notifications>({
    campaignExpired: {
      email: true,
      inApp: true,
      slack: false
    },
    lowProgress: {
      email: true,
      inApp: true,
      slack: false,
      threshold: 25,
      daysBeforeEnd: 7
    },
    newDonor: {
      email: true,
      inApp: true,
      slack: false,
      minAmount: 50
    },
    milestoneReached: {
      email: true,
      inApp: true,
      slack: false
    },
    weeklySummary: {
      email: true,
      inApp: false,
      slack: true,
      day: 'Monday'
    },
    systemMaintenance: {
      email: true,
      inApp: true,
      slack: true
    }
  });

  // Handle notification toggle
  const handleNotificationToggle = (
    category: NotificationCategory,
    channel: 'email' | 'inApp' | 'slack',
    checked: boolean
  ) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: checked
      }
    }));
  };







  return (
    <div>
      <div className="flex justify-between items-center mb-4">



      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">System Notifications</h3>
        <p className="text-sm text-gray-600 mb-6">Configure internal and external notifications for important system events.</p>

        <div className="space-y-6">
          {/* Campaign Expired Alert */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Campaign Expired Alert</h4>
              <p className="text-sm text-gray-600 mt-1">Notify when a campaign reaches its end date.</p>
            </div>
            <div className="flex gap-6">

              <label className="flex items-center gap-2">
                <Switch
                  checked={notifications.campaignExpired.inApp}
                  onCheckedChange={(checked) => handleNotificationToggle('campaignExpired', 'inApp', checked)}
                />
                <span className="text-sm text-gray-700 min-w-[60px]">In-App</span>
              </label>

            </div>
          </div>

        </div>


      </div>
    </div>
  );
};

export default SystemNotifications;