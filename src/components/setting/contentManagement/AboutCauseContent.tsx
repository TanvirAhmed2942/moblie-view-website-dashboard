import { CalendarIcon, ChevronLeft, ChevronRight, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useCreateContentMutation, useGetContentQuery } from '../../../features/settings/settingsApi';
import { baseURL } from '../../../utils/BaseURL';

// Shadcn/ui components
import { Button } from '../../../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import { cn } from '../../../lib/utils';

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

  // State for selected year and month
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(1); // 1-12 for January-December

  // State for images (array for multiple images)
  const [selectedImages, setSelectedImages] = useState<SelectedImages>({
    aboutImages: [], // Array of image URLs
  });

  // State for uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    aboutImages: [], // Array of File objects
  });

  const { data, refetch } = useGetContentQuery({});
  const [createWebsite, { isLoading }] = useCreateContentMutation();

  // Default values set kiya including date parsing
  useEffect(() => {
    if (data?.success && data?.data) {
      const apiData = data.data;

      // Text content set kiya
      setContent({
        title: apiData.title || '',
        subtitle: apiData.subTitle || '',
        organizationName: apiData.organizationName || '',
        established: apiData.established || '',
        network: apiData.network || '',
        missionSummary: apiData.missionSummary || '',
        aboutRefugeForWomen: apiData.aboutRefugeForWomen || '',
      });

      // Parse established date (YYYY-MM format)
      if (apiData.established) {
        const dateStr = apiData.established;
        const match = dateStr.match(/^(\d{4})-(\d{2})$/);

        if (match) {
          const year = parseInt(match[1]);
          const month = parseInt(match[2]);

          if (year >= 1900 && year <= new Date().getFullYear() && month >= 1 && month <= 12) {
            setSelectedYear(year);
            setSelectedMonth(month);
          }
        } else if (dateStr.match(/^\d{4}$/)) {
          // Only year provided (YYYY format)
          const year = parseInt(dateStr);
          if (year >= 1900 && year <= new Date().getFullYear()) {
            setSelectedYear(year);
            setSelectedMonth(1); // Default to January
          }
        }
      }

      // Gallery images set kiya (multiple images array)
      if (apiData.gallery && Array.isArray(apiData.gallery)) {
        setSelectedImages(prev => ({
          ...prev,
          aboutImages: apiData.gallery.map((image: string) => `${baseURL}/${image}`)
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

  // // Handle year and month selection
  // const handleYearMonthSelect = () => {
  //   const monthStr = selectedMonth.toString().padStart(2, '0');
  //   handleTextChange('established', `${selectedYear}-${monthStr}`);
  // };

  // Handle previous year
  const handlePrevYear = () => {
    if (selectedYear > 1900) {
      setSelectedYear(prev => prev - 1);
    }
  };

  // Handle next year
  const handleNextYear = () => {
    const currentYear = new Date().getFullYear();
    if (selectedYear < currentYear) {
      setSelectedYear(prev => prev + 1);
    }
  };

  // Handle month selection
  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
  };

  // Months array
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  // Get month name
  const getMonthName = (month: number) => {
    return months.find(m => m.value === month)?.label || '';
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

    // Ensure established is updated with current selection
    const monthStr = selectedMonth.toString().padStart(2, '0');
    const updatedContent = {
      ...content,
      established: `${selectedYear}-${monthStr}`
    };

    const data = {
      title: updatedContent.title,
      subTitle: updatedContent.subtitle,
      organizationName: updatedContent.organizationName,
      established: updatedContent.established,
      network: updatedContent.network,
      missionSummary: updatedContent.missionSummary,
      aboutRefugeForWomen: updatedContent.aboutRefugeForWomen
    }

    const contentData = new FormData();
    contentData.append('data', JSON.stringify(data));

    // Add gallery images
    if (uploadedFiles.aboutImages.length > 0) {
      uploadedFiles.aboutImages.forEach((file) => {
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

  // Format for display
  const formatDisplay = () => {
    if (!content.established) return 'Select month and year';
    return `${getMonthName(selectedMonth)} ${selectedYear}`;
  };

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">About the Cause Content</h3>
        <p className="text-sm text-gray-600 mb-6">Update the content for the &quot;About the Cause&quot; page on your website.</p>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
              <span className="text-xs text-gray-500 ml-1">({content.title.length}/100)</span>
            </label>
            <input
              value={content.title}
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
              value={content.subtitle}
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
              {selectedImages.aboutImages.map((img, idx) => (
                <div key={idx} className="relative w-16 h-16 group">
                  <Image
                    src={img}
                    alt={`About ${idx + 1}`}
                    width={1000}
                    height={1000}
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
              value={content.organizationName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleTextChange('organizationName', e.target.value)}
              placeholder="Enter the name of organization"
              className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              maxLength={200}
            />
          </div>

          {/* Established - Month/Year Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Established (Month/Year)</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-purple-50 border-0 rounded-lg px-4 py-2 h-auto min-h-[42px]",
                    !content.established && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDisplay()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                {/* Year Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevYear}
                    disabled={selectedYear <= 1900}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold">{selectedYear}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextYear}
                    disabled={selectedYear >= new Date().getFullYear()}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Months Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {months.map((month) => (
                    <Button
                      key={month.value}
                      variant={selectedMonth === month.value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleMonthSelect(month.value)}
                      className={cn(
                        "h-10",
                        selectedMonth === month.value && "bg-purple-600 hover:bg-purple-700"
                      )}
                    >
                      {month.label.substring(0, 3)}
                    </Button>
                  ))}
                </div>

                {/* Apply Button */}
                {/* <div className="mt-4 pt-4 border-t">
                  <Button
                    onClick={handleYearMonthSelect}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    size="sm"
                  >
                    Apply
                  </Button>
                </div> */}
              </PopoverContent>
            </Popover>
            <div className="mt-2">
              <input
                type="text"
                value={content.established}
                readOnly
                className="hidden"
              />

            </div>
          </div>

          {/* Network */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Network
              <span className="text-xs text-gray-500 ml-1">({content.network.length}/150)</span>
            </label>
            <input
              value={content.network}
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
              value={content.missionSummary}
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
              value={content.aboutRefugeForWomen}
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
            className="px-6 py-2 bg-purple-600 cursor-pointer text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutCauseContent;