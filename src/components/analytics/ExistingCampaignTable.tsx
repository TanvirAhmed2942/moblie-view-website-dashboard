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
import { useGetCampaignQuery } from '../../features/campaign/campaignApi';

interface Campaign {
  _id: string;
  title: string;
  overall_raised: number;
  targetAmount: number;
  startDate: string;
  campaignStatus: string;
  total_invitees: number;
  // Additional fields from API that might be useful
  endDate: string;
  createdAt: string;
  // You might need to add donor count if available in your API
  // donorsCount: number;
}

// Helper function to determine status based on dates
const getCampaignStatus = (campaign: Campaign): "Active" | "Upcoming" | "Completed" => {
  const now = new Date();
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);

  if (now < startDate) {
    return "Upcoming";
  } else if (now > endDate) {
    return "Completed";
  } else {
    return "Active";
  }
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// Helper function to calculate progress percentage
const calculateProgress = (raised: number, target: number) => {
  if (target === 0) return 0;
  const progress = (raised / target) * 100;
  return Math.min(Math.round(progress), 100);
};

function ExistingCampaignTable() {
  const { data: campaignsResponse, isLoading } = useGetCampaignQuery({});

  const campaigns: Campaign[] = campaignsResponse?.data?.result
    ? campaignsResponse.data.result.slice(0, 5)
    : [];

  const getStatusBadge = (status: "Active" | "Upcoming" | "Completed") => {
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

  // Show loading state
  if (isLoading) {
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
        <div className="border rounded-lg p-8 text-center">
          <div className="animate-pulse">Loading campaigns...</div>
        </div>
      </div>
    );
  }

  // Show empty state if no campaigns
  if (!campaigns || campaigns.length === 0) {
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
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-500">No campaigns found</p>
        </div>
      </div>
    );
  }

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

            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => {
              const status = getCampaignStatus(campaign);
              return (
                <TableRow key={campaign._id} className="bg-white hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {campaign.title}
                  </TableCell>
                  <TableCell>
                    {/* Using total_invitees as donors count - adjust if you have actual donor count */}
                    {campaign.total_invitees || 0}
                  </TableCell>
                  <TableCell>
                    {/* This could be average donation amount - adjust based on your data */}
                    {formatCurrency(campaign.overall_raised > 0 && campaign.total_invitees > 0
                      ? campaign.overall_raised / campaign.total_invitees
                      : 0)}
                  </TableCell>
                  <TableCell>{formatDate(campaign.startDate)}</TableCell>
                  <TableCell>{getStatusBadge(status)}</TableCell>
                  <TableCell>{formatCurrency(campaign.overall_raised)}</TableCell>
                  <TableCell>{formatCurrency(campaign.targetAmount)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ExistingCampaignTable;