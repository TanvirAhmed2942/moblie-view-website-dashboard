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
import { Search, Eye, ArrowUp, ArrowDownToLine } from "lucide-react";
import DonationDetailsModal, { DonationData } from "./DonationDetailsModal";

interface Donation {
  id: string;
  campaignId: string;
  campaignName: string;
  donorPhoneNumber: string;
  donationAmount: string;
  date: string;
  paymentStatus: "Pending" | "Successful" | "Failed";
  paymentMethod?: string;
  transactionId?: string;
}

const donations: Donation[] = [
  {
    id: "#124524",
    campaignId: "#1253",
    campaignName: "Rise Beyond Trafficking",
    donorPhoneNumber: "+097***543",
    donationAmount: "$2342.00",
    date: "12-02-2025",
    paymentStatus: "Pending",
    paymentMethod: "Visa****4231",
    transactionId: "ch_2334knkdhNl",
  },
  {
    id: "#124524",
    campaignId: "#1253",
    campaignName: "Rise Beyond Trafficking",
    donorPhoneNumber: "+097***543",
    donationAmount: "$2020.00",
    date: "02-01-2015",
    paymentStatus: "Successful",
    paymentMethod: "Visa****4231",
    transactionId: "ch_2334knkdhNl",
  },
  {
    id: "#124524",
    campaignId: "#1253",
    campaignName: "Rise Beyond Trafficking",
    donorPhoneNumber: "+097***543",
    donationAmount: "$1200.00",
    date: "02-11-2022",
    paymentStatus: "Successful",
    paymentMethod: "Visa****4231",
    transactionId: "ch_2334knkdhNl",
  },
  {
    id: "#124524",
    campaignId: "#1253",
    campaignName: "Rise Beyond Trafficking",
    donorPhoneNumber: "+097***543",
    donationAmount: "$20900.00",
    date: "09-12-2021",
    paymentStatus: "Failed",
    paymentMethod: "Visa****4231",
    transactionId: "ch_2334knkdhNl",
  },
  {
    id: "#124524",
    campaignId: "#1253",
    campaignName: "Rise Beyond Trafficking",
    donorPhoneNumber: "+097***543",
    donationAmount: "$2342.00",
    date: "12-02-2025",
    paymentStatus: "Pending",
    paymentMethod: "Visa****4231",
    transactionId: "ch_2334knkdhNl",
  },
];

function DonationTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<DonationData | null>(
    null
  );

  const handleViewDetails = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDonation(null);
  };

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      donation.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.campaignId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.donorPhoneNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      donation.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || donation.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Donation["paymentStatus"]) => {
    switch (status) {
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "Successful":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
            Successful
          </Badge>
        );
      case "Failed":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleExport = () => {
    console.log("Exporting donations...");
    // Here you would implement the export functionality
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Donations List</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Q Search..."
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
              <SelectItem value="Pending">Status: Pending</SelectItem>
              <SelectItem value="Successful">Status: Successful</SelectItem>
              <SelectItem value="Failed">Status: Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleExport}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2"
          >
            <ArrowUp className="h-4 w-4 mr-2 rotate-45" />
            Export
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-50 hover:bg-purple-50">
              <TableHead className="text-gray-700 font-semibold">ID</TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Campaign ID
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Campaign Name
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
                Payment Status
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonations.map((donation, index) => (
              <TableRow
                key={`${donation.id}-${index}`}
                className="bg-white hover:bg-gray-50"
              >
                <TableCell className="font-medium">{donation.id}</TableCell>
                <TableCell>{donation.campaignId}</TableCell>
                <TableCell>{donation.campaignName}</TableCell>
                <TableCell>{donation.donorPhoneNumber}</TableCell>
                <TableCell>{donation.donationAmount}</TableCell>
                <TableCell>{donation.date}</TableCell>
                <TableCell>{getStatusBadge(donation.paymentStatus)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700 rounded-full"
                      onClick={() => handleViewDetails(donation)}
                    >
                      <Eye className="h-4 w-4 text-white" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 rounded-full"
                    >
                      <ArrowDownToLine className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          className="px-4 py-2 border-gray-300 text-gray-700 disabled:opacity-50 rounded-lg"
        >
          &lt; Previous
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
          <Button
            variant="ghost"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
            onClick={() => setCurrentPage(2)}
          >
            2
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
            onClick={() => setCurrentPage(3)}
          >
            3
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
            onClick={() => setCurrentPage(4)}
          >
            4
          </Button>
          <span className="px-2 text-gray-700">...</span>
          <Button
            variant="ghost"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 bg-white border border-gray-300 rounded-lg"
            onClick={() => setCurrentPage(25)}
          >
            25
          </Button>
        </div>
        <Button
          variant="default"
          disabled={currentPage === 25}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 rounded-lg"
        >
          Next &gt;
        </Button>
      </div>

      {/* Donation Details Modal */}
      <DonationDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        donation={selectedDonation}
      />
    </div>
  );
}

export default DonationTable;
