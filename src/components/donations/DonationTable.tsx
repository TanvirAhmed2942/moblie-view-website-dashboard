"use client";
import { Eye, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetDonationsQuery, useGetSingleDonationsDetailsQuery } from "../../features/donations/donationsApi";
import { CustomLoading } from '../../hooks/CustomLoading';
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
import DonationDetailsModal, { DonationData } from "./DonationDetailsModal";

// API Response Types
interface Donor {
  _id: string;
  name: string;
  contact: string;
  image: string;
  userLevel: string;
  createdAt: string;
}

interface Campaign {
  _id: string;
  title: string;
}

interface Transaction {
  _id: string;
  donorId: Donor;
  donorPhone: string;
  paymentMethod: string;
  campaignTitle: string;
  transactionId: string;
  amountPaid: number;
  campaignId: Campaign;
  paymentStatus: "pending" | "completed" | "failed";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}



// Helper function to format date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return "Invalid Date";
  }
};

// Helper function to mask phone number
const maskPhoneNumber = (phone: string) => {
  if (!phone || phone.length <= 4) return phone || "N/A";
  const lastFour = phone.slice(-4);
  return `+***${lastFour}`;
};

// Format payment method
const formatPaymentMethod = (method: string) => {
  if (!method) return "Unknown";
  return method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
};

function DonationTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch donations with pagination
  const {
    data: donationsData,
    isLoading,
    isError,
    refetch
  } = useGetDonationsQuery(currentPage);

  // Fetch single donation details when selected
  const {
    data: singleDonationData,
    isLoading: isLoadingDetails
  } = useGetSingleDonationsDetailsQuery(
    selectedDonationId!,
    { skip: !selectedDonationId }
  );

  // Handle view details
  const handleViewDetails = useCallback((donationId: string) => {
    setSelectedDonationId(donationId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedDonationId(null);
  }, []);

  // Convert API response to DonationData for modal
  const getDonationDataForModal = useCallback((): DonationData | null => {
    if (!singleDonationData?.data) return null;

    const transaction = singleDonationData.data as Transaction;
    return {
      id: transaction._id,
      campaignId: transaction.campaignId._id,
      campaignName: transaction.campaignTitle || transaction.campaignId.title,
      donorPhoneNumber: transaction.donorPhone,
      donationAmount: `$${transaction.amountPaid.toFixed(2)}`,
      date: formatDate(transaction.createdAt),
      paymentStatus: transaction.paymentStatus === 'completed' ? 'Successful' :
        transaction.paymentStatus === 'pending' ? 'Pending' : 'Failed',
      paymentMethod: formatPaymentMethod(transaction.paymentMethod),
      transactionId: transaction.transactionId,
      donorId: transaction.donorId._id,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      amount: transaction.amountPaid
    };
  }, [singleDonationData]);

  // Get filtered donations with memoization
  const filteredDonations = useMemo(() => {
    if (!donationsData?.data?.result) return [];

    const transactions = donationsData.data.result;

    return transactions.filter((donation: Transaction) => {
      // Search filter
      const matchesSearch =
        debouncedSearchQuery === "" ||
        donation.campaignId?._id?.toLowerCase()?.includes(debouncedSearchQuery.toLowerCase()) ||
        donation.campaignTitle?.toLowerCase()?.includes(debouncedSearchQuery.toLowerCase()) ||
        donation.donorPhone?.toLowerCase()?.includes(debouncedSearchQuery.toLowerCase()) ||
        donation.transactionId?.toLowerCase()?.includes(debouncedSearchQuery.toLowerCase()) ||
        donation._id?.toLowerCase()?.includes(debouncedSearchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        donation.paymentStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [donationsData, debouncedSearchQuery, statusFilter]);

  const meta = donationsData?.data?.meta || { total: 0, page: 1, limit: 10, totalPage: 1 };

  // Calculate pagination values correctly
  const showingStart = meta.total > 0 ? ((currentPage - 1) * meta.limit) + 1 : 0;
  const showingEnd = Math.min(currentPage * meta.limit, meta.total);
  const totalPages = Math.max(1, meta.totalPage);

  const getStatusBadge = useCallback((status: string) => {
    const statusText = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    switch (status.toLowerCase()) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
            {statusText}
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
            {statusText}
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
            {statusText}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100">
            {statusText}
          </Badge>
        );
    }
  }, []);



  // Generate page buttons
  const renderPageButtons = useCallback(() => {
    const buttons: React.ReactNode[] = [];

    if (totalPages <= 1) return buttons;

    // Show first page
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

    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if near start
    if (currentPage <= 3) {
      endPage = Math.min(4, totalPages - 1);
    }

    // Adjust if near end
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      buttons.push(<span key="ellipsis1" className="px-2 text-gray-700">...</span>);
    }

    // Add middle pages
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

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      buttons.push(<span key="ellipsis2" className="px-2 text-gray-700">...</span>);
    }

    // Show last page
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

    return buttons;
  }, [currentPage, totalPages]);

  // Loading state
  if (isLoading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <CustomLoading />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load donations</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-3 bg-white/80 rounded">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Donations List</h1>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by ID, phone, or transaction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full border-gray-300"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40 border-gray-300">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="pending">Status: Pending</SelectItem>
              <SelectItem value="completed">Status: Completed</SelectItem>
              <SelectItem value="failed">Status: Failed</SelectItem>
            </SelectContent>
          </Select>
          {/* <Button
            onClick={handleExport}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 w-full md:w-auto"
          >
            <ArrowUp className="h-4 w-4 mr-2 rotate-45" />
            Export
          </Button> */}
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-50 hover:bg-purple-50">
              <TableHead className="text-gray-700 font-semibold">ID</TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Campaign ID
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Donor Phone Number
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Donation Amount
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Date
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Payment Method
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Payment Status
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {donationsData?.data?.result?.length === 0
                    ? "No donations found"
                    : "No donations found matching your criteria"}
                </TableCell>
              </TableRow>
            ) : (
              filteredDonations.map((donation: Transaction) => (
                <TableRow
                  key={donation._id}
                  className="bg-white hover:bg-gray-50"
                >
                  <TableCell className="font-medium">
                    {donation._id.slice(-6)}
                  </TableCell>
                  <TableCell>{donation.campaignId._id.slice(-6)}</TableCell>
                  <TableCell>{maskPhoneNumber(donation.donorPhone)}</TableCell>
                  <TableCell>${donation.amountPaid.toFixed(2)}</TableCell>
                  <TableCell>{formatDate(donation.createdAt)}</TableCell>
                  <TableCell className="capitalize">
                    {formatPaymentMethod(donation.paymentMethod)}
                  </TableCell>
                  <TableCell>{getStatusBadge(donation.paymentStatus)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700 rounded-full"
                        onClick={() => handleViewDetails(donation._id)}
                        disabled={isLoadingDetails && selectedDonationId === donation._id}
                      >
                        {isLoadingDetails && selectedDonationId === donation._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Eye className="h-4 w-4 text-white" />
                        )}
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
      {meta.total > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {showingStart} to {showingEnd} of {meta.total} donations
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 rounded-lg"
            >
              Next &gt;
            </Button>
          </div>
        </div>
      )}

      <DonationDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        donation={getDonationDataForModal()}
        isLoading={isLoadingDetails}
      />
    </div>
  );
}

export default DonationTable;