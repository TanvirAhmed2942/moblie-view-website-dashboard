"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Search, Trash2, Eye, Pencil } from "lucide-react";
import DeleteConfirmationDialog from "../confirmation/deleteConfirmationDialog";
import CampaignViewEditModal, { CampaignData } from "./CampaignViewEditModal";

interface Campaign {
  id: string;
  organizationName: string;
  campaignName: string;
  websiteUrl: string;
  startDate: string;
  endDate: string;
  seedDonationAmount: string;
  status?: "Active" | "Upcoming" | "Completed" | "Draft";
}

const campaigns: Campaign[] = [
  {
    id: "1",
    organizationName: "Project Wellspring",
    campaignName: "Rise Beyond Trafficking",
    websiteUrl: "Www.Rippleeffect.Org",
    startDate: "12-12-2025",
    endDate: "12-12-2025",
    seedDonationAmount: "$10,000.00",
  },
  {
    id: "2",
    organizationName: "Project Wellspring",
    campaignName: "Rise Beyond Trafficking",
    websiteUrl: "Www.Rippleeffect.Org",
    startDate: "12-12-2025",
    endDate: "12-12-2025",
    seedDonationAmount: "$2,000.00",
  },
  {
    id: "3",
    organizationName: "Project Wellspring",
    campaignName: "Rise Beyond Trafficking",
    websiteUrl: "Www.Rippleeffect.Org",
    startDate: "12-12-2025",
    endDate: "12-12-2025",
    seedDonationAmount: "$11,000.00",
  },
  {
    id: "4",
    organizationName: "Project Wellspring",
    campaignName: "Rise Beyond Trafficking",
    websiteUrl: "Www.Rippleeffect.Org",
    startDate: "12-12-2025",
    endDate: "12-12-2025",
    seedDonationAmount: "$8,000.00",
  },
  {
    id: "5",
    organizationName: "Project Wellspring",
    campaignName: "Rise Beyond Trafficking",
    websiteUrl: "Www.Rippleeffect.Org",
    startDate: "12-12-2025",
    endDate: "12-12-2025",
    seedDonationAmount: "$1,000.00",
  },
];

function CampaignListTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
  const [viewEditCampaign, setViewEditCampaign] = useState<CampaignData | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.organizationName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (campaign.status && campaign.status === statusFilter);
    return matchesSearch && matchesStatus;
  });

  const handleDeleteClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCampaign) {
      setIsDeleting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Deleting campaign: ${selectedCampaign.campaignName}`);
      // Here you would typically make an API call to delete the campaign
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setSelectedCampaign(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedCampaign(null);
  };

  const handleViewClick = (campaign: Campaign) => {
    const campaignData: CampaignData = {
      id: campaign.id,
      organizationName: campaign.organizationName,
      campaignName: campaign.campaignName,
      websiteUrl: campaign.websiteUrl,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      seedDonationAmount: campaign.seedDonationAmount,
    };
    setViewEditCampaign(campaignData);
    setModalMode("view");
    setIsViewEditModalOpen(true);
  };

  const handleEditClick = (campaign: Campaign) => {
    const campaignData: CampaignData = {
      id: campaign.id,
      organizationName: campaign.organizationName,
      campaignName: campaign.campaignName,
      websiteUrl: campaign.websiteUrl,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      seedDonationAmount: campaign.seedDonationAmount,
    };
    setViewEditCampaign(campaignData);
    setModalMode("edit");
    setIsViewEditModalOpen(true);
  };

  const handleCloseViewEditModal = () => {
    setIsViewEditModalOpen(false);
    setViewEditCampaign(null);
  };

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Campaign List</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
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
              <SelectItem value="Active">Status: Active</SelectItem>
              <SelectItem value="Upcoming">Status: Upcoming</SelectItem>
              <SelectItem value="Completed">Status: Completed</SelectItem>
              <SelectItem value="Draft">Status: Draft</SelectItem>
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
                End Date
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Start Date
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Seed Donation Amount
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
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No campaigns found
                </TableCell>
              </TableRow>
            ) : (
              paginatedCampaigns.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  className="bg-white hover:bg-gray-50"
                >
                  <TableCell className="font-medium">
                    {campaign.organizationName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {campaign.campaignName}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://${campaign.websiteUrl.toLowerCase()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 hover:underline"
                    >
                      {campaign.websiteUrl}
                    </a>
                  </TableCell>
                  <TableCell>{campaign.endDate}</TableCell>
                  <TableCell>{campaign.startDate}</TableCell>
                  <TableCell>{campaign.seedDonationAmount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700 rounded-full"
                        onClick={() => handleViewClick(campaign)}
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700 rounded-full"
                        onClick={() => handleDeleteClick(campaign)}
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-orange-500 hover:bg-orange-600 rounded-full"
                        onClick={() => handleEditClick(campaign)}
                      >
                        <Pencil className="h-4 w-4 text-white" />
                      </Button>
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
            <Button
              variant={currentPage === 1 ? "default" : "ghost"}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
              }`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </Button>
            {totalPages > 1 && (
              <Button
                variant="ghost"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
                onClick={() => setCurrentPage(2)}
              >
                2
              </Button>
            )}
            {totalPages > 2 && (
              <Button
                variant="ghost"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
                onClick={() => setCurrentPage(3)}
              >
                3
              </Button>
            )}
            {totalPages > 3 && (
              <Button
                variant="ghost"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
                onClick={() => setCurrentPage(4)}
              >
                4
              </Button>
            )}
            {totalPages > 5 && (
              <>
                <span className="px-2 text-gray-700">...</span>
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
                  onClick={() => setCurrentPage(25)}
                >
                  25
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
        itemName={selectedCampaign?.campaignName}
        itemType="campaign"
        isLoading={isDeleting}
        confirmButtonText="Delete Campaign"
        cancelButtonText="Cancel"
        variant="destructive"
      />

      {/* View/Edit Campaign Modal */}
      <CampaignViewEditModal
        isOpen={isViewEditModalOpen}
        onClose={handleCloseViewEditModal}
        campaign={viewEditCampaign}
        mode={modalMode}
      />
    </div>
  );
}

export default CampaignListTable;
