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
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Search, AlertCircle } from "lucide-react";
import AlertModal from "./AlertModal";

interface Campaign {
  id: string;
  campaignName: string;
  donorsCount: number;
  inviteCount: number;
  amount: string;
  startDate: string;
  status: "Active" | "Upcoming" | "Completed" | "Closed";
  totalRaised: string;
  target: string;
  progress: number;
}

const campaigns: Campaign[] = [
  {
    id: "1",
    campaignName: "Rise Beyond Trafficking",
    donorsCount: 224,
    inviteCount: 224,
    amount: "$200.00",
    startDate: "12-12-2025",
    status: "Active",
    totalRaised: "$88,000.00",
    target: "$100,000.00",
    progress: 22,
  },
  {
    id: "2",
    campaignName: "Rise Beyond Trafficking",
    donorsCount: 23,
    inviteCount: 23,
    amount: "$200.00",
    startDate: "12-12-2025",
    status: "Active",
    totalRaised: "$13,000.00",
    target: "$100,000.00",
    progress: 88,
  },
  {
    id: "3",
    campaignName: "Rise Beyond Trafficking",
    donorsCount: 43,
    inviteCount: 43,
    amount: "$200.00",
    startDate: "12-12-2025",
    status: "Closed",
    totalRaised: "$22,000.00",
    target: "$100,000.00",
    progress: 13,
  },
  {
    id: "4",
    campaignName: "Rise Beyond Trafficking",
    donorsCount: 224,
    inviteCount: 224,
    amount: "$200.00",
    startDate: "12-12-2025",
    status: "Upcoming",
    totalRaised: "$88,000.00",
    target: "$100,000.00",
    progress: 0,
  },
  {
    id: "5",
    campaignName: "Rise Beyond Trafficking",
    donorsCount: 23,
    inviteCount: 23,
    amount: "$200.00",
    startDate: "12-12-2025",
    status: "Completed",
    totalRaised: "$100,000.00",
    target: "$100,000.00",
    progress: 100,
  },
];

function ExistingCampaignDetailsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.campaignName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSetAlert = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsAlertModalOpen(true);
  };

  const handleCloseAlertModal = () => {
    setIsAlertModalOpen(false);
    setSelectedCampaign(null);
  };

  const getStatusBadge = (status: Campaign["status"]) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
            Active
          </Badge>
        );
      case "Upcoming":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
            Upcoming
          </Badge>
        );
      case "Completed":
        return (
          <Badge className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100">
            Completed
          </Badge>
        );
      case "Closed":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
            Closed
          </Badge>
        );
      default:
        return null;
    }
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
        <h1 className="text-2xl font-bold text-gray-900">
          Existing Campaign Details
        </h1>
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
              <SelectItem value="Closed">Status: Closed</SelectItem>
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
                Campaign Name
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Donors Count
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Invite Count
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Amount
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Start Date
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Total Raised
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Target
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Campaign Progress
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
                  colSpan={10}
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
                    {campaign.campaignName}
                  </TableCell>
                  <TableCell>{campaign.donorsCount}</TableCell>
                  <TableCell>{campaign.inviteCount}</TableCell>
                  <TableCell>{campaign.amount}</TableCell>
                  <TableCell>{campaign.startDate}</TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell>{campaign.totalRaised}</TableCell>
                  <TableCell>{campaign.target}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <span className="text-sm font-medium text-gray-700">
                        {campaign.progress}%
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 transition-all"
                          style={{ width: `${campaign.progress}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white border border-red-300"
                      onClick={() => handleSetAlert(campaign)}
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Set Alert
                    </Button>
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

      {/* Alert Modal */}
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={handleCloseAlertModal}
        campaignName={selectedCampaign?.campaignName}
        donorCount={selectedCampaign?.donorsCount}
        inviteesNumber={selectedCampaign?.inviteCount}
        raisedAmount={selectedCampaign?.totalRaised}
        startDate={selectedCampaign?.startDate}
      />
    </div>
  );
}

export default ExistingCampaignDetailsTable;
