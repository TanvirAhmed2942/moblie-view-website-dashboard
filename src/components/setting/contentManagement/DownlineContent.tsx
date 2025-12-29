import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useCreateContentMutation, useGetContentQuery } from '../../../features/settings/settingsApi';

interface LevelOption {
  value: string;
  label: string;
  level: number;
}

interface LevelContent {
  level: number;
  title: string;
  description: string;
  benefits: string;
  targetInvitation: string;
  targetDonation: string;
  targetRaising: string;
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

  const { data: apiData, refetch } = useGetContentQuery({});
  const [DownlineContent, { isLoading }] = useCreateContentMutation();

  // State for selected level
  const [selectedLevel, setSelectedLevel] = useState<string>("level1");

  // State for current level's content
  const [currentContent, setCurrentContent] = useState<LevelContent>({
    level: 1,
    title: "",
    description: "",
    benefits: "",
    targetInvitation: "",
    targetDonation: "",
    targetRaising: "",
  });

  // SIRF YAHAN DEFAULT VALUES SET KIYE HAI
  useEffect(() => {
    if (apiData?.success && apiData?.data?.userLevelStrategy) {
      const userLevels = apiData.data.userLevelStrategy;

      // Level 1 ke liye data set karo (L1)
      const level1Data = userLevels.find((level: { level: string }) => level.level === "L1");

      if (level1Data) {
        setCurrentContent({
          level: 1,
          title: level1Data.title || "",
          description: level1Data.description || "",
          benefits: Array.isArray(level1Data.benefits) ? level1Data.benefits.join(", ") : level1Data.benefits || "",
          targetInvitation: level1Data.targetInvitation?.toString() || "",
          targetDonation: level1Data.targetDonation?.toString() || "",
          targetRaising: level1Data.targetRaising?.toString() || "",
        });
      }
    }
  }, [apiData]);

  // Handle level selection change
  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    const levelNumber = parseInt(value.replace('level', ''));

    // API se selected level ka data set karo
    if (apiData?.success && apiData?.data?.userLevelStrategy) {
      const userLevels = apiData.data.userLevelStrategy;
      const levelKey = `L${levelNumber}`;
      const levelData = userLevels.find((level: { level: string }) => level.level === levelKey);

      if (levelData) {
        setCurrentContent({
          level: levelNumber,
          title: levelData.title || "",
          description: levelData.description || "",
          benefits: Array.isArray(levelData.benefits) ? levelData.benefits.join(", ") : levelData.benefits || "",
          targetInvitation: levelData.targetInvitation?.toString() || "",
          targetDonation: levelData.targetDonation?.toString() || "",
          targetRaising: levelData.targetRaising?.toString() || "",
        });
      } else {
        // Agar API mein data nahi hai to reset karo
        setCurrentContent({
          level: levelNumber,
          title: "",
          description: "",
          benefits: "",
          targetInvitation: "",
          targetDonation: "",
          targetRaising: "",
        });
      }
    }
  };

  // Handle text input changes
  const handleInputChange = (field: keyof LevelContent, value: string) => {
    setCurrentContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle number input (for duration and currency)
  const handleNumberInput = (field: keyof LevelContent, value: string) => {
    // Allow only numbers for duration
    const cleanedValue = value.replace(/[^0-9]/g, '');
    setCurrentContent(prev => ({
      ...prev,
      [field]: cleanedValue
    }));
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

    const data = new FormData();
    data.append('data', JSON.stringify(currentContent));

    try {
      const response = await DownlineContent(data).unwrap();
      refetch();
      toast.success(response.message || 'Settings saved successfully');

    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Error saving content');
    }
  };

  // Update currentContent level when selectedLevel changes
  useEffect(() => {
    const levelNumber = parseInt(selectedLevel.replace('level', ''));
    setCurrentContent(prev => ({
      ...prev,
      level: levelNumber
    }));
  }, [selectedLevel]);

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Downline Content</h3>
            <p className="text-sm text-gray-600">Update the content for the &quot;Downline&quot; page on your website.</p>
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
              placeholder="Ocean Wave"
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
              placeholder="Impact Level"
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
              placeholder="Enter the benefits."
              className="w-full bg-purple-50 border-0 h-20 text-sm focus:ring-2 focus:ring-purple-500"
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Invitation
              <span className="text-xs text-gray-500 ml-1">({currentContent.targetInvitation?.length || 0}/100)</span>
            </label>
            <Textarea
              value={currentContent.targetInvitation || ""}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange('targetInvitation', e.target.value)}
              placeholder="70,000"
              className="w-full bg-purple-50 border-0 h-20 text-sm focus:ring-2 focus:ring-purple-500"
              maxLength={100}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Donation</label>
            <input
              value={currentContent.targetDonation || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput('targetDonation', e.target.value)}
              placeholder="2,000"
              className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Fund Raising</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                value={currentContent.targetRaising || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleNumberInput('targetRaising', e.target.value)}
                onBlur={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.value) {
                    const formatted = formatCurrency(e.target.value);
                    handleInputChange('targetRaising', formatted);
                  }
                }}
                placeholder="2,00,000"
                className="w-full pl-8 pr-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between border-t border-gray-100 pt-6">
          <div className="flex gap-4">
            {/* Add any left side buttons if needed */}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!currentContent.title?.trim() || isLoading}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isLoading ? 'Saving...' : 'Save Content'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownlineContent;