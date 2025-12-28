'use client';

import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface ImageUploaderProps {
  type: string;
  currentImage?: string | null;
  onImageUpload: (image: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  showPreview?: boolean;
  buttonSize?: 'default' | 'small';
}

const ImageUploader = ({
  currentImage,
  onImageUpload,
  accept = 'image/*',
  maxSize = 5,
  showPreview = true,
  buttonSize = 'default'
}: ImageUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError('');

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageUpload(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-2">
      {showPreview && currentImage ? (
        <div className="flex items-center gap-3">
          <img src={currentImage} alt="Preview" className="w-12 h-12 object-contain rounded" />
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              size={buttonSize}
              onClick={handleButtonClick}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Change Image
            </Button>
            <span className="text-xs text-gray-500">PNG, JPG, SVG up to {maxSize}MB</span>
          </div>
        </div>
      ) : (
        <div>
          <div
            onClick={handleButtonClick}
            className={`${showPreview ? 'w-full h-24' : 'w-16 h-16'} bg-purple-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors`}
          >
            <Upload className="w-6 h-6 text-purple-600" />
          </div>
          {showPreview && (
            <Button
              type="button"
              size="sm"
              onClick={handleButtonClick}
              className="mt-2 bg-purple-600 hover:bg-purple-700"
            >
              Upload New File
            </Button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader;