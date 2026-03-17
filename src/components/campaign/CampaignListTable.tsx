"use client";
import { AlertCircle, Copy, Eye, Pencil, Search, Trash2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useDeleteCampaignMutation, useDuplicateCampaignMutation, useGetCampaignQuery } from '../../features/campaign/campaignApi';
import { CustomLoading } from '../../hooks/CustomLoading';
import DeleteConfirmationDialog from "../confirmation/deleteConfirmationDialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AlertModal from './AlertModal';
import CampaignViewEditModal from "./CampaignViewEditModal";

// Interface matching API response
// Interface matching API response
// Interface matching API response
interface Campaign {
  _id: string;
  organization_name: string;
  title: string;
  organization_website: string;
  startDate: string;
  endDate: string;
  targetAmount: number;
  campaignStatus: string;
  overall_raised?: number;
  description?: string;
  address?: string;
  donor_name?: string;
  createdBy?: string;
  total_invitees?: number;
  organization_type?: string;
  organization_taxId?: string;
  organization_address?: string;
  contactPerson_name?: string;
  contactPerson_email?: string;
  contactPerson_phone?: string;
  cause_title?: string;
  cause_description?: string;
  cause_mission?: string;
  cause_image?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
function CampaignListTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
  // Stores the campaign row data that was clicked, used as immediate modal fallback
  const [selectedModalCampaign, setSelectedModalCampaign] = useState<Campaign | null>(null);

  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedCampaign2, setSelectedCampaign2] = useState<Campaign | null>(null);
  // orderedIds: tracks the desired display order after duplication.
  // Each entry is an explicit campaign ID positioned by the user action.
  const [orderedIds, setOrderedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("campaign_ordered_ids");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse orderedIds from localStorage", e);
        }
      }
    }
    return [];
  });

  // Save orderedIds to localStorage whenever it changes
  useEffect(() => {
    if (orderedIds.length > 0) {
      localStorage.setItem("campaign_ordered_ids", JSON.stringify(orderedIds));
    }
  }, [orderedIds]);

  // Fetch campaigns with search query
  const { data: campaignsResponse, isLoading, refetch } = useGetCampaignQuery(searchQuery || undefined);

  // Get campaigns from API response
  const apiCampaigns: Campaign[] = campaignsResponse?.data?.result || [];

  // Find the detailed campaign data from the list using the ID
  const activeDetailedCampaign = apiCampaigns.find(c => c._id === campaignId) || selectedModalCampaign;

  const [duplicateCampaign, { isLoading: isDuplicating }] = useDuplicateCampaignMutation();


  const [deleteCampaign] = useDeleteCampaignMutation();

  // const [updateCampaign] = useUpdateCampaignMutation();


  // Convert API response to UI format (preserving all fields for the modal fallback)
  const transformCampaigns = (apiCampaigns: Campaign[]) => {
    return apiCampaigns.map(campaign => ({
      ...campaign,
      organization_name: campaign.organization_name || "N/A",
      title: campaign.title || "Untitled Campaign",
      organization_website: campaign.organization_website || "",
      startDate: campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "N/A",
      endDate: campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "N/A",
      targetAmount: campaign.targetAmount || 0,
      campaignStatus: campaign.campaignStatus || "draft",
      overall_raised: campaign.overall_raised || 0,
      description: campaign.description || "",
    }));
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== "") {
        refetch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, refetch]);

  // Get campaigns from API response
  // const apiCampaigns = campaignsResponse?.data?.result || [];
  const transformedCampaigns = transformCampaigns(apiCampaigns);

  // orderedCampaigns: if we have an explicit orderedIds list (set after a duplicate),
  // reorder the transformed campaigns to match it. Any IDs not in orderedIds are
  // appended at the end in their original API order.
  const orderedCampaigns = (() => {
    if (orderedIds.length === 0) return transformedCampaigns;

    const idMap = new Map(transformedCampaigns.map((c) => [c._id, c]));
    const ordered: typeof transformedCampaigns = [];
    const seen = new Set<string>();

    for (const id of orderedIds) {
      const c = idMap.get(id);
      if (c) {
        ordered.push(c);
        seen.add(id);
      }
    }
    // Append any campaigns from the API that aren't in our ordered list
    for (const c of transformedCampaigns) {
      if (!seen.has(c._id)) {
        ordered.push(c);
      }
    }
    return ordered;
  })();

  // Returns true if the campaign title contains "(Copy)" — used to hide the
  // duplicate button on already-copied rows.
  const isCopyTitle = (title: string) => /\(Copy\)/i.test(title);

  // Get meta data for pagination
  const meta = campaignsResponse?.data?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1
  };

  const filteredCampaigns = orderedCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.organization_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      campaign.campaignStatus.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Format amount to currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle delete click
  const handleDeleteClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCampaign) {
      setIsDeleting(true);
      try {
        const response = await deleteCampaign(selectedCampaign._id).unwrap();
        toast.success(response.message || "Campaign deleted successfully!");
        // Refetch campaigns after deletion
        refetch();
      } catch (error) {
        console.error('Error deleting campaign:', error);
      } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setSelectedCampaign(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedCampaign(null);
  };

  // Handle view click - store the row data immediately so the modal has something
  // to display while the single-campaign API fetch is in flight.
  const handleViewClick = (campaign: Campaign) => {
    setSelectedModalCampaign(campaign);
    setCampaignId(campaign._id);
    setModalMode("view");
    setIsViewEditModalOpen(true);
  };

  const router = useRouter();
  const handleAddCampaign = () => {
    router.push("/campaigns/new-campaign");
  };


  const handleCloseAlertModal = () => {
    setIsAlertModalOpen(false);
    setSelectedCampaign(null);
  };

  // Handle edit click - store the row data immediately so the modal has something
  // to display while the single-campaign API fetch is in flight.
  const handleEditClick = (campaign: Campaign) => {
    setSelectedModalCampaign(campaign);
    setCampaignId(campaign._id);
    setModalMode("edit");
    setIsViewEditModalOpen(true);
  };

  const handleCloseViewEditModal = () => {
    setIsViewEditModalOpen(false);
    setSelectedModalCampaign(null);
    setCampaignId(null);
  };

  const handleSetAlert = (campaign: Campaign) => {
    setSelectedCampaign2(campaign);
    setIsAlertModalOpen(true);
  };

  const handleDuplicateClick = async (campaign: Campaign) => {
    try {
      const res = await duplicateCampaign(campaign._id).unwrap();
      toast.success(res?.message || "Campaign duplicated successfully!");
      // Build the new ordered list: insert the new copy ID right after the original.
      // We get the new campaign id from the API response if available.
      const newCampaignId: string | undefined = res?.data?._id || res?._id;
      await refetch();
      if (newCampaignId) {
        setOrderedIds((prev) => {
          // Start from the current display order
          const currentIds = prev.length > 0
            ? prev
            : transformedCampaigns.map((c) => c._id);
          const origIdx = currentIds.indexOf(campaign._id);
          const next = [...currentIds];
          // Insert new copy ID right after original (remove it first if somehow present)
          const existingIdx = next.indexOf(newCampaignId);
          if (existingIdx !== -1) next.splice(existingIdx, 1);
          next.splice(origIdx === -1 ? next.length : origIdx + 1, 0, newCampaignId);
          return next;
        });
      }
    } catch (err: unknown) {
      let msg = "Failed to duplicate campaign";
      if (typeof err === "object" && err !== null && "data" in err) {
        const e = err as { data?: { message?: string } };
        msg = e.data?.message || msg;
      }
      toast.error(msg);
    }
  };


  // Pagination logic
  const itemsPerPage = meta.limit || 10;
  const totalItems = meta.total || filteredCampaigns.length;
  const totalPages = meta.totalPage || Math.ceil(totalItems / itemsPerPage);

  // Get paginated campaigns (client-side for now)
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <CustomLoading />
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-white p-3 rounded">
      <div className='flex justify-end pb-2'>
        <button className='bg-purple-600 text-white px-4 cursor-pointer py-1.5 text-sm rounded-sm shadow' onClick={handleAddCampaign}>Add Campaign</button>
      </div>
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaign List</h1>
          {meta.total > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} campaigns
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 border-gray-300"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 border-gray-300">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="active">Status: Active</SelectItem>
              <SelectItem value="upcoming">Status: Upcoming</SelectItem>
              <SelectItem value="completed">Status: Completed</SelectItem>
              <SelectItem value="draft">Status: Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-50 hover:bg-purple-50">
              <TableHead className="text-gray-700 font-semibold">
                Organization Name
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Campaign Name
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Website URL
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Start Date
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                End Date
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Target Amount
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCampaigns.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  {searchQuery || statusFilter !== "all"
                    ? "No campaigns match your search criteria"
                    : "No campaigns found"}
                </TableCell>
              </TableRow>
            ) : (
              paginatedCampaigns.map((campaign) => (
                <TableRow
                  key={campaign._id}
                  className="bg-white hover:bg-gray-50"
                >
                  <TableCell className="font-medium">
                    {campaign.organization_name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {campaign.title}
                  </TableCell>
                  <TableCell>
                    {campaign.organization_website ? (
                      <a
                        href={campaign.organization_website.startsWith('http')
                          ? campaign.organization_website
                          : `https://${campaign.organization_website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 hover:underline"
                      >
                        {campaign.organization_website}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </TableCell>
                  <TableCell>{campaign.startDate}</TableCell>
                  <TableCell>{campaign.endDate}</TableCell>
                  <TableCell>{formatCurrency(campaign.targetAmount)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.campaignStatus === 'active'
                      ? 'bg-green-100 text-green-800'
                      : campaign.campaignStatus === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : campaign.campaignStatus === 'upcoming'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                      {campaign.campaignStatus.charAt(0).toUpperCase() + campaign.campaignStatus.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700 rounded-full"
                        onClick={() => handleViewClick(campaign)}
                        title="View Campaign"
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700 rounded-full"
                        onClick={() => handleDeleteClick(campaign)}
                        title="Delete Campaign"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600 rounded-full"
                        onClick={() => handleEditClick(campaign)}
                        title="Edit Campaign"
                      >
                        <Pencil className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white border border-red-300 rounded-full"
                        onClick={() => handleSetAlert(campaign)}
                      >
                        <AlertCircle className="h-4 w-4" />

                      </Button>
                      {!isCopyTitle(campaign.title) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white border border-green-300 rounded-full"
                          onClick={() => handleDuplicateClick(campaign)}
                          disabled={isDuplicating}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            className="px-4 py-2 border-gray-300 text-gray-700 disabled:opacity-50 rounded-lg"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  className={`px-4 py-2 rounded-lg ${currentPage === pageNum
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
                    }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 text-gray-700">...</span>
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="default"
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 rounded-lg"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          >
            Next &gt;
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Campaign"
        itemName={selectedCampaign?.title}
        itemType="campaign"
        isLoading={isDeleting}
        confirmButtonText="Delete Campaign"
        cancelButtonText="Cancel"
        variant="destructive"
      />

      {/* View/Edit Campaign Modal */}
      {/* Prefer the detailed single-campaign response; fall back to the
          row data (selectedModalCampaign) so the modal is never blank. */}
      <CampaignViewEditModal
        isOpen={isViewEditModalOpen}
        onClose={handleCloseViewEditModal}
        campaign={activeDetailedCampaign as Parameters<typeof CampaignViewEditModal>[0]['campaign']}
        mode={modalMode}
        onSuccess={() => {
          refetch();
        }}
      />
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={handleCloseAlertModal}
        campaign={selectedCampaign2 || undefined}
      />
    </div>
  );
}

export default CampaignListTable;
