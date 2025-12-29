import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useCreateContentMutation, useGetContentQuery } from '../../../features/settings/settingsApi';
import { RTKError } from '../../../utils/type';
import { Switch } from '../../ui/switch';

const SystemNotifications = () => {
  const { data, isLoading: isLoadingContent } = useGetContentQuery({});
  const [createWebsite] = useCreateContentMutation();

  // State for notification toggles
  const [notificationToggles, setNotificationToggles] = useState({
    campaignExpiredAlert: true,
    lowProgressWarning: false,
  });

  // Individual loading states
  const [loadingStates, setLoadingStates] = useState({
    campaignExpiredAlert: false,
    lowProgressWarning: false,
  });

  // Load data from API when component mounts or data changes
  useEffect(() => {
    if (data?.data?.notificationStrategy) {
      const notificationStrategy = data.data.notificationStrategy;
      setNotificationToggles({
        campaignExpiredAlert: notificationStrategy.campaignExpiredAlert,
        lowProgressWarning: notificationStrategy.lowProgressWarning,
      });
    }
  }, [data]);

  // Handle toggle change with API call
  const handleToggleChange = async (key: keyof typeof notificationToggles, checked: boolean) => {
    // Set individual loading state
    setLoadingStates(prev => ({
      ...prev,
      [key]: true
    }));

    // First update local state
    const updatedToggles = {
      ...notificationToggles,
      [key]: checked
    };

    setNotificationToggles(updatedToggles);

    // Prepare data for API - Only send the notification strategy part
    const dataToSave = {
      notificationStrategy: {
        // Keep existing notificationStrategy data if available
        ...(data?.data?.notificationStrategy || {}),
        // Update only the fields we're changing
        campaignExpiredAlert: updatedToggles.campaignExpiredAlert,
        lowProgressWarning: updatedToggles.lowProgressWarning,
      }
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(dataToSave));

    try {
      const response = await createWebsite(formData).unwrap();
      toast.success(response.message || 'Notification settings updated');
    } catch (error: unknown) {
      // Revert on error
      setNotificationToggles(prev => ({
        ...prev,
        [key]: !checked
      }));

      const err = error as RTKError;
      toast.error(err?.data?.message || 'Error saving notification settings');
    } finally {
      // Clear individual loading state
      setLoadingStates(prev => ({
        ...prev,
        [key]: false
      }));
    }
  };

  // Show loading state while fetching data
  if (isLoadingContent) {
    return (
      <div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">System Notifications</h3>
          <div className="animate-pulse space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-6 w-12 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-gray-200 h-[1px]"></div>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-6 w-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">System Notifications</h3>

        <div className="space-y-6">
          {/* Campaign Expired Alert */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Campaign Expired Alert</h4>
              <p className="text-sm text-gray-600 mt-1">Notify when a campaign reaches its end date.</p>
            </div>
            <div>
              <Switch
                checked={notificationToggles.campaignExpiredAlert}
                onCheckedChange={(checked) => handleToggleChange('campaignExpiredAlert', checked)}
                disabled={loadingStates.campaignExpiredAlert}
              />
            </div>
          </div>

          <div className='bg-gray-200 h-[1px]'></div>

          {/* Low Progress Warning */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Low Progress Warning</h4>
              <p className="text-sm text-gray-600 mt-1">Alert when campaign is below 25% with 1 week left.</p>
            </div>
            <div>
              <Switch
                checked={notificationToggles.lowProgressWarning}
                onCheckedChange={(checked) => handleToggleChange('lowProgressWarning', checked)}
                disabled={loadingStates.lowProgressWarning}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemNotifications;