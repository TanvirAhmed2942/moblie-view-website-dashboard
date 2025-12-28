import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, useEffect, useState } from 'react';
import { useCreateContentMutation, useGetContentQuery } from '../../../features/settings/settingsApi';

interface LevelOption {
  value: string;
  label: string;
  level: number;
}

interface LevelContent {
  title: string;
  description: string;
  benefits: string;
  targetEmphasis: string;
  targetDuration: string;
  targetLevelPasting: string;
}

interface LevelContents {
  [key: string]: LevelContent;
}

const DownlineContent = () => {
  // Level options
  const levelOptions: LevelOption[] = [
    { value: "level1", label: "Level 1", level: 1 },
    { value: "level2", label: "Level 2", level: 2 },
    { value: "level3", label: "Level 3", level: 3 },
    { value: "level4", label: "Level 4", level: 4 },
    { value: "level5", label: "Level 5", level: 5 },
  ];

  const { data, isLoading: isLoadingContent, refetch } = useGetContentQuery({});
  const [createWebsite, { isLoading }] = useCreateContentMutation();

  // State for selected level and its content
  const [selectedLevel, setSelectedLevel] = useState<string>("level5");
  const [levelContents, setLevelContents] = useState<LevelContents>({
    level5: {
      title: "",
      description: "",
      benefits: "",
      targetEmphasis: "",
      targetDuration: "",
      targetLevelPasting: "",
    },
    level4: {
      title: "",
      description: "",
      benefits: "",
      targetEmphasis: "",
      targetDuration: "",
      targetLevelPasting: "",
    },
    level3: {
      title: "",
      description: "",
      benefits: "",
      targetEmphasis: "",
      targetDuration: "",
      targetLevelPasting: "",
    },
    level2: {
      title: "",
      description: "",
      benefits: "",
      targetEmphasis: "",
      targetDuration: "",
      targetLevelPasting: "",
    },
    level1: {
      title: "",
      description: "",
      benefits: "",
      targetEmphasis: "",
      targetDuration: "",
      targetLevelPasting: "",
    },
  });

  // Get current level content
  const currentContent = levelContents[selectedLevel];

  // Handle level selection change
  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
  };

  // Handle text input changes
  const handleInputChange = (field: keyof LevelContent, value: string) => {
    setLevelContents(prev => ({
      ...prev,
      [selectedLevel]: {
        ...prev[selectedLevel],
        [field]: value
      }
    }));
  };

  // Handle number input (for duration and currency)
  const handleNumberInput = (field: keyof LevelContent, value: string) => {
    // Allow only numbers for duration
    const cleanedValue = value.replace(/[^0-9]/g, '');
    handleInputChange(field, cleanedValue);
  };

  // Format currency value
  const formatCurrency = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSave = {
      selectedLevel,
      levelContents
    };

    try {
      // Example API call
      // const response = await fetch('/api/downline', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(dataToSave),
      // });

      console.log('Downline content to save:', dataToSave);

      // Show success message
      alert(`Level ${selectedLevel.replace('level', '')} content saved successfully!`);
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    }
  };


  // Load saved data on component mount
  useEffect(() => {
    // Example: Load saved data from API
    const fetchSavedData = async () => {
      try {
        // const response = await fetch('/api/downline');
        // const data = await response.json();
        // if (data) {
        //   setLevelContents(data.levelContents || levelContents);
        //   setSelectedLevel(data.selectedLevel || "level5");
        // }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };

    fetchSavedData();
  }, []);

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Downline Content</h3>
            <p className="text-sm text-gray-600">Update the content for the "Downline" page on your website.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Currently editing:</span>
            <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Level {selectedLevel.replace('level', '')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Level</label>
            <Select value={selectedLevel} onValueChange={handleLevelChange}>
              <SelectTrigger className="w-full bg-purple-50 border-0 focus:ring-2 focus:ring-purple-500">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {levelOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{option.label}</span>
                      {levelContents[option.value]?.title && (
                        <span className="text-xs text-gray-500">({levelContents[option.value].title})</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
              <span className="text-xs text-gray-500 ml-1">({currentContent.title?.length || 0}/100)</span>
            </label>
            <input
              value={currentContent.title || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
              placeholder="Passes Waved"
              className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={100}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
              <span className="text-xs text-gray-500 ml-1">({currentContent.description?.length || 0}/500)</span>
            </label>
            <Textarea
              value={currentContent.description || ""}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
              placeholder="Broken Down"
              className="w-full bg-purple-50 border-0 h-20 text-sm focus:ring-2 focus:ring-purple-500"
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benefits
              <span className="text-xs text-gray-500 ml-1">({currentContent.benefits?.length || 0}/500)</span>
            </label>
            <Textarea
              value={currentContent.benefits || ""}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('benefits', e.target.value)}
              placeholder="Enter the benefits"
              className="w-full bg-purple-50 border-0 h-20 text-sm focus:ring-2 focus:ring-purple-500"
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Invitation
              <span className="text-xs text-gray-500 ml-1">({currentContent.targetEmphasis?.length || 0}/100)</span>
            </label>
            <Textarea
              value={currentContent.targetEmphasis || ""}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('targetEmphasis', e.target.value)}
              placeholder="WWJD"
              className="w-full bg-purple-50 border-0 h-20 text-sm focus:ring-2 focus:ring-purple-500"
              maxLength={100}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Donation</label>
            <input
              value={currentContent.targetDuration || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput('targetDuration', e.target.value)}
              placeholder="1230"
              className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={5}
            />
            <p className="text-xs text-gray-500 mt-1">Enter number of days</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Fund Raising</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                value={currentContent.targetLevelPasting || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput('targetLevelPasting', e.target.value)}
                onBlur={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.value) {
                    handleInputChange('targetLevelPasting', formatCurrency(e.target.value));
                  }
                }}
                placeholder="23,000.00"
                className="w-full pl-8 pr-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Format: 23,000.00</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between border-t border-gray-100 pt-6">
          <div className="flex gap-4">

          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!currentContent.title?.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Save Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownlineContent;