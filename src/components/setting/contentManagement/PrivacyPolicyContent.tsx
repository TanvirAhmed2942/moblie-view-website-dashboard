import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Edit2, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  useAllPrivacyQuery,
  useCreatePrivacyMutation,
  useDeletePrivacyMutation,
  useUpdatePrivacyMutation
} from "../../../features/privacy/privacyApi";

// Define the type for a privacy policy section based on your API
interface PrivacyPolicySection {
  _id: string;
  type: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  isEditing?: boolean; // Frontend-only state for editing
  order?: number; // Frontend-only state for ordering
}

const PrivacyPolicyContent = () => {
  // 1. Fetch all privacy policies from the API
  const {
    data: apiResponse,
    isLoading: isFetching,
    refetch // Function to refetch data after mutations
  } = useAllPrivacyQuery({});

  // 2. API mutation hooks
  const [createPrivacy, { isLoading: isCreating }] = useCreatePrivacyMutation();
  const [updatePrivacy, { isLoading: isUpdating }] = useUpdatePrivacyMutation();
  const [deletePrivacy, { isLoading: isDeleting }] = useDeletePrivacyMutation();

  // 3. State for privacy policy sections - initialized from API
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState<PrivacyPolicySection[]>([]);

  // 4. State for adding a new section
  const [newSection, setNewSection] = useState({
    title: '',
    content: '',
    isEditing: true
  });

  // 5. State for preview mode
  const [isPreviewMode] = useState(false);

  // 6. Loading and error state
  const isLoading = isFetching || isCreating || isUpdating || isDeleting;

  // Load API data into state when it's fetched
  useEffect(() => {
    if (apiResponse?.success && apiResponse.data) {
      // Transform API data to include frontend-only properties
      const sectionsWithEditState: PrivacyPolicySection[] = apiResponse.data.map((section: PrivacyPolicySection, index: number) => ({
        ...section,
        isEditing: false,
        order: index + 1 // Use array index for ordering
      }));

      setPrivacyPolicyContent(sectionsWithEditState);
    }
  }, [apiResponse]);

  // Toggle edit mode for a section
  const togglePrivacyPolicyEditing = (id: string) => {
    setPrivacyPolicyContent(prev =>
      prev.map(section => {
        if (section._id === id) {
          // If we're toggling OFF edit mode, validate before saving
          if (section.isEditing) {
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
  const handlePrivacyPolicyChange = (id: string, value: string, field: 'title' | 'content') => {
    setPrivacyPolicyContent(prev =>
      prev.map(section =>
        section._id === id ? { ...section, [field]: value } : section
      )
    );
  };

  // Add new section - Calls CREATE API
  const handleAddSection = async () => {
    if (!newSection.title.trim() || !newSection.content.trim()) {
      alert('Please enter both title and content for the new section');
      return;
    }

    const newSectionData = {
      type: 'privacy_policy', // Static field as per your API requirement
      title: newSection.title,
      content: newSection.content
    };

    try {
      const response = await createPrivacy(newSectionData).unwrap();

      // Reset new section form
      setNewSection({
        title: '',
        content: '',
        isEditing: true
      });
      // Refetch the updated list
      refetch();

      toast.success(response.message || 'Section added successfully!');
    } catch (error) {
      console.error('Error creating privacy policy:', error);
      toast.error('Error adding section. Please try again.');
    }
  };

  // Save an individual section - Calls UPDATE API
  const handleSaveSection = async (section: PrivacyPolicySection) => {
    if (!section.title.trim() || !section.content.trim()) {
      alert('Both title and content are required');
      return;
    }

    const updateData = {
      type: 'privacy_policy', // Static field as per your API requirement
      title: section.title,
      content: section.content
    };

    try {
      const response = await updatePrivacy({ data: updateData, id: section._id }).unwrap();
      togglePrivacyPolicyEditing(section._id); // Exit edit mode
      toast.success(response.message || 'Section updated successfully!');
    } catch (error) {
      console.error('Error updating privacy policy:', error);
      toast.error('Error updating section. Please try again.');
    }
  };

  // Delete a section - Calls DELETE API
  const handleDeleteSection = async (id: string) => {
    if (privacyPolicyContent.length <= 1) {
      toast.error('You must have at least one section');
      return;
    }


    try {
      await deletePrivacy(id).unwrap();
      refetch(); // Refetch the updated list
      toast.success('Section deleted successfully!');
    } catch (error) {
      console.error('Error deleting privacy policy:', error);
      toast.error('Error deleting section. Please try again.');
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy Policy Content</h3>
            <p className="text-sm text-gray-600">Manage the content for the &quot;Privacy Policy&quot; page.</p>
            {apiResponse?.data && (
              <p className="text-xs text-gray-500 mt-1">
                {apiResponse.data.length} section(s) loaded
              </p>
            )}
          </div>

        </div>

        {/* Preview Mode */}
        {isPreviewMode ? (
          <div className="space-y-6 p-4 border border-gray-200 rounded-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy Policy</h2>
              <p className="text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-6">
              {privacyPolicyContent.map((item) => (
                <div key={item._id} className="space-y-3">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {item.content}
                  </p>
                  {item.updatedAt && (
                    <p className="text-xs text-gray-500">
                      Last updated: {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Existing Sections from API */}
            <div className="space-y-4 mb-8">
              {privacyPolicyContent.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-lg p-4 space-y-3 hover:border-purple-300 transition-colors">
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
                          onChange={(e) => handlePrivacyPolicyChange(item._id, e.target.value, 'title')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter section title"
                          maxLength={100}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Content
                          <span className="text-xs text-gray-500 ml-1">({item.content.length}/2000)</span>
                        </label>
                        <Textarea
                          value={item.content}
                          onChange={(e) => handlePrivacyPolicyChange(item._id, e.target.value, 'content')}
                          className="min-h-[120px] w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="Enter section content"
                          maxLength={2000}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <h5 className="font-medium text-gray-800 text-lg">{item.title}</h5>
                        <p className="text-gray-600 whitespace-pre-wrap">{item.content}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex justify-center w-full"></div>
                    <div className="flex items-center gap-2">
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(item._id)}
                        disabled={isLoading}
                        className="p-1.5 text-red-500 cursor-pointer hover:text-red-700 hover:bg-red-50 rounded disabled:text-gray-300 disabled:cursor-not-allowed"
                        title="Delete section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Edit/Save buttons */}
                      {item.isEditing ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePrivacyPolicyEditing(item._id)}
                            className="flex items-center gap-1 cursor-pointer text-gray-600"
                            disabled={isLoading}
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveSection(item)}
                            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1"
                            disabled={isLoading}
                          >
                            {isUpdating ? (
                              <span className="flex items-center">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                Saving...
                              </span>
                            ) : (
                              <>
                                <Check className="w-4 h-4" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePrivacyPolicyEditing(item._id)}
                          className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
                          disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleAddSection}
                    className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                    disabled={!newSection.title.trim() || !newSection.content.trim() || isLoading}
                  >
                    {isCreating ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </span>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add Section
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Save All Button */}
            <div className="flex justify-between border-t border-gray-100 pt-6">
              <div className="text-sm text-gray-500">
                {isLoading && (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600 mr-2"></div>
                    Processing...
                  </span>
                )}
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicyContent;