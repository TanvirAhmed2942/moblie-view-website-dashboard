"use client";
import { Calendar, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useSendMessageMutation } from '../../features/donations/donationsApi';
import { RTKError } from '../../utils/type';
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

export interface DonationData {
  id: string;
  campaignId: string;
  campaignName: string;
  donorPhoneNumber: string;
  donationAmount: string;
  date: string;
  paymentStatus: "Pending" | "Successful" | "Failed";
  paymentMethod?: string;
  transactionId?: string;
  donorId?: string;
  createdAt?: string;
  updatedAt?: string;
  amount?: number;
}

interface DonationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: DonationData | null;
  isLoading?: boolean; // Add this line
}

function DonationDetailsModal({
  isOpen,
  onClose,
  donation,
  isLoading = false // Add this with default value
}: DonationDetailsModalProps) {
  const [message, setMessage] = useState("");
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  // Initialize message when donation data is available
  useEffect(() => {
    if (donation) {
      setMessage(
        `Hello Donor,\nThanks to your support, we've received ${donation?.donationAmount} donation!\nYour contribution is inspiring change and making a real impact. Let's keep the momentum going together!\nThank you for being part of this journey.\nBest,\nPassitAlong Team!`
      );
    }
  }, [donation]);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="overflow-y-auto max-h-[70vh]">
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading donation details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!donation) return null;

  const getStatusBadge = (status: DonationData["paymentStatus"]) => {
    switch (status) {
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
            <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
            Pending
          </Badge>
        );
      case "Successful":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
            Successful
          </Badge>
        );
      case "Failed":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">
            <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleSend = async () => {
    try {
      const response = await sendMessage({
        id: donation.id,
        data: { message }
      }).unwrap();

      toast.success(response.message || "Message sent successfully!");
      onClose();
    } catch (error: unknown) {
      const err = error as RTKError;
      toast.error(err?.data?.message || "Failed to send message. Please try again.");
    }
  };

  const isSuccessful = donation.paymentStatus === "Successful";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="overflow-y-auto max-h-[70vh]"
      >
        {/* Custom Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none bg-red-600 hover:bg-red-700 p-1"
        >
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="text-left pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Donation Details
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Viewing donation {donation.id.slice(-6)}
          </DialogDescription>
        </DialogHeader>

        {/* Donation Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* Left Column */}
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-500">Donation ID</label>
              <p className="text-base font-bold text-gray-900 mt-1">
                {donation.id}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Donation Amount</label>
              <p className="text-base font-bold text-orange-500 mt-1">
                {donation.donationAmount}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                Date
              </label>
              <p className="text-base font-bold text-gray-900 mt-1">
                {donation.date}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Transaction ID</label>
              <p className="text-base font-bold text-gray-900 mt-1">
                {donation.transactionId || "N/A"}
              </p>
            </div>
            {donation.donorId && (
              <div>
                <label className="text-sm text-gray-500">Donor ID</label>
                <p className="text-base font-bold text-gray-900 mt-1">
                  {donation.donorId}
                </p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-500">
                Donor Phone Number
              </label>
              <p className="text-base font-bold text-gray-900 mt-1">
                {donation.donorPhoneNumber}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Campaign Name</label>
              <p className="text-base font-bold text-gray-900 mt-1">
                {donation.campaignName}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Payment Method</label>
              <p className="text-base font-bold text-gray-900 mt-1">
                {donation.paymentMethod || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Payment Status</label>
              <div className="mt-1">
                {getStatusBadge(donation.paymentStatus)}
              </div>
            </div>
            {donation.campaignId && (
              <div>
                <label className="text-sm text-gray-500">Campaign ID</label>
                <p className="text-base font-bold text-gray-900 mt-1">
                  {donation.campaignId}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        {(donation.createdAt || donation.updatedAt) && (
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {donation.createdAt && (
                <div>
                  <label className="text-sm text-gray-500">Created At</label>
                  <p className="text-base text-gray-900 mt-1">
                    {new Date(donation.createdAt).toLocaleString()}
                  </p>
                </div>
              )}
              {donation.updatedAt && (
                <div>
                  <label className="text-sm text-gray-500">Updated At</label>
                  <p className="text-base text-gray-900 mt-1">
                    {new Date(donation.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Update Message Section - only for successful payments */}
        {isSuccessful && (
          <div className="border-t pt-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Update Message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px] border-purple-300 border-dashed focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your message here..."
            />
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleSend}
                disabled={isSending}
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DonationDetailsModal;