"use client";
import { Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetDonorDetailsQuery, useGetDonorQuery } from "../../features/donor/donorApi";
import { Badge } from "../ui/badge";
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
import SeeDonorProfileModal, { DonorProfileData } from "./SeeDonorProfileModal";

// API Response Types
interface ApiUser {
  _id: string;
  name: string;
  role: string;
  contact: string;
  image: string;
  status: "active" | "inactive";
  verified: boolean;
  isDeleted: boolean;
  stripeCustomerId: string;
  userLevel: string;
  totalRaised: number;
  totalDonated: number;
  totalInvited: number;
  createdAt: string;
  updatedAt: string;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Helper function to mask phone number
const maskPhoneNumber = (phone: string) => {
  if (!phone || phone.length <= 4) return phone || "N/A";
  const lastFour = phone.slice(-4);
  return `+***${lastFour}`;
};

function SeedDonorListTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState<string | null>(null);
  const [donationPage, setDonationPage] = useState(1);
  const [inviteePage, setInviteePage] = useState(1);

  // Fetch donors with pagination
  const { data: donorsData, isLoading, isError, refetch } = useGetDonorQuery(currentPage);

  // Fetch donor details when selected - now with pagination parameters
  const {
    data: singleDonorData,
    isLoading: isLoadingDetails,
    refetch: refetchDonorDetails
  } = useGetDonorDetailsQuery(
    {
      id: selectedDonorId,
      page: donationPage,
      iPage: inviteePage
    },
    {
      skip: !selectedDonorId
    }
  );

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const handleViewProfile = (donorId: string) => {
    setSelectedDonorId(donorId);
    // Reset pagination when viewing new donor
    setDonationPage(1);
    setInviteePage(1);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDonorId(null);
    // Reset pagination when closing modal
    setDonationPage(1);
    setInviteePage(1);
  };

  // Open modal when donor details are loaded
  useEffect(() => {
    if (singleDonorData?.data && selectedDonorId) {
      setIsModalOpen(true);
    }
  }, [singleDonorData, selectedDonorId]);

  // Handle pagination changes from modal
  const handleDonationPageChange = (newPage: number) => {
    setDonationPage(newPage);
  };

  const handleInviteePageChange = (newPage: number) => {
    setInviteePage(newPage);
  };

  // Convert API response to DonorProfileData for modal
  const getDonorProfileData = (): DonorProfileData | null => {
    if (!singleDonorData?.data?.user) return null;

    const user = singleDonorData.data.user;
    const transactions = singleDonorData.data.transactions?.result || [];

    // Get latest donation date from transactions
    const latestDonation = transactions.length > 0
      ? transactions.reduce((latest, current) =>
        new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
      )
      : null;

    return {
      id: user._id,
      name: user.name,
      status: user.status === "active" ? "Active" : "Inactive",
      orgName: "PassitAlong",
      orgType: "Non-Profit Platform",
      totalDonations: `$${user.totalDonated}`,
      totalRaised: `$${user.totalRaised}`,
      totalInvited: user.totalInvited,
      joinDate: formatDate(user.createdAt),
      latestDonationDate: latestDonation ? formatDate(latestDonation.createdAt) : "No donations yet",
      contact: maskPhoneNumber(user.contact),
      userLevel: user.userLevel,
      verified: user.verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  };

  // Get filtered donors
  const getFilteredDonors = () => {
    if (!donorsData?.data?.result) return [];

    const donors = donorsData.data.result;

    return donors.filter((donor) => {
      const matchesSearch =
        donor.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        donor.contact?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
        donor._id?.toLowerCase()?.includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "Active" && donor.status === "active") ||
        (statusFilter === "Inactive" && donor.status === "inactive");

      return matchesSearch && matchesStatus;
    });
  };

  const filteredDonors = getFilteredDonors();
  const meta = donorsData?.data?.meta || { total: 0, page: 1, limit: 10, totalPage: 1 };

  // Calculate pagination values
  const showingEnd = Math.min(currentPage * meta.limit, meta.total);
  const totalPages = meta.totalPage;
  const totalFiltered = filteredDonors.length;
  const showingStart = totalFiltered > 0 ? ((currentPage - 1) * meta.limit) + 1 : 0;

  // Generate page buttons
  const renderPageButtons = () => {
    const buttons = [];

    if (totalPages === 0) return buttons;

    // Always show first page
    buttons.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "ghost"}
        className={`px-4 py-2 rounded-lg ${currentPage === 1
          ? "bg-purple-600 hover:bg-purple-700 text-white"
          : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
          }`}
        onClick={() => setCurrentPage(1)}
      >
        1
      </Button>
    );

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) {
      buttons.push(<span key="ellipsis1" className="px-2 text-gray-700">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "ghost"}
            className={`px-4 py-2 rounded-lg ${currentPage === i
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
              }`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </Button>
        );
      }
    }

    if (endPage < totalPages - 1) {
      buttons.push(<span key="ellipsis2" className="px-2 text-gray-700">...</span>);
    }

    // Always show last page if there is more than 1 page
    if (totalPages > 1) {
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "ghost"}
          className={`px-4 py-2 rounded-lg ${currentPage === totalPages
            ? "bg-purple-600 hover:bg-purple-700 text-white"
            : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
            }`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading donors...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load donors</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Donor List</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or phone..."
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
              <SelectItem value="Inactive">Status: Inactive</SelectItem>
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
                Campaign ID
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Phone Number
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Seed Donor Name
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Memo Amount
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Donation Date
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Ripple Level
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {donorsData?.data?.result?.length === 0
                    ? "No donors found"
                    : "No donors found matching your criteria"}
                </TableCell>
              </TableRow>
            ) : (
              filteredDonors.map((donor) => (
                <TableRow key={donor._id} className="bg-white hover:bg-gray-50">
                  <TableCell className="font-medium">{`Id${donor._id.slice(-4)}`}</TableCell>
                  <TableCell className="font-medium">{donor.contact}</TableCell>
                  <TableCell className="font-medium">{donor.name}</TableCell>
                  <TableCell>
                    {donor.status === "active" ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>${donor.totalDonated}</TableCell>
                  <TableCell>{formatDate(donor.createdAt)}</TableCell>
                  <TableCell>{donor.totalInvited}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700 rounded-full"
                      onClick={() => handleViewProfile(donor._id)}
                      disabled={isLoadingDetails && selectedDonorId === donor._id}
                    >
                      {isLoadingDetails && selectedDonorId === donor._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Eye className="h-4 w-4 text-white" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      {meta.total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {showingStart} to {showingEnd} of {meta.total} donors
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 border-gray-300 text-gray-700 disabled:opacity-50 rounded-lg"
            >
              &lt; Previous
            </Button>
            <div className="flex items-center gap-2">
              {renderPageButtons()}
            </div>
            <Button
              variant="default"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 rounded-lg"
            >
              Next &gt;
            </Button>
          </div>
        </div>
      )}

      {/* Donor Profile Modal */}
      <SeeDonorProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        donor={getDonorProfileData()}
        invitations={singleDonorData?.data?.invitationHistorys?.userInvita || []}
        transactions={singleDonorData?.data?.transactions?.result || []}
        invitationMeta={singleDonorData?.data?.invitationHistorys?.meta}
        transactionMeta={singleDonorData?.data?.transactions?.meta}
        onDonationPageChange={handleDonationPageChange}
        onInviteePageChange={handleInviteePageChange}
        currentDonationPage={donationPage}
        currentInviteePage={inviteePage}
        isLoadingDetails={isLoadingDetails}
      />
    </div>
  );
}

export default SeedDonorListTable;