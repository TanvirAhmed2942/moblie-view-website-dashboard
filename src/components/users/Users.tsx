"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import provideIcon from "@/utils/provideIcon";
import DeleteConfirmationDialog from "../confirmation/deleteConfirmationDialog";
import PaginationComponent from "../ui/pagination-component";

function UsersTable() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const handleDeleteClick = (userName: string, userEmail: string) => {
    setSelectedUser({ name: userName, email: userEmail });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedUser) {
      console.log(
        `Deleting user: ${selectedUser.name} (${selectedUser.email})`
      );
      // Here you would typically make an API call to delete the user
      // For now, we'll just close the modal
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const tableData = [
    {
      organizerName: "Hope School",
      email: "hope@school.com",
      totalCampaigns: 10,
      joinedDate: "04/08/2025",
      status: "Active",
    },
    {
      organizerName: "Green Valley School",
      email: "greenvalley@school.com",
      totalCampaigns: 8,
      joinedDate: "03/08/2025",
      status: "Pending",
    },
    {
      organizerName: "Sunshine Academy",
      email: "sunshine@academy.com",
      totalCampaigns: 15,
      joinedDate: "02/08/2025",
      status: "Suspended",
    },
    {
      organizerName: "Mountain View School",
      email: "mountain@school.com",
      totalCampaigns: 12,
      joinedDate: "01/08/2025",
      status: "Active",
    },
    {
      organizerName: "Ocean Side School",
      email: "ocean@school.com",
      totalCampaigns: 6,
      joinedDate: "31/07/2025",
      status: "Active",
    },
    {
      organizerName: "Forest Hill Academy",
      email: "forest@academy.com",
      totalCampaigns: 9,
      joinedDate: "30/07/2025",
      status: "Pending",
    },
    {
      organizerName: "City Center School",
      email: "city@school.com",
      totalCampaigns: 14,
      joinedDate: "29/07/2025",
      status: "Active",
    },
    {
      organizerName: "Riverside Academy",
      email: "riverside@academy.com",
      totalCampaigns: 7,
      joinedDate: "28/07/2025",
      status: "Active",
    },
    {
      organizerName: "Hilltop School",
      email: "hilltop@school.com",
      totalCampaigns: 11,
      joinedDate: "27/07/2025",
      status: "Suspended",
    },
    {
      organizerName: "Valley View School",
      email: "valley@school.com",
      totalCampaigns: 13,
      joinedDate: "26/07/2025",
      status: "Active",
    },
    {
      organizerName: "Pine Tree Academy",
      email: "pine@academy.com",
      totalCampaigns: 5,
      joinedDate: "25/07/2025",
      status: "Suspended",
    },
    {
      organizerName: "Golden Gate School",
      email: "golden@school.com",
      totalCampaigns: 16,
      joinedDate: "24/07/2025",
      status: "Pending",
    },
    {
      organizerName: "Blue Sky Academy",
      email: "blue@academy.com",
      totalCampaigns: 4,
      joinedDate: "23/07/2025",
      status: "Active",
    },
    {
      organizerName: "Redwood School",
      email: "redwood@school.com",
      totalCampaigns: 18,
      joinedDate: "22/07/2025",
      status: "Suspended",
    },
    {
      organizerName: "Silver Lake Academy",
      email: "silver@academy.com",
      totalCampaigns: 3,
      joinedDate: "21/07/2025",
      status: "Active",
    },
  ];
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex justify-between w-full">
        <CardTitle className="flex items-center justify-between gap-2 w-full">
          <h1>User Management</h1>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger>Last weeks</SelectTrigger>
              <SelectContent>
                <SelectItem value="Lastweek">Last weeks</SelectItem>
                <SelectItem value="Lastmonth">Last month</SelectItem>
                <SelectItem value="Lastyear">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>Status</SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full rounded-md border whitespace-nowrap">
          <Table className="bg-white ">
            <TableHeader>
              <TableRow className="bg-gray-200">
                <TableHead className="w-1/6">Organizer Name</TableHead>
                <TableHead className="w-2/6">Email Address</TableHead>
                <TableHead className="w-1/6">Total Campaigns</TableHead>
                <TableHead className="w-1/6">Joined Date</TableHead>
                <TableHead className="w-1/6">Status</TableHead>
                <TableHead className="w-1/6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((data, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium w-1/6">
                    {data.organizerName}
                  </TableCell>
                  <TableCell className="w-1/6">{data.email}</TableCell>
                  <TableCell className="w-1/6">{data.totalCampaigns}</TableCell>
                  <TableCell className="w-1/6">{data.joinedDate}</TableCell>
                  <TableCell className="w-1/6">
                    <span
                      className={`p-2 rounded-lg text-center font-medium text-xs inline-block w-20 ${
                        data.status === "Active"
                          ? "bg-[#f6fafb] text-[#00705d]"
                          : "bg-[#fef8f8] text-red-500"
                      }`}
                    >
                      {data.status === "Active" ? "Active" : "Suspended"}
                    </span>
                  </TableCell>
                  <TableCell className="w-1/6 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-white border-none shadow-none hover:bg-lime-100"
                      >
                        {provideIcon({ name: "check" })}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-white border-none shadow-none hover:bg-red-50"
                        onClick={() =>
                          handleDeleteClick(data.organizerName, data.email)
                        }
                      >
                        {provideIcon({ name: "trash" })}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter></TableFooter>
          </Table>
        </ScrollArea>

        {/* Pagination Component using Shadcn UI */}
        <div className="mt-6">
          <PaginationComponent
            totalItems={tableData.length}
            itemsPerPage={6}
            showInfo={true}
            onPageChange={(page) => {
              console.log(`Users page changed to: ${page}`);
              // You can add additional logic here if needed
            }}
          />
        </div>
      </CardContent>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        itemName={selectedUser?.name}
        itemType="user"
        confirmButtonText="Delete User"
        cancelButtonText="Cancel"
        variant="destructive"
      />
    </Card>
  );
}

export default UsersTable;
