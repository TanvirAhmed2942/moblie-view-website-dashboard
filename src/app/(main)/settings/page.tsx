'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [websiteName, setWebsiteName] = useState('PASS IT ALONG');
  const [autoSendEnabled, setAutoSendEnabled] = useState(true);
  const [recipientManagementEnabled, setRecipientManagementEnabled] = useState(true);
  const [selectedImages, setSelectedImages] = useState({
    logo: null,
    founderImage: null,
    aboutImages: []
  });

  const [notifications, setNotifications] = useState({
    campaignExpired: { email: true, inApp: false },
    lowProgress: { email: true, inApp: true },
    newDonor: { email: false, inApp: true }
  });

  const [privacyPolicyContent, setPrivacyPolicyContent] = useState([
    {
      id: 'what-we-collect',
      title: 'What We Collect',
      content: 'How it differs and is created by philanthropists...',
      isEditing: false
    },
    {
      id: 'how-we-use-it',
      title: 'How We Use It',
      content: 'How it differs and is created by philanthropists...',
      isEditing: false
    },
    {
      id: 'your-anonymity',
      title: 'Your Anonymity',
      content: 'How it differs and is created by philanthropists...',
      isEditing: false
    },
    {
      id: 'who-sees-your-info',
      title: 'Who Sees Your Info',
      content: 'How it differs and is created by philanthropists...',
      isEditing: false
    },
    {
      id: 'security',
      title: 'Security',
      content: 'How it differs and is created by philanthropists...',
      isEditing: false
    },
    {
      id: 'your-choices',
      title: 'Your Choices',
      content: 'How it differs and is created by philanthropists...',
      isEditing: false
    }
  ]);

  const handleImageUpload = (type, event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'aboutImages') {
          setSelectedImages(prev => ({
            ...prev,
            aboutImages: [...prev.aboutImages, reader.result]
          }));
        } else {
          setSelectedImages(prev => ({
            ...prev,
            [type]: reader.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAboutImage = (index) => {
    setSelectedImages(prev => ({
      ...prev,
      aboutImages: prev.aboutImages.filter((_, i) => i !== index)
    }));
  };

  const handlePrivacyPolicyChange = (id, value, field = 'content') => {
    setPrivacyPolicyContent(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const togglePrivacyPolicyEditing = (id) => {
    setPrivacyPolicyContent(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage and configure the system, content and campaigns</p>
          </div>
          <button className="px-6 py-2 bg-purple-100 cursor-pointer text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors">
            Save all changes
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-4 px-1 font-medium transition-colors relative ${activeTab === 'content'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Content Management
              {activeTab === 'content' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`pb-4 px-1 font-medium transition-colors relative ${activeTab === 'notifications'
                ? 'text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Notifications & Updates
              {activeTab === 'notifications' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>
          </div>
        </div>

        {/* Content Management Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Website Settings */}
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
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo Image</label>
                    <div className="flex items-center gap-3">
                      {selectedImages.logo ? (
                        <img src={selectedImages.logo} alt="Logo" className="w-12 h-12 object-contain" />
                      ) : (
                        <div className="w-12 h-12 bg-purple-50 rounded flex items-center justify-center">
                          <Upload className="w-5 h-5 text-purple-600" />
                        </div>
                      )}
                      <label className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors text-sm font-medium">
                        Upload New Logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('logo', e)}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs text-gray-500">PNG, JPG, SVG up to 5MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Us Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">About Us Content</h3>
              <p className="text-sm text-gray-600 mb-6">Update the content for the "About Us" page on your website.</p>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Introduction</label>
                  <textarea
                    placeholder="How it started, our humble joy philanthropy..."
                    className="w-full px-4 py-3 bg-purple-50 border-0 rounded-lg h-24 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Founder's Quote</label>
                  <textarea
                    placeholder="We started this for people to make..."
                    className="w-full px-4 py-3 bg-purple-50 border-0 rounded-lg h-24 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Founder's Image</label>
                  {selectedImages.founderImage ? (
                    <img src={selectedImages.founderImage} alt="Founder" className="w-full h-24 object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-24 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Upload className="w-6 h-6 text-purple-400" />
                    </div>
                  )}
                  <label className="mt-2 block">
                    <span className="px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors text-sm font-medium inline-block">
                      Upload New File
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('founderImage', e)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Our Mission</label>
                  <textarea
                    placeholder="Our mission is to connect brands in symbiotic..."
                    className="w-full px-4 py-3 bg-purple-50 border-0 rounded-lg h-24 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How We Operate</label>
                  <textarea
                    placeholder="It is important to each charitable money..."
                    className="w-full px-4 py-3 bg-purple-50 border-0 rounded-lg h-24 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* About the Cause Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">About the Cause Content</h3>
              <p className="text-sm text-gray-600 mb-6">Update the content for the "About the Cause" page on your website.</p>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    placeholder="Make your RSVP ideas..."
                    className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    placeholder="Enjoy the party"
                    className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add media</label>
                  <div className="flex gap-2">
                    {selectedImages.aboutImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16">
                        <img src={img} alt={`About ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                        <button
                          onClick={() => removeAboutImage(idx)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {selectedImages.aboutImages.length < 3 && (
                      <label className="w-16 h-16 bg-purple-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-100 transition-colors">
                        <Upload className="w-5 h-5 text-purple-600" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('aboutImages', e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <button className="mt-2 w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Upload Photos
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                  <input
                    placeholder="Enter the name of organization"
                    className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Established</label>
                  <input
                    placeholder="Enter the established date of organization"
                    className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Network</label>
                  <input
                    placeholder="Enter the Network details."
                    className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mission Summary</label>
                  <textarea
                    placeholder="Enter the mission summary"
                    className="w-full px-4 py-3 bg-purple-50 border-0 rounded-lg h-24 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">About Refuge for Women</label>
                  <textarea
                    placeholder="Enter the info of organization"
                    className="w-full px-4 py-3 bg-purple-50 border-0 rounded-lg h-24 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Downline Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Downline Content</h3>
              <p className="text-sm text-gray-600 mb-6">Update the content for the "Downline" page on your website.</p>

              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Level</label>
                  <Select defaultValue="level5">
                    <SelectTrigger className="w-full bg-purple-50 border-0">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="level5">Level 5</SelectItem>
                      <SelectItem value="level4">Level 4</SelectItem>
                      <SelectItem value="level3">Level 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    placeholder="Passes Waved"
                    className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <Textarea
                    placeholder="Broken Down"
                    className="w-full bg-purple-50 border-0 h-20 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                  <Textarea
                    placeholder="Enter the benefits"
                    className="w-full bg-purple-50 border-0 h-20 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Emphasis</label>
                  <Textarea
                    placeholder="WWJD"
                    className="w-full bg-purple-50 border-0 h-20 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Duration</label>
                  <input
                    placeholder="1230"
                    className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Level Pasting</label>
                  <input
                    placeholder="23,000.00"
                    className="w-full px-4 py-2 bg-purple-50 border-0 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Policy Content - UPDATED VERSION */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy Policy Content</h3>
              <p className="text-sm text-gray-600 mb-6">Manage the content for the "Privacy Policy" page.</p>

              <div className="space-y-4">
                {privacyPolicyContent.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Section {index + 1}</h4>
                      {item.isEditing ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePrivacyPolicyEditing(item.id)}
                            className="text-gray-600"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => togglePrivacyPolicyEditing(item.id)}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePrivacyPolicyEditing(item.id)}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          Edit
                        </Button>
                      )}
                    </div>

                    {item.isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handlePrivacyPolicyChange(item.id, e.target.value, 'title')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter section title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Section Content</label>
                          <Textarea
                            value={item.content}
                            onChange={(e) => handlePrivacyPolicyChange(item.id, e.target.value, 'content')}
                            className="min-h-[120px] w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter section content"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-800">{item.title}</h5>
                        <p className="text-sm text-gray-600">{item.content}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications & Updates Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Update Sending Configuration */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Update Sending Configuration</h2>
              <p className="text-sm text-gray-600 mb-6">Create and manage templates for progress updates and celebration emails.</p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Progress Update</label>
                  <Textarea
                    placeholder="Hi '{donor_name}', type weekly update message here..."
                    className="w-full bg-purple-50 border-0 h-32 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">0/280</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Milestone Celebration</label>
                  <Textarea
                    placeholder="Congratulations! We've reached the '{milestone_name}' milestone for the '{campaign_name}' campaign!"
                    className="w-full bg-purple-50 border-0 h-32 text-sm focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">0/280</div>
                </div>
              </div>
            </div>

            {/* Auto-Send Schedule and Recipient Management */}
            <div className="grid grid-cols-2 gap-6">
              {/* Auto-Send Schedule */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Auto-Send Schedule</h3>
                  <Switch
                    checked={autoSendEnabled}
                    onCheckedChange={setAutoSendEnabled}
                  />
                </div>
                <p className="text-sm text-gray-600 mb-6">Define when to automatically send updates.</p>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Progress Updates</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Select defaultValue="weekly">
                      <SelectTrigger className="bg-purple-50 border-0">
                        <SelectValue placeholder="Frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="friday">
                      <SelectTrigger className="bg-purple-50 border-0">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Celebration Messages</label>
                  <label className="flex items-center gap-3">
                    <input type="radio" name="celebration" className="w-4 h-4 text-purple-600" defaultChecked />
                    <span className="text-sm text-gray-700">Send upon milestone achievement</span>
                  </label>
                </div>
              </div>

              {/* Recipient Management */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900">Recipient Management</h3>
                  <Switch
                    checked={recipientManagementEnabled}
                    onCheckedChange={setRecipientManagementEnabled}
                  />
                </div>
                <p className="text-sm text-gray-600 mb-6">Define target audiences for updates.</p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select the Campaign Name</label>
                  <Select defaultValue="project-wellspring">
                    <SelectTrigger className="w-full bg-purple-50 border-0">
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-wellspring">Project Wellspring</SelectItem>
                      <SelectItem value="spring-campaign">Spring Campaign</SelectItem>
                      <SelectItem value="winter-drive">Winter Drive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select the Organization Name</label>
                  <Select defaultValue="ripple-effect">
                    <SelectTrigger className="w-full bg-purple-50 border-0">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ripple-effect">Ripple Effect Foundation</SelectItem>
                      <SelectItem value="charity-org">Charity Organization</SelectItem>
                      <SelectItem value="help-foundation">Help Foundation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* System Notifications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">System Notifications</h3>
              <p className="text-sm text-gray-600 mb-6">Configure internal and external notifications for important system events.</p>

              <div className="space-y-6">
                {/* Campaign Expired Alert */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Campaign Expired Alert</h4>
                    <p className="text-sm text-gray-600 mt-1">Notify when a campaign reaches it's end date.</p>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={notifications.campaignExpired.email}
                        onCheckedChange={(checked) => setNotifications({
                          ...notifications,
                          campaignExpired: { ...notifications.campaignExpired, email: checked }
                        })}
                      />
                      <span className="text-sm text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={notifications.campaignExpired.inApp}
                        onCheckedChange={(checked) => setNotifications({
                          ...notifications,
                          campaignExpired: { ...notifications.campaignExpired, inApp: checked }
                        })}
                      />
                      <span className="text-sm text-gray-700">In-App</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Low Progress Warning */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Low Progress Warning</h4>
                    <p className="text-sm text-gray-600 mt-1">Alert when campaign is below 25% with 1 week left.</p>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={notifications.lowProgress.email}
                        onCheckedChange={(checked) => setNotifications({
                          ...notifications,
                          lowProgress: { ...notifications.lowProgress, email: checked }
                        })}
                      />
                      <span className="text-sm text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={notifications.lowProgress.inApp}
                        onCheckedChange={(checked) => setNotifications({
                          ...notifications,
                          lowProgress: { ...notifications.lowProgress, inApp: checked }
                        })}
                      />
                      <span className="text-sm text-gray-700">In-App</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* New Donor Notification */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">New Donor Notification</h4>
                    <p className="text-sm text-gray-600 mt-1">Notify when a new donor contributes to a campaign.</p>
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={notifications.newDonor.email}
                        onCheckedChange={(checked) => setNotifications({
                          ...notifications,
                          newDonor: { ...notifications.newDonor, email: checked }
                        })}
                      />
                      <span className="text-sm text-gray-700">Email</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Switch
                        checked={notifications.newDonor.inApp}
                        onCheckedChange={(checked) => setNotifications({
                          ...notifications,
                          newDonor: { ...notifications.newDonor, inApp: checked }
                        })}
                      />
                      <span className="text-sm text-gray-700">In-App</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button for Notifications Tab */}
            <div className="flex justify-end">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;