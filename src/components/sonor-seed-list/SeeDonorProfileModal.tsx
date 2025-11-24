"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  ArrowLeft,
  Search,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Card } from "../ui/card";

export interface DonorProfileData {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  orgName: string;
  orgType: string;
  totalDonations: string;
  acceptedInvitees: number;
  pendingInvitees: number;
  joinDate: string;
}

interface DonationHistory {
  transactionId: string;
  campaign: string;
  date: string;
  amount: string;
}

interface Invitee {
  name: string;
  email: string;
  joinDate: string;
  donationAmount: string;
}

interface SeeDonorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  donor: DonorProfileData | null;
}

function SeeDonorProfileModal({
  isOpen,
  onClose,
  donor,
}: SeeDonorProfileModalProps) {
  const [donationSearchQuery, setDonationSearchQuery] = useState("");
  const [inviteeSearchQuery, setInviteeSearchQuery] = useState("");
  const [donationPage, setDonationPage] = useState(1);
  const [inviteePage, setInviteePage] = useState(1);

  if (!donor) return null;

  // Sample data - in real app, this would come from props or API
  const donationHistory: DonationHistory[] = [
    {
      transactionId: "TRDWZ12312D",
      campaign: "Her Freedom Journey",
      date: "12-02-2025",
      amount: "$2342.00",
    },
    {
      transactionId: "TRDWZ12312D",
      campaign: "Healing After Darkness",
      date: "12-02-2025",
      amount: "$2342.00",
    },
    {
      transactionId: "TRDWZ12312D",
      campaign: "She Deserves Safety",
      date: "02--01-2015",
      amount: "$2020.00",
    },
  ];

  const invitees: Invitee[] = [
    {
      name: "Mir Jafor",
      email: "Mirjafor@Gmail.Com",
      joinDate: "12-02-2025",
      donationAmount: "$2342.00",
    },
    {
      name: "Mir Jafor",
      email: "Mirjafor@Gmail.Com",
      joinDate: "12-02-2025",
      donationAmount: "$2342.00",
    },
    {
      name: "Mir Jafor",
      email: "Mirjafor@Gmail.Com",
      joinDate: "02--01-2015",
      donationAmount: "$2020.00",
    },
  ];

  const filteredDonations = donationHistory.filter(
    (donation) =>
      donation.campaign
        .toLowerCase()
        .includes(donationSearchQuery.toLowerCase()) ||
      donation.transactionId
        .toLowerCase()
        .includes(donationSearchQuery.toLowerCase())
  );

  const filteredInvitees = invitees.filter(
    (invitee) =>
      invitee.name.toLowerCase().includes(inviteeSearchQuery.toLowerCase()) ||
      invitee.email.toLowerCase().includes(inviteeSearchQuery.toLowerCase())
  );

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
                Donor Profile
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 mt-1">
                Detailed view of donor information and activity
              </DialogDescription>
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
                      <p className="text-sm text-gray-500">Org Name</p>
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
                  <div className="mt-4">
                    {donor.status === "Active" ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-purple-200">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Total Donations</p>
                      <p className="text-base font-bold text-gray-900">
                        {donor.totalDonations}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Accepted Invitees</p>
                      <p className="text-base font-bold text-gray-900">
                        {donor.acceptedInvitees}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-500">Pending Invitees</p>
                      <p className="text-base font-bold text-gray-900">
                        {donor.pendingInvitees}
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
                      Donation History
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search..."
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
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDonations.map((donation, index) => (
                          <TableRow
                            key={`${donation.transactionId}-${index}`}
                            className="bg-white hover:bg-gray-50"
                          >
                            <TableCell className="font-medium">
                              {donation.transactionId}
                            </TableCell>
                            <TableCell>{donation.campaign}</TableCell>
                            <TableCell>{donation.date}</TableCell>
                            <TableCell>{donation.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      disabled={donationPage === 1}
                      className="px-4 py-2 border-gray-300 text-gray-700 disabled:opacity-50 rounded-lg"
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={donationPage === 1 ? "default" : "ghost"}
                        className={`px-4 py-2 rounded-lg ${
                          donationPage === 1
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
                        }`}
                        onClick={() => setDonationPage(1)}
                      >
                        1
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
                        onClick={() => setDonationPage(2)}
                      >
                        2
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
                        onClick={() => setDonationPage(3)}
                      >
                        3
                      </Button>
                      <span className="px-2 text-gray-700">...</span>
                      <Button
                        variant="ghost"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
                        onClick={() => setDonationPage(6)}
                      >
                        6
                      </Button>
                    </div>
                    <Button
                      variant="default"
                      disabled={donationPage === 6}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 rounded-lg"
                    >
                      Next &gt;
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Invitee List Section */}
              <Card className="bg-purple-50 border-purple-200 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      Invitee list
                    </h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search..."
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
                            Email
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Join Date
                          </TableHead>
                          <TableHead className="text-gray-700 font-semibold">
                            Donation Amount
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvitees.map((invitee, index) => (
                          <TableRow
                            key={`${invitee.email}-${index}`}
                            className="bg-white hover:bg-gray-50"
                          >
                            <TableCell className="font-medium">
                              {invitee.name}
                            </TableCell>
                            <TableCell>{invitee.email}</TableCell>
                            <TableCell>{invitee.joinDate}</TableCell>
                            <TableCell>{invitee.donationAmount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      disabled={inviteePage === 1}
                      className="px-4 py-2 border-gray-300 text-gray-700 disabled:opacity-50 rounded-lg"
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={inviteePage === 1 ? "default" : "ghost"}
                        className={`px-4 py-2 rounded-lg ${
                          inviteePage === 1
                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                            : "text-gray-700 hover:bg-gray-100 bg-white border border-gray-300"
                        }`}
                        onClick={() => setInviteePage(1)}
                      >
                        1
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
                        onClick={() => setInviteePage(2)}
                      >
                        2
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
                        onClick={() => setInviteePage(3)}
                      >
                        3
                      </Button>
                      <span className="px-2 text-gray-700">...</span>
                      <Button
                        variant="ghost"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
                        onClick={() => setInviteePage(15)}
                      >
                        15
                      </Button>
                    </div>
                    <Button
                      variant="default"
                      disabled={inviteePage === 15}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 rounded-lg"
                    >
                      Next &gt;
                    </Button>
                  </div>
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
