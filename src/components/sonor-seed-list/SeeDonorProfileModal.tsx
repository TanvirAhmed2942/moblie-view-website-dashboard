"use client";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
  CreditCard,
  Phone,
  Search,
  Shield,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// Types based on API responses
export interface Invitation {
  _id: string;
  type: string;
  campaignId: {
    _id: string;
    title: string;
  };
  isDonated: boolean;
  invitationFromUser: {
    _id: string;
    name: string;
    contact: string;
    image: string;
  };
  invitationFromPhone: string;
  invitationForPhone: string;
  invitationForName: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  campaignTitle?: string;
}

export interface Transaction {
  _id: string;
  donorId: {
    _id: string;
    name: string;
    contact: string;
    image: string;
    userLevel: string;
    createdAt: string;
  };
  donorPhone: string;
  paymentMethod: string;
  campaignTitle: string;
  transactionId: string;
  amountPaid: number;
  campaignId: {
    _id: string;
    title: string;
  };
  paymentStatus: "pending" | "completed" | "failed";
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DonorProfileData {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  orgName: string;
  orgType: string;
  totalDonations: string;
  totalRaised: string;
  totalInvited: number;
  joinDate: string;
  latestDonationDate: string;
  contact: string;
  userLevel: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SeeDonorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor: DonorProfileData | null;
  invitations?: Invitation[];
  transactions?: Transaction[];
  invitationMeta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  transactionMeta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  onDonationPageChange: (page: number) => void;
  onInviteePageChange: (page: number) => void;
  currentDonationPage: number;
  currentInviteePage: number;
  isLoadingDetails?: boolean;
}

function SeeDonorProfileModal({
  isOpen,
  onClose,
  donor,
  invitations = [],
  transactions = [],
  invitationMeta,
  transactionMeta,
  onDonationPageChange,
  onInviteePageChange,
  currentDonationPage,
  currentInviteePage,
  isLoadingDetails = false,
}: SeeDonorProfileModalProps) {
  const [donationSearchQuery, setDonationSearchQuery] = useState("");
  const [inviteeSearchQuery, setInviteeSearchQuery] = useState("");

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setDonationSearchQuery("");
      setInviteeSearchQuery("");
    }
  }, [isOpen]);

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Format payment method
  const formatPaymentMethod = (method: string) => {
    if (!method) return "Unknown";
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  // Filter donations based on search (client-side filtering for search only)
  const filteredDonations = transactions.filter(
    (transaction) =>
      transaction?.campaignTitle?.toLowerCase()?.includes(donationSearchQuery?.toLowerCase()) ||
      transaction?.transactionId?.toLowerCase()?.includes(donationSearchQuery?.toLowerCase()) ||
      transaction?.paymentMethod?.toLowerCase()?.includes(donationSearchQuery?.toLowerCase())
  );

  // Filter invitees based on search (client-side filtering for search only)
  const filteredInvitees = invitations.filter(
    (invitee) =>
      invitee?.invitationForName?.toLowerCase()?.includes(inviteeSearchQuery?.toLowerCase()) ||
      invitee?.invitationForPhone?.toLowerCase()?.includes(inviteeSearchQuery?.toLowerCase()) ||
      (invitee?.campaignTitle || invitee?.campaignId?.title)?.toLowerCase()?.includes(inviteeSearchQuery?.toLowerCase())
  );

  // Calculate accepted and pending invitees
  const acceptedInvitees = invitations.filter(inv => inv.isDonated).length;
  const pendingInvitees = invitations.filter(inv => !inv.isDonated).length;

  // Get pagination metadata from API
  const donationTotalPages = transactionMeta?.totalPage || 1;
  const donationTotal = transactionMeta?.total || filteredDonations.length;
  const donationCurrentPage = currentDonationPage;
  const donationLimit = transactionMeta?.limit || 5;

  const inviteeTotalPages = invitationMeta?.totalPage || 1;
  const inviteeTotal = invitationMeta?.total || filteredInvitees.length;
  const inviteeCurrentPage = currentInviteePage;
  const inviteeLimit = invitationMeta?.limit || 5;

  // Calculate showing text
  const showingDonationsStart = donationTotal > 0 ? ((donationCurrentPage - 1) * donationLimit) + 1 : 0;
  const showingDonationsEnd = Math.min(donationCurrentPage * donationLimit, donationTotal);

  const showingInviteesStart = inviteeTotal > 0 ? ((inviteeCurrentPage - 1) * inviteeLimit) + 1 : 0;
  const showingInviteesEnd = Math.min(inviteeCurrentPage * inviteeLimit, inviteeTotal);

  // Check if we're on the last page
  const isDonationLastPage = donationCurrentPage === donationTotalPages;
  const isInviteeLastPage = inviteeCurrentPage === inviteeTotalPages;

  // Generate page buttons for pagination
  const renderPageButtons = (currentPage: number, totalPages: number, setPage: (page: number) => void, type: 'donation' | 'invitee') => {
    const buttons = [];

    if (totalPages === 0 || totalPages === 1) return buttons;

    // Always show first page
    buttons.push(
      <Button
        key={1}
        variant={currentPage === 1 ? "default" : "ghost"}
        className={`px-3 py-2 h-9 text-sm rounded-lg ${currentPage === 1
          ? "bg-purple-600 hover:bg-purple-700 text-white"
          : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
          }`}
        onClick={() => setPage(1)}
      >
        1
      </Button>
    );

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) {
      buttons.push(<span key="ellipsis1" className="px-1 text-gray-500">...</span>);
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "ghost"}
            className={`px-3 py-2 h-9 text-sm rounded-lg ${currentPage === i
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
              }`}
            onClick={() => setPage(i)}
          >
            {i}
          </Button>
        );
      }
    }

    if (endPage < totalPages - 1) {
      buttons.push(<span key="ellipsis2" className="px-1 text-gray-500">...</span>);
    }

    // Always show last page if there is more than 1 page
    if (totalPages > 1) {
      buttons.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "default" : "ghost"}
          className={`px-3 py-2 h-9 text-sm rounded-lg ${currentPage === totalPages
            ? "bg-purple-600 hover:bg-purple-700 text-white"
            : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
            }`}
          onClick={() => setPage(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  if (!donor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="min-w-5xl max-w-7xl max-h-[95vh] overflow-y-auto p-0"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b p-6 pb-4">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Donor Profile - {donor.name}
              </DialogTitle>
              {isLoadingDetails && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600"></div>
                  <span className="text-sm text-gray-500">Loading data...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Donor Information */}
            <Card className="lg:col-span-1 bg-purple-50 border-purple-200 p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {donor.name}
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Organization</p>
                      <p className="text-base font-semibold text-gray-900">
                        {donor.orgName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="text-base font-semibold text-gray-900">
                        {donor.orgType}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {donor.status === "Active" ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                        {donor.status}
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100">
                        {donor.status}
                      </Badge>
                    )}
                    {donor.verified && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100">
                      {donor.userLevel}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-purple-200">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Total Donated</p>
                      <p className="text-base font-bold text-gray-900">
                        {donor.totalDonations}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Total Raised</p>
                      <p className="text-base font-bold text-gray-900">
                        {donor.totalRaised}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Accepted Invitees</p>
                      <p className="text-base font-bold text-gray-900">
                        {acceptedInvitees}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-500">Pending Invitees</p>
                      <p className="text-base font-bold text-gray-900">
                        {pendingInvitees}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Total Invited</p>
                      <p className="text-base font-bold text-gray-900">
                        {donor.totalInvited}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="text-base font-bold text-gray-900">
                        {donor.contact}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Join Date</p>
                      <p className="text-base font-bold text-gray-900">
                        {donor.joinDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Latest Donation</p>
                      <p className="text-base font-bold text-gray-900">
                        {donor.latestDonationDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Right Panel - Tables */}
            <div className="lg:col-span-2 space-y-6">
              {/* Donation History Section */}
              <Card className="bg-purple-50 border-purple-200 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      Donation History ({donationTotal})
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by campaign or transaction..."
                        value={donationSearchQuery}
                        onChange={(e) => setDonationSearchQuery(e.target.value)}
                        className="pl-10 w-64 border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-purple-50 hover:bg-purple-50">
                          <TableHead className="text-gray-700 font-semibold">
                            Transaction ID
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Campaign
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Date
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Amount
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Method
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDonations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              {donationSearchQuery ? "No matching donations found" : "No donation history found"}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredDonations.map((transaction) => (
                            <TableRow
                              key={transaction._id}
                              className="bg-white hover:bg-gray-50"
                            >
                              <TableCell className="font-medium">
                                {transaction.transactionId}
                              </TableCell>
                              <TableCell>{transaction.campaignTitle}</TableCell>
                              <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                              <TableCell>${transaction.amountPaid}</TableCell>
                              <TableCell className="capitalize">
                                {formatPaymentMethod(transaction.paymentMethod)}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(transaction.paymentStatus)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination for Donation History */}
                  {donationTotal > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Showing {showingDonationsStart} to {showingDonationsEnd} of {donationTotal} donations
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          disabled={donationCurrentPage === 1 || isLoadingDetails}
                          onClick={() => onDonationPageChange(donationCurrentPage - 1)}
                          className="px-3 py-2 h-9 text-sm border-gray-300 text-gray-700 disabled:opacity-50 rounded-lg"
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {renderPageButtons(donationCurrentPage, donationTotalPages, onDonationPageChange, 'donation')}
                        </div>
                        <Button
                          variant="default"
                          disabled={isDonationLastPage || isLoadingDetails}
                          onClick={() => onDonationPageChange(donationCurrentPage + 1)}
                          className="px-3 py-2 h-9 text-sm bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 rounded-lg"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Invitee List Section */}
              <Card className="bg-purple-50 border-purple-200 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      Invitee List ({inviteeTotal})
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name or phone..."
                        value={inviteeSearchQuery}
                        onChange={(e) => setInviteeSearchQuery(e.target.value)}
                        className="pl-10 w-64 border-gray-300"
                      />
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-purple-50 hover:bg-purple-50">
                          <TableHead className="text-gray-700 font-semibold">
                            Name
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Phone
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Campaign
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Invitation Date
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Donated
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvitees.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                              {inviteeSearchQuery ? "No matching invitees found" : "No invitees found"}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredInvitees.map((invitee) => (
                            <TableRow
                              key={invitee._id}
                              className="bg-white hover:bg-gray-50"
                            >
                              <TableCell className="font-medium">
                                {invitee.invitationForName}
                              </TableCell>
                              <TableCell>{invitee.invitationForPhone}</TableCell>
                              <TableCell>{invitee.campaignTitle || invitee.campaignId.title}</TableCell>
                              <TableCell>{formatDate(invitee.createdAt)}</TableCell>
                              <TableCell>
                                {invitee.isDonated ? (
                                  <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                                    Yes
                                  </Badge>
                                ) : (
                                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
                                    No
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination for Invitee List */}
                  {inviteeTotal > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Showing {showingInviteesStart} to {showingInviteesEnd} of {inviteeTotal} invitees
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          disabled={inviteeCurrentPage === 1 || isLoadingDetails}
                          onClick={() => onInviteePageChange(inviteeCurrentPage - 1)}
                          className="px-3 py-2 h-9 text-sm border-gray-300 text-gray-700 disabled:opacity-50 rounded-lg"
                        >
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {renderPageButtons(inviteeCurrentPage, inviteeTotalPages, onInviteePageChange, 'invitee')}
                        </div>
                        <Button
                          variant="default"
                          disabled={isInviteeLastPage || isLoadingDetails}
                          onClick={() => onInviteePageChange(inviteeCurrentPage + 1)}
                          className="px-3 py-2 h-9 text-sm bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 rounded-lg"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SeeDonorProfileModal;