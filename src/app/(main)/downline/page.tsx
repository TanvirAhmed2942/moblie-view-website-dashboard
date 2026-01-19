"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useCreateDownlineMutation, useDeleteDownlineMutation, useGetDownlineQuery, useUpdateDownlineMutation } from '../../../features/downline/downlineApi';


interface LevelContent {
  _id?: string;
  level: string; // Changed from number to string to match API format (L1, L2, etc.)
  title: string;
  description: string;
  benefits: string;
  targetInvitation: number;
  targetDonation: number;
  targetRaising: number;
}

const DownlineContentTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<LevelContent | null>(null);
  const [contents, setContents] = useState<LevelContent[]>([]);

  // Form state
  const [selectedLevel, setSelectedLevel] = useState<string>("L1");
  const [currentContent, setCurrentContent] = useState<LevelContent>({
    level: "L1",
    title: "",
    description: "",
    benefits: "",
    targetInvitation: 0,
    targetDonation: 0,
    targetRaising: 0,
  });

  // Use the correct API hooks
  const { data: apiData, isLoading: isLoadingGet, refetch } = useGetDownlineQuery({});
  const [createDownlineMutation, { isLoading: isLoadingCreate }] = useCreateDownlineMutation();
  const [updateDownlineMutation, { isLoading: isLoadingUpdate }] = useUpdateDownlineMutation();
  const [deleteDownlineMutation, { isLoading: isLoadingDelete }] = useDeleteDownlineMutation();

  // Level options
  const levelOptions = [
    { value: "L1", label: "Level 1", levelNum: 1 },
    { value: "L2", label: "Level 2", levelNum: 2 },
    { value: "L3", label: "Level 3", levelNum: 3 },
    { value: "L4", label: "Level 4", levelNum: 4 },
    { value: "L5", label: "Level 5", levelNum: 5 },
  ];

  // Load initial data from API
  useEffect(() => {
    if (apiData?.success && apiData?.data) {
      const formattedContents = apiData.data.map((level: any) => ({
        _id: level._id,
        level: level.level,
        title: level.title || "",
        description: level.description || "",
        benefits: level.benefits || "",
        targetInvitation: level.targetInvitation || 0,
        targetDonation: level.targetDonation || 0,
        targetRaising: level.targetRaising || 0,
      }));
      setContents(formattedContents);
    }
  }, [apiData]);

  // Handle form input changes
  const handleInputChange = (field: keyof LevelContent, value: string) => {
    setCurrentContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle number input changes
  const handleNumberInput = (field: keyof LevelContent, value: string) => {
    const cleanedValue = value.replace(/[^0-9]/g, '');
    const numValue = cleanedValue ? parseInt(cleanedValue, 10) : 0;
    setCurrentContent(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  // Handle level selection change
  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    setCurrentContent(prev => ({
      ...prev,
      level: value
    }));
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Create new content
  const handleCreateContent = async () => {
    try {
      const payload = {
        level: currentContent.level,
        title: currentContent.title,
        description: currentContent.description,
        benefits: currentContent.benefits,
        targetInvitation: currentContent.targetInvitation,
        targetDonation: currentContent.targetDonation,
        targetRaising: currentContent.targetRaising,
      };

      const response = await createDownlineMutation(payload).unwrap();

      if (response.success) {
        refetch();

        // Reset form and close modal
        setCurrentContent({
          level: "L1",
          title: "",
          description: "",
          benefits: "",
          targetInvitation: 0,
          targetDonation: 0,
          targetRaising: 0,
        });
        setSelectedLevel("L1");
        setIsModalOpen(false);

        // toast.success(response.message || 'Content created successfully');
      }
    } catch (error) {
      console.error('Error creating content:', error);
      // toast.error('Error creating content');
    }
  };

  // Edit content
  const handleEdit = (content: LevelContent) => {
    setEditingContent(content);
    setCurrentContent(content);
    setSelectedLevel(content.level);
    setIsModalOpen(true);
  };

  // Update content
  const handleUpdateContent = async () => {
    if (!editingContent || !editingContent._id) return;

    try {
      const payload = {
        level: currentContent.level,
        title: currentContent.title,
        description: currentContent.description,
        benefits: currentContent.benefits,
        targetInvitation: currentContent.targetInvitation,
        targetDonation: currentContent.targetDonation,
        targetRaising: currentContent.targetRaising,
      };

      const response = await updateDownlineMutation({
        id: editingContent._id,
        data: payload
      }).unwrap();

      if (response.success) {
        refetch();

        // Reset and close
        setEditingContent(null);
        setCurrentContent({
          level: "L1",
          title: "",
          description: "",
          benefits: "",
          targetInvitation: 0,
          targetDonation: 0,
          targetRaising: 0,
        });
        setSelectedLevel("L1");
        setIsModalOpen(false);

        // toast.success(response.message || 'Content updated successfully');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      // toast.error('Error updating content');
    }
  };

  // Delete content
  const handleDelete = async (id: string) => {

    try {
      const response = await deleteDownlineMutation(id).unwrap();
      if (response.success) {
        refetch();
        toast.success(response.message || 'Content deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      // toast.error('Error deleting content');
    }

  };

  // Get level number from level string (L1 -> 1)
  const getLevelNumber = (level: string): number => {
    return parseInt(level.replace('L', ''), 10);
  };

  const isLoading = isLoadingCreate || isLoadingUpdate || isLoadingDelete;

  return (
    <div className="">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Downline Content Management</h1>
          <p className="text-gray-600">Manage your downline content levels</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => {
                setEditingContent(null);
                setCurrentContent({
                  level: "L1",
                  title: "",
                  description: "",
                  benefits: "",
                  targetInvitation: 0,
                  targetDonation: 0,
                  targetRaising: 0,
                });
                setSelectedLevel("L1");
              }}
            >
              Create Downline Content
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? 'Edit Downline Content' : 'Create New Downline Content'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Level Selection */}
              <div className="grid grid-cols-2 gap-6">
                <div className='space-y-2'>
                  <Label htmlFor="level">Select Level</Label>
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

                <div className='space-y-2'>
                  <Label htmlFor="title">
                    Title
                    <span className="text-xs text-gray-500 ml-1">
                      ({currentContent.title?.length || 0}/100)
                    </span>
                  </Label>
                  <Input
                    id="title"
                    value={currentContent.title || ""}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Bronze Supporter"
                    className="bg-purple-50 border-0 focus:ring-2 focus:ring-purple-500"
                    maxLength={100}
                  />
                </div>
              </div>

              {/* Description, Benefits, Target Invitation */}
              <div className="grid grid-cols-3 gap-6">
                <div className='space-y-2'>
                  <Label htmlFor="description">
                    Description
                    <span className="text-xs text-gray-500 ml-1">
                      ({currentContent.description?.length || 0}/500)
                    </span>
                  </Label>
                  <Textarea
                    id="description"
                    value={currentContent.description || ""}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Entry-level support tier for new contributors."
                    className="bg-purple-50 border-0 h-20 focus:ring-2 focus:ring-purple-500"
                    maxLength={500}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor="benefits">
                    Benefits
                    <span className="text-xs text-gray-500 ml-1">
                      ({currentContent.benefits?.length || 0}/500)
                    </span>
                  </Label>
                  <Textarea
                    id="benefits"
                    value={currentContent.benefits || ""}
                    onChange={(e) => handleInputChange('benefits', e.target.value)}
                    placeholder="Newsletter access, supporter badge"
                    className="bg-purple-50 border-0 h-20 focus:ring-2 focus:ring-purple-500"
                    maxLength={500}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor="targetInvitation">
                    Target Invitation
                  </Label>
                  <Input
                    id="targetInvitation"
                    value={currentContent.targetInvitation || ""}
                    onChange={(e) => handleNumberInput('targetInvitation', e.target.value)}
                    placeholder="50"
                    className="bg-purple-50 border-0 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Target Donation and Fund Raising */}
              <div className="grid grid-cols-2 gap-6">
                <div className='space-y-2'>
                  <Label htmlFor="targetDonation">Target Donation</Label>
                  <Input
                    id="targetDonation"
                    value={currentContent.targetDonation || ""}
                    onChange={(e) => handleNumberInput('targetDonation', e.target.value)}
                    placeholder="500"
                    className="bg-purple-50 border-0 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor="targetRaising">Target Fund Raising</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="targetRaising"
                      value={currentContent.targetRaising || ""}
                      onChange={(e) => handleNumberInput('targetRaising', e.target.value)}
                      placeholder="1000"
                      className="pl-8 bg-purple-50 border-0 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={editingContent ? handleUpdateContent : handleCreateContent}
                  disabled={!currentContent.title?.trim() || isLoading}
                >
                  {isLoading
                    ? 'Saving...'
                    : editingContent
                      ? 'Update Content'
                      : 'Create Content'
                  }
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading state */}
      {isLoadingGet && (
        <div className="text-center py-8 text-gray-500">
          Loading data...
        </div>
      )}

      {/* Content Table */}
      {!isLoadingGet && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Level</TableHead>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Benefits</TableHead>
                <TableHead className="font-semibold">Target Invitation</TableHead>
                <TableHead className="font-semibold">Target Donation</TableHead>
                <TableHead className="font-semibold">Target Fund Raising</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No content found. Click &quot;Create Downline Content&quot; to add new content.
                  </TableCell>
                </TableRow>
              ) : (
                contents.map((content) => (
                  <TableRow key={content._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        Level {getLevelNumber(content.level)}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{content.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{content.description}</TableCell>
                    <TableCell className="max-w-xs truncate">{content.benefits}</TableCell>
                    <TableCell>{content.targetInvitation}</TableCell>
                    <TableCell>{content.targetDonation}</TableCell>
                    <TableCell>${formatCurrency(content.targetRaising)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(content)}
                          className="h-8 w-8 p-0 hover:bg-purple-50"
                        >
                          <Pencil className="h-4 w-4 text-purple-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => content._id && handleDelete(content._id)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DownlineContentTable;