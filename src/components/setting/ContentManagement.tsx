'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ImageUploader from './ImageUploader';

const ContentManagement = () => {
  const [websiteName, setWebsiteName] = useState('PASS IT ALONG');
  const [selectedImages, setSelectedImages] = useState({
    logo: null as string | null,
    founderImage: null as string | null,
    aboutImages: [] as string[]
  });

  const handleImageUpload = (type: string, image: string) => {
    if (type === 'aboutImages') {
      setSelectedImages(prev => ({
        ...prev,
        aboutImages: [...prev.aboutImages, image]
      }));
    } else {
      setSelectedImages(prev => ({
        ...prev,
        [type]: image
      }));
    }
  };

  const removeAboutImage = (index: number) => {
    setSelectedImages(prev => ({
      ...prev,
      aboutImages: prev.aboutImages.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6 p-6">
      {/* Website Settings */}
      <Card className="border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Update Content Configuration</h2>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Website Settings</h3>
            <p className="text-sm text-gray-600 mb-4">Manage general website configurations like name and logo.</p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="website-name">Website Name</Label>
                <Input
                  id="website-name"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Logo Image</Label>
                <ImageUploader
                  type="logo"
                  currentImage={selectedImages.logo}
                  onImageUpload={(image) => handleImageUpload('logo', image)}
                  accept="image/*"
                  maxSize={5}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* About Us Content */}
      <Card className="border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">About Us Content</h3>
          <p className="text-sm text-gray-600 mb-6">Update the content for the "About Us" page on your website.</p>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <Label htmlFor="introduction">Introduction</Label>
              <Textarea
                id="introduction"
                placeholder="How it started, our humble joy philanthropy..."
                className="mt-2 bg-purple-50 border-0"
              />
            </div>

            <div>
              <Label htmlFor="founder-quote">Founder's Quote</Label>
              <Textarea
                id="founder-quote"
                placeholder="We started this for people to make..."
                className="mt-2 bg-purple-50 border-0"
              />
            </div>

            <div>
              <Label>Founder's Image</Label>
              <ImageUploader
                type="founderImage"
                currentImage={selectedImages.founderImage}
                onImageUpload={(image) => handleImageUpload('founderImage', image)}
                accept="image/*"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="mission">Our Mission</Label>
              <Textarea
                id="mission"
                placeholder="Our mission is to connect brands in symbiotic..."
                className="mt-2 bg-purple-50 border-0"
              />
            </div>

            <div>
              <Label htmlFor="operation">How We Operate</Label>
              <Textarea
                id="operation"
                placeholder="It is important to each charitable money..."
                className="mt-2 bg-purple-50 border-0"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* About the Cause Content */}
      <Card className="border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">About the Cause Content</h3>
          <p className="text-sm text-gray-600 mb-6">Update the content for the "About the Cause" page on your website.</p>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <Label htmlFor="cause-title">Title</Label>
              <Input
                id="cause-title"
                placeholder="Make your RSVP ideas..."
                className="mt-2 bg-purple-50 border-0"
              />
            </div>

            <div>
              <Label htmlFor="cause-subtitle">Subtitle</Label>
              <Input
                id="cause-subtitle"
                placeholder="Enjoy the party"
                className="mt-2 bg-purple-50 border-0"
              />
            </div>

            <div>
              <Label>Add media</Label>
              <div className="flex gap-2 mt-2">
                {selectedImages.aboutImages.map((img, idx) => (
                  <div key={idx} className="relative w-16 h-16">
                    <img src={img} alt={`About ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                    <Button
                      type="button"
                      size="icon"
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full"
                      onClick={() => removeAboutImage(idx)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                {selectedImages.aboutImages.length < 3 && (
                  <ImageUploader
                    type="aboutImages"
                    onImageUpload={(image) => handleImageUpload('aboutImages', image)}
                    accept="image/*"
                    showPreview={false}
                    buttonSize="small"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                placeholder="Enter the name of organization"
                className="mt-2 bg-purple-50 border-0"
              />
            </div>

            <div>
              <Label htmlFor="established">Established</Label>
              <Input
                id="established"
                placeholder="Enter the established date of organization"
                className="mt-2 bg-purple-50 border-0"
              />
            </div>

            <div>
              <Label htmlFor="network">Network</Label>
              <Input
                id="network"
                placeholder="Enter the Network details."
                className="mt-2 bg-purple-50 border-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="mission-summary">Mission Summary</Label>
              <Textarea
                id="mission-summary"
                placeholder="Enter the mission summary"
                className="mt-2 bg-purple-50 border-0"
              />
            </div>

            <div>
              <Label htmlFor="about-org">About Refuge for Women</Label>
              <Textarea
                id="about-org"
                placeholder="Enter the info of organization"
                className="mt-2 bg-purple-50 border-0"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Downline Content */}
      <Card className="border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Downline Content</h3>
          <p className="text-sm text-gray-600 mb-6">Update the content for the "Downline" page on your website.</p>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <Label htmlFor="level">Select Level</Label>
              <Select>
                <SelectTrigger className="mt-2 bg-purple-50 border-0">
                  <SelectValue placeholder="Level 5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="level5">Level 5</SelectItem>
                  <SelectItem value="level4">Level 4</SelectItem>
                  <SelectItem value="level3">Level 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="downline-title">Title</Label>
              <Input
                id="downline-title"
                placeholder="Passes Waved"
                className="mt-2 bg-purple-50 border-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Broken Down"
                className="mt-2 bg-purple-50 border-0"
              />
            </div>

            <div>
              <Label htmlFor="benefits">Benefits</Label>
              <Textarea
                id="benefits"
                placeholder="Enter the benefits"
                className="mt-2 bg-purple-50 border-0"
              />
            </div>

            <div>
              <Label htmlFor="target-emphasis">Target Emphasis</Label>
              <Textarea
                id="target-emphasis"
                placeholder="WWJD"
                className="mt-2 bg-purple-50 border-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="target-duration">Target Duration</Label>
              <Input
                id="target-duration"
                placeholder="1230"
                className="mt-2 bg-purple-50 border-0"
              />
            </div>

            <div>
              <Label htmlFor="target-level">Target Level Pasting</Label>
              <Input
                id="target-level"
                placeholder="23,000.00"
                className="mt-2 bg-purple-50 border-0"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Policy Content */}
      <Card className="border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy Policy Content</h3>
          <p className="text-sm text-gray-600 mb-6">Manage the content for the "Privacy Policy" page.</p>

          <div className="space-y-4">
            {[
              'What We Collect',
              'How We Use It',
              'Your Anonymity',
              'Who Sees Your Info',
              'Security',
              'Your Choices'
            ].map((item) => (
              <div key={item}>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={item} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={item.toLowerCase().replace(/\s+/g, '-')}>{item}</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder={`How it differs and is created by philanthropists...`}
                  className="mt-2 bg-purple-50 border-0"
                />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContentManagement;