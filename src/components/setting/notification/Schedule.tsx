import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useGetCampaignQuery } from '../../../features/campaign/campaignApi';
import { useCreateContentMutation, useGetContentQuery } from '../../../features/settings/settingsApi';
import { Button } from '../../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';

// Define types based on your API response
interface Campaign {
  _id: string;
  title: string;
  organization_name: string;
  [key: string]: unknown;
}

interface CampaignApiResponse {
  data: {
    result: Campaign[];
  };
}

interface ProgressAlertSchedule {
  frequency: string;
  day: string;
  time: string;
}

interface NotificationStrategy {
  progressAlertSchedule: ProgressAlertSchedule;
  campaignExpiredAlert: boolean;
  lowProgressWarning: boolean;
  mileStoneAlert: boolean;
  mileStoneAlertMessage: string;
  progressAlert: boolean;
  progressAlertMessage: string;
  campaignId?: string;
  [key: string]: unknown;
}

interface ContentData {
  notificationStrategy: NotificationStrategy;
  [key: string]: unknown;
}

interface ContentResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: ContentData;
}

interface AutoSendSchedule {
  frequency: string;
  day: string;
  time: string;
  timezone: string;
}

const Schedule = () => {
  // Auto-send state with default values
  const [autoSendEnabled, setAutoSendEnabled] = useState(true);
  const [autoSendSchedule, setAutoSendSchedule] = useState<AutoSendSchedule>({
    frequency: 'weekly',
    day: 'monday',
    time: '10:00',
    timezone: 'UTC'
  });

  // State for selected campaign and organization
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const { data: campaignsData } = useGetCampaignQuery({}) as { data: CampaignApiResponse };
  const { data: content, isLoading: isLoadingContent, refetch } = useGetContentQuery({}) as {
    data: ContentResponse;
    isLoading: boolean;
    refetch: () => void;
  };
  const campaigns = campaignsData?.data?.result || [];

  const [scheduleCampaign, { isLoading }] = useCreateContentMutation();

  // Recipient management state
  const [recipientManagementEnabled, setRecipientManagementEnabled] = useState(true);

  // Load data from API when component mounts or data changes
  useEffect(() => {
    if (content?.data?.notificationStrategy && campaigns.length > 0) {
      const notificationStrategy = content.data.notificationStrategy;

      // Auto-send schedule load kora
      if (notificationStrategy.progressAlertSchedule) {
        const schedule = notificationStrategy.progressAlertSchedule;
        setAutoSendSchedule(prev => ({
          ...prev,
          frequency: schedule.frequency || 'weekly',
          day: schedule.day || 'monday',
          time: schedule.time || '10:00'
        }));
      }

      // Campaign ID load kora notificationStrategy থেকে
      const campaignIdFromAPI = notificationStrategy.campaignId;

      if (campaignIdFromAPI) {
        const campaign = campaigns.find(camp => camp._id === campaignIdFromAPI);
        if (campaign) {
          setSelectedCampaign(campaign);
        }
      }
    }
  }, [content, campaigns]);

  // Handle auto-send schedule changes
  const handleAutoSendChange = (field: keyof AutoSendSchedule, value: string) => {
    setAutoSendSchedule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle campaign selection
  const handleCampaignSelect = (campaignId: string) => {
    const campaign = campaigns.find(camp => camp._id === campaignId);
    setSelectedCampaign(campaign || null);
  };

  // Handle save
  const handleSave = async () => {
    try {
      const existingData = content?.data || {} as ContentData;

      const dataToSave = {
        ...existingData,
        notificationStrategy: {
          ...existingData.notificationStrategy,
          progressAlertSchedule: {
            frequency: autoSendSchedule.frequency,
            day: autoSendSchedule.day,
            time: autoSendSchedule.time
          },
          campaignId: selectedCampaign?._id || ''
        }
      };

      const formData = new FormData();
      formData.append('data', JSON.stringify(dataToSave));

      const result = await scheduleCampaign(formData).unwrap();
      refetch();
      toast.success(result.message || 'Schedule settings saved successfully!');
    } catch (error: unknown) {
      console.error('Failed to save:', error);
      toast.error('Failed to save schedule settings');
    }
  };

  // Reset organization when campaign is changed
  const handleCampaignChange = (campaignId: string) => {
    handleCampaignSelect(campaignId);
  };

  // Show loading state while fetching content data
  if (isLoadingContent) {
    return (
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <Button disabled className="bg-gray-300 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
          disabled={isLoading}
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Auto-Send Schedule */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900">Auto-Send Schedule</h3>
            <Switch
              checked={autoSendEnabled}
              onCheckedChange={setAutoSendEnabled}
            />
          </div>
          <p className="text-sm text-gray-600 mb-6">Define when to automatically send updates.</p>

          {autoSendEnabled && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Progress Updates</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Select
                    value={autoSendSchedule.frequency}
                    onValueChange={(value) => handleAutoSendChange('frequency', value)}
                  >
                    <SelectTrigger className="bg-purple-50 border-0 w-full">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>

                  {(autoSendSchedule.frequency === 'weekly' || autoSendSchedule.frequency === 'monthly') && (
                    <Select
                      value={autoSendSchedule.day}
                      onValueChange={(value) => handleAutoSendChange('day', value)}
                    >
                      <SelectTrigger className="bg-purple-50 border-0 w-full">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={autoSendSchedule.time}
                      onChange={(e) => handleAutoSendChange('time', e.target.value)}
                      className="w-full px-3 py-2 bg-purple-50 border-0 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <Select
                      value={autoSendSchedule.timezone}
                      onValueChange={(value) => handleAutoSendChange('timezone', value)}
                    >
                      <SelectTrigger className="bg-purple-50 border-0 w-full">
                        <SelectValue placeholder="Timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">EST</SelectItem>
                        <SelectItem value="PST">PST</SelectItem>
                        <SelectItem value="CST">CST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recipient Management */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-900">Recipient Management</h3>
            <Switch
              checked={recipientManagementEnabled}
              onCheckedChange={setRecipientManagementEnabled}
            />
          </div>
          <p className="text-sm text-gray-600 mb-6">Define target audiences for updates.</p>

          {recipientManagementEnabled && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select the Campaign Name</label>
                <Select
                  value={selectedCampaign?._id || ''}
                  onValueChange={handleCampaignChange}
                >
                  <SelectTrigger className="w-full bg-purple-50 border-0">
                    <SelectValue placeholder="Select campaign">
                      {selectedCampaign ? selectedCampaign.title : "Select campaign"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign._id} value={campaign._id}>
                        {campaign.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                <div className="w-full px-3 py-2 bg-gray-50 border-0 rounded-lg text-sm text-gray-900 min-h-[42px] flex items-center">
                  {selectedCampaign?.organization_name || 'Select a campaign to see organization'}
                </div>
                <p className="text-xs text-gray-500 mt-1">Organization is automatically selected based on campaign</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;