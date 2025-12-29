"use client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

interface Campaign {
  id: string;
  campaignName: string;
  donorsCount: number;
  amount: string;
  startDate: string;
  status: "Active" | "Upcoming" | "Completed";
  totalRaised: string;
  target: string;
  progress: number;
}

const campaigns: Campaign[] = [
  {
    id: "1",
    campaignName: "Rise Beyond Trafficking",
    donorsCount: 224,
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
    amount: "$200.00",
    startDate: "12-12-2025",
    status: "Upcoming",
    totalRaised: "$88,000.00",
    target: "$100,000.00",
    progress: 0,
  },
  {
    id: "3",
    campaignName: "Rise Beyond Trafficking",
    donorsCount: 43,
    amount: "$200.00",
    startDate: "12-12-2025",
    status: "Completed",
    totalRaised: "$100,000.00",
    target: "$100,000.00",
    progress: 100,
  },
];

function ExistingCampaignTable() {
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
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Campaign Overview
        </h2>
        <Link
          href="/campaigns"
          className="text-green-600 hover:text-green-700 font-medium text-sm"
        >
          View All
        </Link>
      </div>

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id} className="bg-white hover:bg-gray-50">
                <TableCell className="font-medium">
                  {campaign.campaignName}
                </TableCell>
                <TableCell>{campaign.donorsCount}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ExistingCampaignTable;
