import { Save } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
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
  const handleSave = () => {
    const dataToSave = {
      templates,
      savedAt: new Date().toISOString()
    };

    console.log('Saving templates:', dataToSave);

    // Example API call
    // try {
    //   const response = await fetch('/api/email-templates', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(dataToSave),
    //   });
    //   
    //   if (response.ok) {
    //     alert('Email templates saved successfully!');
    //   } else {
    //     throw new Error('Failed to save templates');
    //   }
    // } catch (error) {
    //   console.error('Error saving templates:', error);
    //   alert('Error saving email templates');
    // }

    alert('Email templates saved successfully!');
  };

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
            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
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