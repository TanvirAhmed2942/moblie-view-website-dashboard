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
import { Search, Eye } from "lucide-react";
import SeeDonorProfileModal, { DonorProfileData } from "./SeeDonorProfileModal";

interface Donor {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  memoAmount: string;
  joinDate: string;
  donationDate: string;
  inviteCount: number;
}

const donors: Donor[] = [
  {
    id: "1",
    name: "Adbur Rahim",
    status: "Active",
    memoAmount: "$2342.00",
    joinDate: "12-02-2025",
    donationDate: "12-02-2025",
    inviteCount: 12,
  },
  {
    id: "2",
    name: "Adbur Rahim",
    status: "Active",
    memoAmount: "$2020.00",
    joinDate: "02-01-2015",
    donationDate: "02-15-2015",
    inviteCount: 18,
  },
  {
    id: "3",
    name: "Adbur Rahim",
    status: "Active",
    memoAmount: "$2342.00",
    joinDate: "12-02-2025",
    donationDate: "03-20-2025",
    inviteCount: 25,
  },
  {
    id: "4",
    name: "Adbur Rahim",
    status: "Inactive",
    memoAmount: "$2020.00",
    joinDate: "02-01-2015",
    donationDate: "04-10-2015",
    inviteCount: 8,
  },
  {
    id: "5",
    name: "Adbur Rahim",
    status: "Active",
    memoAmount: "$2342.00",
    joinDate: "12-02-2025",
    donationDate: "05-15-2025",
    inviteCount: 116,
  },
  {
    id: "6",
    name: "Adbur Rahim",
    status: "Inactive",
    memoAmount: "$2020.00",
    joinDate: "02-01-2015",
    donationDate: "06-22-2015",
    inviteCount: 5,
  },
];

function SeedDonorListTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [editedDate, setEditedDate] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<DonorProfileData | null>(
    null
  );

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch = donor.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || donor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDateClick = (id: string, currentDate: string) => {
    setEditingDateId(id);
    setEditedDate(currentDate);
  };

  const handleDateBlur = (id: string) => {
    if (editingDateId === id) {
      // Here you would typically save the date to your backend
      console.log(`Updating date for donor ${id} to ${editedDate}`);
      setEditingDateId(null);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDate(e.target.value);
  };

  const handleViewProfile = (donor: Donor) => {
    // Transform donor data to match DonorProfileData interface
    const donorProfileData: DonorProfileData = {
      id: donor.id,
      name: donor.name,
      status: donor.status,
      orgName: "Ripple Effect Foundation", // Sample data - in real app, this would come from API
      orgType: "501(3) Non-Profit", // Sample data
      totalDonations: donor.memoAmount, // Using memoAmount as total donations
      acceptedInvitees: donor.inviteCount, // Sample - in real app, this would be calculated
      pendingInvitees: Math.floor(donor.inviteCount * 0.5), // Sample calculation
      joinDate: donor.joinDate,
    };
    setSelectedDonor(donorProfileData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDonor(null);
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Seed Donor List</h1>
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
                Name
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Status
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Memo Amount
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Join Date
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Donation Date
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Invite Count
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonors.map((donor) => (
              <TableRow key={donor.id} className="bg-white hover:bg-gray-50">
                <TableCell className="font-medium">{donor.name}</TableCell>
                <TableCell>
                  {donor.status === "Active" ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{donor.memoAmount}</TableCell>
                <TableCell>{donor.joinDate}</TableCell>
                <TableCell>
                  {editingDateId === donor.id ? (
                    <div className="relative">
                      <Input
                        type="text"
                        value={editedDate}
                        onChange={handleDateChange}
                        onBlur={() => handleDateBlur(donor.id)}
                        className="w-32 border-blue-500 border-2 rounded focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div
                      className="relative cursor-pointer"
                      onClick={() =>
                        handleDateClick(donor.id, donor.donationDate)
                      }
                    >
                      <span className="border-2 border-blue-500 rounded px-2 py-1 inline-block">
                        {donor.donationDate}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{donor.inviteCount}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700 rounded-full"
                    onClick={() => handleViewProfile(donor)}
                  >
                    <Eye className="h-4 w-4 text-white" />
                  </Button>
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
          className="px-4 py-2 border-gray-300 text-gray-700 disabled:opacity-50"
        >
          &lt; Previous
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant={currentPage === 1 ? "default" : "ghost"}
            className={`px-4 py-2 ${
              currentPage === 1
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setCurrentPage(1)}
          >
            1
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setCurrentPage(2)}
          >
            2
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setCurrentPage(3)}
          >
            3
          </Button>
          <Button
            variant="ghost"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setCurrentPage(4)}
          >
            4
          </Button>
          <span className="px-2 text-gray-700">...</span>
          <Button
            variant="ghost"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setCurrentPage(25)}
          >
            25
          </Button>
        </div>
        <Button
          variant="default"
          disabled={currentPage === 25}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
        >
          Next &gt;
        </Button>
      </div>

      {/* Donor Profile Modal */}
      <SeeDonorProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        donor={selectedDonor}
      />
    </div>
  );
}

export default SeedDonorListTable;
