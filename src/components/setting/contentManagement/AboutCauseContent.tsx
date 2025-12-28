import { Upload, X } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react'; // useEffect import kiya
import toast from 'react-hot-toast';
import { useCreateContentMutation, useGetContentQuery } from '../../../features/settings/settingsApi';
import { baseURL } from '../../../utils/BaseURL';

interface ContentState {
  title: string;
  subtitle: string;
  organizationName: string;
  established: string;
  network: string;
  missionSummary: string;
  aboutRefugeForWomen: string;
}

interface SelectedImages {
  aboutImages: string[];
}

interface UploadedFiles {
  aboutImages: File[];
}

const AboutCauseContent = () => {
  // State for text content
  const [content, setContent] = useState<ContentState>({
    title: '',
    subtitle: '',
    organizationName: '',
    established: '',
    network: '',
    missionSummary: '',
    aboutRefugeForWomen: '',
  });

  // State for images (array for multiple images)
  const [selectedImages, setSelectedImages] = useState<SelectedImages>({
    aboutImages: [], // Array of image URLs
  });

  // State for uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    aboutImages: [], // Array of File objects
  });

  const { data, isLoading: isLoadingContent, refetch } = useGetContentQuery({});
  const [createWebsite, { isLoading }] = useCreateContentMutation();

  // SIRF YAHAN DEFAULT VALUES SET KIYE HAI
  useEffect(() => {
    if (data?.success && data?.data) {
      const apiData = data.data;

      // Text content set kiya
      setContent({
        title: apiData.title || '',
        subtitle: apiData.subTitle || '',
        organizationName: apiData.organizationName || '',
        established: apiData.established ? apiData.established.substring(0, 4) : '',
        network: apiData.network || '',
        missionSummary: apiData.missionSummary || '',
        aboutRefugeForWomen: apiData.aboutRefugeForWomen || '',
      });

      // Gallery images set kiya (multiple images array)
      if (apiData.gallery && Array.isArray(apiData.gallery)) {
        setSelectedImages(prev => ({
          ...prev,
          aboutImages: apiData.gallery.map((image: string) => `${baseURL}${image}`)
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

  // Handle image upload for aboutImages (multiple images)
  const handleImageUpload = (imageType: keyof SelectedImages, event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || !files.length) return;

    const fileArray = Array.from(files);

    // Limit to 3 images total
    const currentCount = selectedImages.aboutImages.length;
    if (currentCount + fileArray.length > 3) {
      alert(`You can only upload up to 3 images. You currently have ${currentCount}.`);
      return;
    }

    const validFiles: File[] = [];
    const previewUrls: string[] = [];

    fileArray.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Must be less than 5MB.`);
        return;
      }

      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert(`File ${file.name} must be an image (PNG, JPG, WebP, GIF).`);
        return;
      }

      validFiles.push(file);
      previewUrls.push(URL.createObjectURL(file));
    });

    setSelectedImages(prev => ({
      ...prev,
      aboutImages: [...prev.aboutImages, ...previewUrls]
    }));

    setUploadedFiles(prev => ({
      ...prev,
      aboutImages: [...prev.aboutImages, ...validFiles]
    }));
  };

  // Remove specific image from aboutImages
  const removeAboutImage = (index: number) => {
    URL.revokeObjectURL(selectedImages.aboutImages[index]);

    setSelectedImages(prev => ({
      ...prev,
      aboutImages: prev.aboutImages.filter((_, i) => i !== index)
    }));

    setUploadedFiles(prev => ({
      ...prev,
      aboutImages: prev.aboutImages.filter((_, i) => i !== index)
    }));
  };

  // Clear all aboutImages
  const clearAllImages = () => {
    selectedImages.aboutImages.forEach(url => URL.revokeObjectURL(url));

    setSelectedImages(prev => ({ ...prev, aboutImages: [] }));
    setUploadedFiles(prev => ({ ...prev, aboutImages: [] }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      title: content.title,
      subTitle: content.subtitle,
      organizationName: content.organizationName,
      established: content.established,
      network: content.network,
      missionSummary: content.missionSummary,
      aboutRefugeForWomen: content.aboutRefugeForWomen
    }

    const contentData = new FormData();
    contentData.append('data', JSON.stringify(data));

    // Add gallery images
    if (uploadedFiles.aboutImages.length > 0) {
      uploadedFiles.aboutImages.forEach((file, index) => {
        contentData.append('gallery', file);
      });
    }

    try {
      const response = await createWebsite(contentData).unwrap();
      console.log(response);
      refetch();
      toast.success(response.message || 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    }
  };

  // Format date for established field
  const handleEstablishedChange = (value: string) => {
    const cleanedValue = value.replace(/[^0-9-]/g, '');
    handleTextChange('established', cleanedValue);
  };

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">About the Cause Content</h3>
        <p className="text-sm text-gray-600 mb-6">Update the content for the "About the Cause" page on your website.</p>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
              <span className="text-xs text-gray-500 ml-1">({content.title.length}/100)</span>
            </label>
            <input
              value={content.title} // YAHAN DEFAULT VALUE
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleTextChange('title', e.target.value)}
              placeholder="Make your RSVP ideas..."
              className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={100}
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subtitle
              <span className="text-xs text-gray-500 ml-1">({content.subtitle.length}/150)</span>
            </label>
            <input
              value={content.subtitle} // YAHAN DEFAULT VALUE
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleTextChange('subtitle', e.target.value)}
              placeholder="Enjoy the party"
              className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={150}
            />
          </div>

          {/* Add media */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add media ({selectedImages.aboutImages.length}/3)
            </label>
            <div className="flex gap-2 mb-2">
              {selectedImages.aboutImages.map((img, idx) => ( // YAHAN DEFAULT GALLERY IMAGES
                <div key={idx} className="relative w-16 h-16 group">
                  <img
                    src={img}
                    alt={`About ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeAboutImage(idx)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {selectedImages.aboutImages.length < 3 && (
                <label className="w-16 h-16 bg-purple-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors border border-dashed border-gray-300">
                  <Upload className="w-5 h-5 text-purple-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('aboutImages', e)}
                    className="hidden"
                    multiple
                  />
                </label>
              )}
            </div>
            <div className="flex gap-2">
              {selectedImages.aboutImages.length > 0 && (
                <button
                  type="button"
                  onClick={clearAllImages}
                  className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  Clear All
                </button>
              )}
              <label className="flex-1">
                <span className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors text-center cursor-pointer">
                  {selectedImages.aboutImages.length > 0 ? 'Add More Photos' : 'Upload Photos'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload('aboutImages', e)}
                  className="hidden"
                  multiple
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">Up to 3 images, 5MB each. Recommended: 800×600px</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Name
              <span className="text-xs text-gray-500 ml-1">({content.organizationName.length}/200)</span>
            </label>
            <input
              value={content.organizationName} // YAHAN DEFAULT VALUE
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleTextChange('organizationName', e.target.value)}
              placeholder="Enter the name of organization"
              className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={200}
            />
          </div>

          {/* Established */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Established (Year)</label>
            <input
              value={content.established} // YAHAN DEFAULT VALUE
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleEstablishedChange(e.target.value)}
              placeholder="YYYY or YYYY-MM"
              className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={7}
            />
            <p className="text-xs text-gray-500 mt-1">Format: YYYY or YYYY-MM</p>
          </div>

          {/* Network */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Network
              <span className="text-xs text-gray-500 ml-1">({content.network.length}/150)</span>
            </label>
            <input
              value={content.network} // YAHAN DEFAULT VALUE
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleTextChange('network', e.target.value)}
              placeholder="Enter the Network details"
              className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={150}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Mission Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mission Summary
              <span className="text-xs text-gray-500 ml-1">({content.missionSummary.length}/500)</span>
            </label>
            <textarea
              value={content.missionSummary} // YAHAN DEFAULT VALUE
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleTextChange('missionSummary', e.target.value)}
              placeholder="Enter the mission summary"
              className="w-full px-4 py-3 bg-purple-50 border-0 rounded-lg h-24 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={500}
            />
          </div>

          {/* About Refuge for Women */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Refuge for Women
              <span className="text-xs text-gray-500 ml-1">({content.aboutRefugeForWomen.length}/1000)</span>
            </label>
            <textarea
              value={content.aboutRefugeForWomen} // YAHAN DEFAULT VALUE
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleTextChange('aboutRefugeForWomen', e.target.value)}
              placeholder="Enter the info of organization"
              className="w-full px-4 py-3 bg-purple-50 border-0 rounded-lg h-24 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={1000}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!content.title.trim() || !content.organizationName.trim()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutCauseContent;