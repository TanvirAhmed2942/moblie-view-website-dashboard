import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  Edit2,
  Plus,
  Save,
  Trash2,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';

const PrivacyPolicyContent = () => {
  // Initial content structure
  const initialSections = [
    {
      id: 'section1',
      title: 'Information We Collect',
      content: 'We collect information that you provide directly to us, such as when you create an account, update your profile, use our services, or communicate with us.',
      isEditing: false,
      order: 1
    },
    {
      id: 'section2',
      title: 'How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our company and our users.',
      isEditing: false,
      order: 2
    },
    {
      id: 'section3',
      title: 'Information Sharing',
      content: 'We do not share personal information with companies, organizations, or individuals outside of our company except in the following cases: with your consent, for legal reasons, or with domain administrators.',
      isEditing: false,
      order: 3
    },
    {
      id: 'section4',
      title: 'Data Security',
      content: 'We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.',
      isEditing: false,
      order: 4
    },
    {
      id: 'section5',
      title: 'Your Rights',
      content: 'Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, delete, or restrict processing of your data.',
      isEditing: false,
      order: 5
    }
  ];

  // State for privacy policy sections
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState(initialSections);

  // State for new section
  const [newSection, setNewSection] = useState({
    title: '',
    content: '',
    isEditing: true
  });

  // State for preview mode
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Toggle edit mode for a section
  const togglePrivacyPolicyEditing = (id: any) => {
    setPrivacyPolicyContent(prev =>
      prev.map(section => {
        if (section.id === id) {
          if (section.isEditing) {
            // Validate before saving
            if (!section.title.trim() || !section.content.trim()) {
              alert('Both title and content are required');
              return section;
            }
          }
          return { ...section, isEditing: !section.isEditing };
        }
        return section;
      })
    );
  };

  // Handle content change for a section
  const handlePrivacyPolicyChange = (id: any, value: any, field: any) => {
    setPrivacyPolicyContent(prev =>
      prev.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  // Add new section
  const handleAddSection = () => {
    if (!newSection.title.trim() || !newSection.content.trim()) {
      alert('Please enter both title and content for the new section');
      return;
    }

    const newId = `section${Date.now()}`;
    const newOrder = privacyPolicyContent.length + 1;

    const newSectionItem = {
      id: newId,
      title: newSection.title,
      content: newSection.content,
      isEditing: false,
      order: newOrder
    };

    setPrivacyPolicyContent(prev => [...prev, newSectionItem]);

    // Reset new section form
    setNewSection({
      title: '',
      content: '',
      isEditing: true
    });
  };

  // Delete a section
  const handleDeleteSection = (id: any) => {
    if (privacyPolicyContent.length <= 1) {
      alert('You must have at least one section');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this section?');
    if (!confirmDelete) return;

    setPrivacyPolicyContent(prev =>
      prev.filter(section => section.id !== id)
    );
  };

  // Move section up
  const handleMoveUp = (index: any) => {
    if (index === 0) return;

    setPrivacyPolicyContent(prev => {
      const newSections = [...prev];
      const temp = newSections[index];
      newSections[index] = newSections[index - 1];
      newSections[index - 1] = temp;

      // Update order numbers
      return newSections.map((section, idx) => ({
        ...section,
        order: idx + 1
      }));
    });
  };

  // Move section down
  const handleMoveDown = (index: any) => {
    if (index === privacyPolicyContent.length - 1) return;

    setPrivacyPolicyContent(prev => {
      const newSections = [...prev];
      const temp = newSections[index];
      newSections[index] = newSections[index + 1];
      newSections[index + 1] = temp;

      // Update order numbers
      return newSections.map((section, idx) => ({
        ...section,
        order: idx + 1
      }));
    });
  };

  // Save all changes
  const handleSaveAll = async () => {
    // Validate all sections
    const hasEmptySections = privacyPolicyContent.some(section =>
      !section.title.trim() || !section.content.trim()
    );

    if (hasEmptySections) {
      alert('Please fill in all section titles and content');
      return;
    }

    const dataToSave = {
      sections: privacyPolicyContent.map(({ isEditing, ...rest }) => rest),
      lastUpdated: new Date().toISOString()
    };

    try {
      // Example API call
      // const response = await fetch('/api/privacy-policy', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(dataToSave),
      // });

      console.log('Privacy Policy content to save:', dataToSave);
      alert('Privacy Policy saved successfully!');

      // Exit edit mode for all sections
      setPrivacyPolicyContent(prev =>
        prev.map(section => ({ ...section, isEditing: false }))
      );
    } catch (error) {
      console.error('Error saving privacy policy:', error);
      alert('Error saving privacy policy');
    }
  };

  // Reset to initial state
  const handleReset = () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset all changes? This action cannot be undone.'
    );

    if (confirmReset) {
      setPrivacyPolicyContent(initialSections);
      setNewSection({
        title: '',
        content: '',
        isEditing: true
      });
    }
  };

  // Toggle preview mode
  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  // Load saved data on component mount
  useEffect(() => {
    const fetchSavedData = async () => {
      try {
        // const response = await fetch('/api/privacy-policy');
        // const data = await response.json();
        // if (data && data.sections) {
        //   const sectionsWithEditState = data.sections.map(section => ({
        //     ...section,
        //     isEditing: false
        //   }));
        //   setPrivacyPolicyContent(sectionsWithEditState);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy Policy Content</h3>
            <p className="text-sm text-gray-600">Manage the content for the "Privacy Policy" page.</p>
          </div>


        </div>

        {/* Preview Mode */}
        {isPreviewMode ? (
          <div className="space-y-6 p-4 border border-gray-200 rounded-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy Policy</h2>
              <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-6">
              {privacyPolicyContent.map((item, index) => (
                <div key={item.id} className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {index + 1}. {item.title}
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Existing Sections */}
            <div className="space-y-4 mb-8">
              {privacyPolicyContent.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3 hover:border-purple-300 transition-colors">


                  {item.isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Title
                          <span className="text-xs text-gray-500 ml-1">({item.title.length}/100)</span>
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handlePrivacyPolicyChange(item.id, e.target.value, 'title')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter section title"
                          maxLength={100}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Content
                          <span className="text-xs text-gray-500 ml-1">({item.content.length}/2000)</span>
                        </label>
                        <Textarea
                          value={item.content}
                          onChange={(e) => handlePrivacyPolicyChange(item.id, e.target.value, 'content')}
                          className="min-h-[120px] w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter section content"
                          maxLength={2000}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-800 text-lg">{item.title}</h5>
                      <p className="text-gray-600 whitespace-pre-wrap">{item.content}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className='flex justify-center  w-full'>

                    </div>
                    <div className="flex items-center gap-2">

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(item.id)}
                        className="p-1.5 text-red-500 cursor-pointer hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Edit/Save buttons */}
                      {item.isEditing ? (
                        <div className="flex gap-2 justify-end w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePrivacyPolicyEditing(item.id)}
                            className="flex items-center gap-1 cursor-pointer text-gray-600"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => togglePrivacyPolicyEditing(item.id)}
                            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePrivacyPolicyEditing(item.id)}
                          className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>


              ))}


            </div>

            {/* Add New Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-8 hover:border-purple-400 transition-colors">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                Add New Section
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                    <span className="text-xs text-gray-500 ml-1">({newSection.title.length}/100)</span>
                  </label>
                  <input
                    type="text"
                    value={newSection.title}
                    onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Cookies and Tracking"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Content
                    <span className="text-xs text-gray-500 ml-1">({newSection.content.length}/2000)</span>
                  </label>
                  <Textarea
                    value={newSection.content}
                    onChange={(e) => setNewSection(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-[120px] w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter detailed content for this section..."
                    maxLength={2000}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleAddSection}
                    className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                    disabled={!newSection.title.trim() || !newSection.content.trim()}
                  >
                    <Plus className="w-4 h-4" />
                    Add Section
                  </Button>
                </div>
              </div>
            </div>

            {/* Save All Button */}
            <div className="flex justify-end border-t border-gray-100 pt-6">
              <Button
                onClick={handleSaveAll}
                className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2 px-8"
                size="lg"
              >
                <Save className="w-5 h-5" />
                Save All Changes
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;