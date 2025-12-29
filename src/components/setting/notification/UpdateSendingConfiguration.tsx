import { Save } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useCreateContentMutation, useGetContentQuery } from '../../../features/settings/settingsApi';
import { RTKError } from '../../../utils/type';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';

interface Template {
  content: string;
  placeholder: string;
}

interface Templates {
  weeklyProgressUpdate: Template;
  milestoneCelebration: Template;
}

// Interface for API response
interface NotificationStrategy {
  progressAlertMessage: string;
  mileStoneAlertMessage: string;
  [key: string]: string | boolean | number; // Use more specific types instead of 'any'
}

interface ContentData {
  notificationStrategy: NotificationStrategy;
  [key: string]: unknown; // Use 'unknown' instead of 'any' for better type safety
}

interface ApiResponse {
  data: ContentData;
}

const UpdateSendingConfiguration = () => {
  // State for email templates
  const [templates, setTemplates] = useState<Templates>({
    weeklyProgressUpdate: {
      content: '',
      placeholder: "Hi '{donor_name}', type weekly update message here...",
    },
    milestoneCelebration: {
      content: '',
      placeholder: "Congratulations! We've reached the '{milestone_name}' milestone for the '{campaign_name}' campaign!",
    }
  });

  const { data, isLoading: isLoadingContent, refetch } = useGetContentQuery({}) as {
    data: ApiResponse;
    isLoading: boolean;
    refetch: () => void
  };

  const [updateConfiguration, { isLoading }] = useCreateContentMutation();

  // Load data from API when component mounts or data changes
  useEffect(() => {
    if (data?.data?.notificationStrategy) {
      const notificationStrategy = data.data.notificationStrategy;

      setTemplates({
        weeklyProgressUpdate: {
          content: notificationStrategy.progressAlertMessage || '',
          placeholder: "Hi '{donor_name}', type weekly update message here...",
        },
        milestoneCelebration: {
          content: notificationStrategy.mileStoneAlertMessage || '',
          placeholder: "Congratulations! We've reached the '{milestone_name}' milestone for the '{campaign_name}' campaign!",
        }
      });
    }
  }, [data]);

  // Handle template content change
  const handleTemplateChange = (templateId: keyof Templates, value: string) => {
    setTemplates(prev => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        content: value
      }
    }));
  };

  // Handle save
  const handleSave = async () => {
    // Get existing data to preserve other fields
    const existingData = data?.data || {};

    const dataToSave = {
      ...existingData, // Keep all existing data
      notificationStrategy: {
        ...(existingData.notificationStrategy || {}), // Keep existing notificationStrategy data
        progressAlert: true,
        mileStoneAlert: true,
        progressAlertMessage: templates.weeklyProgressUpdate.content,
        mileStoneAlertMessage: templates.milestoneCelebration.content
      }
    };

    console.log('Saving templates:', dataToSave);
    const formData = new FormData();
    formData.append('data', JSON.stringify(dataToSave));

    try {
      const response = await updateConfiguration(formData).unwrap();
      console.log(response);
      refetch();
      toast.success(response.message || 'Email templates saved successfully');
    } catch (error: unknown) {
      const err = error as RTKError;
      toast.error(err?.data?.message || 'Error saving email templates');
    }
  };

  // Show loading state while fetching data
  if (isLoadingContent) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Update Sending Configuration</h2>
            <p className="text-sm text-gray-600">Create and manage templates for progress updates and celebration emails.</p>
          </div>
          <Button disabled className="bg-gray-300 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-6 animate-pulse">
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 mt-1 ml-auto"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 mt-1 ml-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Update Sending Configuration</h2>
            <p className="text-sm text-gray-600">Create and manage templates for progress updates and celebration emails.</p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Weekly Progress Update */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weekly Progress Update
            </label>
            <Textarea
              value={templates.weeklyProgressUpdate.content}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleTemplateChange('weeklyProgressUpdate', e.target.value)
              }
              placeholder={templates.weeklyProgressUpdate.placeholder}
              className="w-full bg-purple-50 border-0 h-32 text-sm focus:ring-2 focus:ring-purple-500"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {templates.weeklyProgressUpdate.content.length}/280
            </div>

          </div>

          {/* Milestone Celebration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Milestone Celebration
            </label>
            <Textarea
              value={templates.milestoneCelebration.content}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleTemplateChange('milestoneCelebration', e.target.value)
              }
              placeholder={templates.milestoneCelebration.placeholder}
              className="w-full bg-purple-50 border-0 h-32 text-sm focus:ring-2 focus:ring-purple-500"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {templates.milestoneCelebration.content.length}/280
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSendingConfiguration;