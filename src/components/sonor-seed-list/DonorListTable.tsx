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
import { Search } from "lucide-react";

interface Donor {
  id: string;
  campaignId: string;
  phoneNumber: string;
  seedDonorName: string;
  status: "Active" | "Inactive";
  memoAmount: string;
  joinDate: string;
  donationDate: string;
  rippleLevel: number;
}

const donors: Donor[] = [
  {
    id: "1",
    campaignId: "#1253",
    phoneNumber: "+097***543",
    seedDonorName: "Adbur Rahim",
    status: "Active",
    memoAmount: "$2342.00",
    joinDate: "12-02-2025",
    donationDate: "12-02-2025",
    rippleLevel: 1,
  },
  {
    id: "2",
    campaignId: "#1253",
    phoneNumber: "+097***543",
    seedDonorName: "Adbur Rahim",
    status: "Active",
    memoAmount: "$2342.00",
    joinDate: "12-02-2025",
    donationDate: "12-02-2025",
    rippleLevel: 3,
  },
  {
    id: "3",
    campaignId: "#1253",
    phoneNumber: "+097***543",
    seedDonorName: "Adbur Rahim",
    status: "Active",
    memoAmount: "$2020.00",
    joinDate: "02--01-2015",
    donationDate: "02--01-2015",
    rippleLevel: 3,
  },
  {
    id: "4",
    campaignId: "#1253",
    phoneNumber: "+097***543",
    seedDonorName: "Adbur Rahim",
    status: "Inactive",
    memoAmount: "$2020.00",
    joinDate: "02--01-2015",
    donationDate: "02--01-2015",
    rippleLevel: 2,
  },
  {
    id: "5",
    campaignId: "#1253",
    phoneNumber: "+097***543",
    seedDonorName: "Adbur Rahim",
    status: "Active",
    memoAmount: "$2020.00",
    joinDate: "02--01-2015",
    donationDate: "02--01-2015",
    rippleLevel: 1,
  },
];

function DonorListTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch =
      donor.seedDonorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.campaignId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || donor.status === statusFilter;
    const matchesLevel =
      levelFilter === "all" || donor.rippleLevel.toString() === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Donor List</h1>
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
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-40 border-gray-300">
              <SelectValue placeholder="Level: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Level: All</SelectItem>
              <SelectItem value="1">Level: 1</SelectItem>
              <SelectItem value="2">Level: 2</SelectItem>
              <SelectItem value="3">Level: 3</SelectItem>
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
                Join Date
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Donation Date
              </TableHead>
              <TableHead className="text-gray-700 font-semibold">
                Ripple Level
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonors.map((donor) => (
              <TableRow key={donor.id} className="bg-white hover:bg-gray-50">
                <TableCell className="font-medium">
                  {donor.campaignId}
                </TableCell>
                <TableCell>{donor.phoneNumber}</TableCell>
                <TableCell>{donor.seedDonorName}</TableCell>
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
                <TableCell>{donor.donationDate}</TableCell>
                <TableCell>{donor.rippleLevel}</TableCell>
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
    </div>
  );
}

export default DonorListTable;
