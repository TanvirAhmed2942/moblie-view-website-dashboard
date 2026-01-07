import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useCreateContentMutation, useGetContentQuery } from '../../../features/settings/settingsApi';
import { baseURL } from '../../../utils/BaseURL';

// Define types for content
interface ContentState {
  introduction: string;
  foundersQuote: string;
  ourMission: string;
  howWeOperate: string;
}

interface SelectedImagesState {
  founderImage: string;
}

interface UploadedFilesState {
  founderImage: File | null;
}

interface ApiResponseData {
  introduction?: string;
  foundersQuote?: string;
  ourMission?: string;
  howWeOperate?: string;
  founders?: Array<{ image?: string }>;
}

const AboutUsContent = () => {
  // State for text content
  const [content, setContent] = useState<ContentState>({
    introduction: '',
    foundersQuote: '',
    ourMission: '',
    howWeOperate: '',
  });

  // State for images
  const [selectedImages, setSelectedImages] = useState<SelectedImagesState>({
    founderImage: '',
  });

  // State for uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({
    founderImage: null,
  });

  const { data, refetch } = useGetContentQuery({});
  const [createWebsite, { isLoading: isLoadingCreate }] = useCreateContentMutation();

  // Load default values from API
  useEffect(() => {
    if (data?.success && data?.data) {
      const apiData = data.data as ApiResponseData;

      // Set text content
      setContent({
        introduction: apiData.introduction || '',
        foundersQuote: apiData.foundersQuote || '',
        ourMission: apiData.ourMission || '',
        howWeOperate: apiData.howWeOperate || '',
      });

      // Set founder's image
      if (apiData.founders && apiData.founders.length > 0 && apiData.founders[0].image) {
        setSelectedImages(prev => ({
          ...prev,
          founderImage: baseURL + "/" + (apiData?.founders?.[0]?.image ?? '')

        }));
      }
    }
  }, [data]);

  // Handle text input changes
  const handleTextChange = (field: keyof ContentState, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (imageType: keyof SelectedImagesState, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload image files only (PNG, JPG, WebP)');
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedImages(prev => ({
      ...prev,
      [imageType]: imageUrl
    }));

    setUploadedFiles(prev => ({
      ...prev,
      [imageType]: file
    }));
  };

  // Remove founder image
  const removeFounderImage = () => {
    if (selectedImages.founderImage) {
      URL.revokeObjectURL(selectedImages.founderImage);
    }

    setSelectedImages(prev => ({ ...prev, founderImage: '' }));
    setUploadedFiles(prev => ({ ...prev, founderImage: null }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    const contentData = {
      introduction: content.introduction,
      foundersQuote: content.foundersQuote,
      ourMission: content.ourMission,
      howWeOperate: content.howWeOperate,
    };

    data.append('data', JSON.stringify(contentData));

    if (uploadedFiles.founderImage) {
      data.append('image', uploadedFiles.founderImage);
    }

    try {
      const response = await createWebsite(data).unwrap();
      console.log(response);
      refetch();
      toast.success(response.message || 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    }
  };



  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">About Us Content</h3>
        <p className="text-sm text-gray-600 mb-6">Update the content for the &quot;About Us&quot; page on your website.</p>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Introduction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Introduction
              <span className="text-xs text-gray-500 ml-1">({content.introduction.length}/500)</span>
            </label>
            <textarea
              value={content.introduction}
              onChange={(e) => handleTextChange('introduction', e.target.value)}
              placeholder="How it started, our humble joy philanthropy..."
              className="w-full px-4 py-3 bg-purple-50 border-0 rounded-lg h-24 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={500}
            />
          </div>

          {/* Founder's Quote */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Founder&apos;s Quote
              <span className="text-xs text-gray-500 ml-1">({content.foundersQuote.length}/200)</span>
            </label>
            <textarea
              value={content.foundersQuote}
              onChange={(e) => handleTextChange('foundersQuote', e.target.value)}
              placeholder="We started this for people to make..."
              className="w-full px-4 py-3 bg-purple-50 border-0 rounded-lg h-24 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={200}
            />
          </div>

          {/* Founder's Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Founder&apos;s Image</label>
            <div className="mb-2">
              {selectedImages.founderImage ? (
                <div className="relative">
                  <Image
                    src={selectedImages.founderImage}
                    alt="Founder"
                    width={1000}
                    height={1000}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeFounderImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-full h-24 bg-purple-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                  <Upload className="w-6 h-6 text-purple-400" />
                </div>
              )}
            </div>
            <label className="block">
              <span className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors text-sm font-medium inline-block">
                {selectedImages.founderImage ? 'Change Image' : 'Upload New File'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('founderImage', e)}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">Recommended: Square image, 400×400px</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Our Mission */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Our Mission
              <span className="text-xs text-gray-500 ml-1">({content.ourMission.length}/300)</span>
            </label>
            <textarea
              value={content.ourMission}
              onChange={(e) => handleTextChange('ourMission', e.target.value)}
              placeholder="Our mission is to connect brands in symbiotic..."
              className="w-full px-4 py-3 bg-purple-50 border-0 rounded-lg h-24 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={300}
            />
          </div>

          {/* How We Operate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How We Operate
              <span className="text-xs text-gray-500 ml-1">({content.howWeOperate.length}/400)</span>
            </label>
            <textarea
              value={content.howWeOperate}
              onChange={(e) => handleTextChange('howWeOperate', e.target.value)}
              placeholder="It is important to each charitable money..."
              className="w-full px-4 py-3 bg-purple-50 border-0 rounded-lg h-24 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={400}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4 border-t border-gray-100 pt-6">
          <button
            type="button"

            onClick={handleSubmit}
            disabled={!content.introduction.trim()}
            className="px-6 py-2 bg-purple-600 cursor-pointer text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {isLoadingCreate ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUsContent;