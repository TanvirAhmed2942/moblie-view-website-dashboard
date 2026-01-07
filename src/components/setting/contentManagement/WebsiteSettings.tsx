import { Upload } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useCreateContentMutation, useGetContentQuery } from "../../../features/settings/settingsApi";
import { CustomLoading } from '../../../hooks/CustomLoading';
import { baseURL } from '../../../utils/BaseURL';

// Define types
interface SelectedImagesState {
  logo: string;
}

interface UploadedFilesState {
  logo: File | null;
}


const WebsiteSettings = () => {
  const { data, isLoading: isLoadingContent, refetch } = useGetContentQuery({});
  const [createWebsite, { isLoading }] = useCreateContentMutation();

  // State for website name
  const [websiteName, setWebsiteName] = useState('');

  // State for selected images
  const [selectedImages, setSelectedImages] = useState<SelectedImagesState>({
    logo: '',
  });

  // State for uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesState>({
    logo: null,
  });

  // Set default values from API response
  useEffect(() => {
    if (data?.data) {
      const contentData = data.data;

      // Set website name from appName
      if (contentData.appName) {
        setWebsiteName(contentData.appName);
      }

      // Set logo from founders image
      if (contentData.logo) {
        const imageUrl = `${baseURL || ''}/${contentData.logo}`;
        setSelectedImages(prev => ({
          ...prev,
          logo: imageUrl
        }));
      }
    }
  }, [data]);

  // Handle image upload
  const handleImageUpload = (imageType: keyof SelectedImagesState, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload PNG, JPG, or SVG files only');
      return;
    }

    // Create a preview URL for the image
    const imageUrl = URL.createObjectURL(file);

    // Update state
    setSelectedImages(prev => ({
      ...prev,
      [imageType]: imageUrl
    }));

    setUploadedFiles(prev => ({
      ...prev,
      [imageType]: file
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    const websitetitle = { appName: websiteName };
    data.append('data', JSON.stringify(websitetitle));

    if (uploadedFiles.logo) {
      data.append('logo', uploadedFiles.logo);
    }

    try {
      const response = await createWebsite(data).unwrap();
      console.log(response);
      refetch();
      toast.success(response.message || 'Settings saved successfully');
    } catch (error) {
      console.log(error);
      toast.error('Error saving settings');
    }
  };

  if (isLoadingContent) {
    return (
      <div className="flex items-center justify-center p-8">
        <CustomLoading />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Update Content Configuration</h2>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Website Settings</h3>
          <p className="text-sm text-gray-600 mb-4">Manage general website configurations like name and logo.</p>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website Name</label>
              <input
                type="text"
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter website name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo Image</label>
              <div className="flex items-center gap-3">
                {selectedImages.logo ? (
                  <Image
                    src={selectedImages.logo}
                    alt="Logo preview"
                    width={1000}
                    height={1000}
                    className="w-12 h-12 object-contain border border-gray-200 rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-purple-50 rounded flex items-center justify-center border border-dashed border-gray-300">
                    <Upload className="w-5 h-5 text-purple-600" />
                  </div>
                )}
                <label className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors text-sm font-medium">
                  Upload New Logo
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                    onChange={(e) => handleImageUpload('logo', e)}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</span>
              </div>

              {selectedImages.logo && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImages(prev => ({ ...prev, logo: '' }));
                    setUploadedFiles(prev => ({ ...prev, logo: null }));
                  }}
                  className="mt-2 text-sm cursor-pointer text-red-600 hover:text-red-800"
                >
                  Remove logo
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-purple-600 cursor-pointer text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteSettings;